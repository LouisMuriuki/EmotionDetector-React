import './App.css';
import React, { useRef } from 'react'
import * as faceapi from 'face-api.js'
function App() {
  const imgRef = useRef()
  const canvasRef = useRef()
  //async because it going to take time to load images
  const handleImage = async () => {
    const detections = await faceapi.detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks()
      .withFaceExpressions()
      
      
      console.log(detections)

    //create canvas
    canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(imgRef.current)
    faceapi.matchDimensions(canvasRef.current, {
      width: 940,
      height: 650,
    })
    const resized = faceapi.resizeResults(detections, {
      width: 940,
      height: 650,
    })

    faceapi.draw.drawDetections(canvasRef.current, resized) //draw detections
    faceapi.draw.drawFaceExpressions(canvasRef.current, resized) //draw detections
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resized); //draw detections
  }
  React.useEffect(() => {
    //load the models
    const loadmodels = () => {
      Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      ]).then(handleImage()).catch((e) => console.log(e))
    }
    //if there is image
    imgRef.current && loadmodels()



  },[])
  return (
    <div className="App">
      <img
        crossOrigin='anonymous'
        ref={imgRef}
        src="https://images.pexels.com/photos/247204/pexels-photo-247204.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        alt=""
        width="940"
        height="650"
      />
      <canvas ref={canvasRef} width="940" height="650" className='canvas' />
    </div>

  );
}
export default App;
