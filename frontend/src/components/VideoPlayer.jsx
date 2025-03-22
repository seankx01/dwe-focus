import { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'

const sobelX = tf.tensor4d([-1, 0, 1,
                            -2, 0, 2,
                            -1, 0, 1], [3, 3, 1, 1])
const sobelY = tf.tensor4d([-1, -2, -1,
                            0, 0, 0,
                            1, 2, 1], [3, 3, 1, 1])

function sobel(imageTensor) {
    const edgesX = tf.conv2d(imageTensor, sobelX, [1, 1], 'same')
    const edgesY = tf.conv2d(imageTensor, sobelY, [1, 1], 'same')
    const edges = tf.add(edgesX.square(), edgesY.square()).sqrt()
    return edges
}

function closeMediaStream(source) {
    source.getTracks().forEach((track) => {track.stop()})
}

function VideoPlayer(props) {
    const [overlayVis, setOverlayVis] = useState(true)
    let overlayCtx = null
    let overlayRes = 0.55

    const vidPlayer = useRef(null)
    const overlay = useRef(null)

    const loadVidSrc = () => {
        if (vidPlayer.current != null) {
            if (props.src instanceof MediaStream && "srcObject" in vidPlayer.current) {
                vidPlayer.current.srcObject = props.src
            } else {
                vidPlayer.current.src = URL.createObjectURL(props.src)
            }
        }
    }
    useEffect(loadVidSrc, [vidPlayer, props.src])

    const initOverlay = () => {
        if (vidPlayer.current != null) {
            overlay.current.width = Math.round(vidPlayer.current.videoWidth * overlayRes)
            overlay.current.height = Math.round(vidPlayer.current.videoHeight * overlayRes)
            overlayCtx = overlay.current.getContext('2d')
        }
    }

    const redrawOverlay = async () => {
        if (overlayCtx != null && overlay.current != null) {
            tf.tidy(() => {
                const frameTensor = tf.browser.fromPixels(vidPlayer.current)
                    .mean(2)            // average pixel value across all channels (for grayscale)
                    .toFloat()          // convert to float (for conv2d)
                    .expandDims(-1)     // shrink to just one channel
                    .resizeBilinear([   // resize to fit canvas dimensions
                        overlay.current.height,
                        overlay.current.width
                    ], true)
                const sobelOutput = sobel(frameTensor)
                const alphaChannel = sobelOutput.greaterEqual(255)
                const overlayTensor = tf.concat([
                    tf.ones(alphaChannel.shape),     // R
                    tf.zeros(alphaChannel.shape),    // G
                    tf.zeros(alphaChannel.shape),    // B
                    alphaChannel
                ], 2)
                tf.browser.toPixels(overlayTensor, overlay.current)
                vidPlayer.current.requestVideoFrameCallback(redrawOverlay)
            })
        }
    }

    return (
        <div className="w-full h-full relative p-4 bg-white border-3 border-black shadow-lg">
            {props.src != null ? (
            <div className="w-full h-full relative flex justify-center">
                {/* Overlay */}
                <canvas className={"max-w-full max-h-full object-contain z-10 pointer-events-none" + " " + (overlayVis ? "" : "hidden")}
                        ref={overlay}></canvas>

                {/* Video player */}
                <video className="w-full h-full absolute" ref={vidPlayer} autoPlay loop controls muted
                    onLoadedData={()=>{initOverlay(); vidPlayer.current.requestVideoFrameCallback(redrawOverlay)}}></video>
            </div>
            ) : <></>}

            {/* Right side inputs */}
            <div className="absolute top-0 right-0 flex gap-1 m-2 z-20">
                {/* Toggle focus peaking */}
                <div className={"p-1 rounded-md border-1 cursor-pointer transition-all shadow-sm hover:bg-sky-200"
                                + " " + (overlayVis ? "bg-sky-200" : "bg-white")}
                    onClick={()=>{setOverlayVis(!overlayVis)}}>
                    Overlay {overlayVis ? "On" : "Off"}
                </div>
                {/* Exit to video source selection */}
                <div className="p-1 rounded-md bg-white border-1 cursor-pointer transition-all shadow-sm hover:bg-sky-200"
                    onClick={()=>{if(props.src instanceof MediaStream)closeMediaStream(props.src); props.setVidSrc(null)}}>
                    Exit
                </div>
            </div>

            {/* Left side inputs */}
            <div className="absolute top-0 left-0 flex gap-1 m-2 z-20">
                {/* Resolution slider */}
                <div className="p-1 rounded-md bg-white border-1 shadow-sm">
                    <p className="text-center">Quality</p>
                    <input className="w-40" type="range" min="10" max="100" step="5"
                            onChange={(e)=>{overlayRes=e.target.value/100; initOverlay();}}></input>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer