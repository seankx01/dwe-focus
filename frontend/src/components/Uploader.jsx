import { useRef } from 'react'

function Uploader(props) {
    const fileInput = useRef(null)

    const handleFileSelect = (e) => {
        props.setVidSrc(e.target.files[0])
    }

    const handleWebcamSelect = async() => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true})
            props.setVidSrc(stream)
        } catch(err) {
            alert(err)
        }
    }

    return (
        <div className="w-full h-full max-w-140 max-h-90 flex flex-col gap-2 m-auto p-4 bg-white border-4 border-black shadow-lg">
            <div className="w-full">
                <h1 className="text-3xl font-medium text-center">Select video source</h1>
            </div>

            {/* Hidden file input */}
            <input type="file" className="hidden" ref={fileInput} onChange={handleFileSelect}></input>

            <div className="w-full grow grid grid-cols-2">
                <div className="flex">
                    {/* Upload button */}
                    <div className="max-w-20 m-auto rounded-xl cursor-pointer transition-all hover:shadow-md hover:bg-sky-200 hover:ring-1 hover:scale-110"
                        onClick={()=>fileInput.current.click()}>
                        <svg className="w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="text-center text-lg">Upload</p>
                    </div>
                </div>
                <div className="flex">
                    {/* Webcam button */}
                    <div className="max-w-20 m-auto rounded-xl cursor-pointer transition-all hover:shadow-md hover:bg-sky-200 hover:ring-1 hover:scale-110"
                        onClick={handleWebcamSelect}>
                        <svg className="w-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                        <p className="text-center text-lg">Webcam</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Uploader