import { useState } from 'react'
import Uploader from './components/Uploader'
import VideoPlayer from './components/VideoPlayer'

function App() {
    const [vidSrc, setVidSrc] = useState(null)

    return (
        <div className="w-screen h-screen bg-slate-300 bg-[url(/img/grid.svg)] ">
            <p className="fixed bottom-1 right-1 z-10">
                {vidSrc != null ? 'Source: ' + (vidSrc instanceof MediaStream ? 'webcam' : vidSrc.name) : ''}
            </p>

            <div className="flex fixed w-full h-full p-8">
                {vidSrc == null ? (
                <Uploader setVidSrc={setVidSrc} />
                ) : (
                <VideoPlayer src={vidSrc} setVidSrc={setVidSrc} />
                )}
            </div>
        </div>
    )
}

export default App
