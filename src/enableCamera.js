export default function(video){
  const getUserMedia = (() => {
    const fn = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    return fn ? fn.bind(navigator) : null
  })()
  const initCameraRequest = () => {
    navigator.mediaDevices.getUserMedia({audio:false, video: { facingMode: { exact: "environment" } }})
    .then(function(stream){
      var video = document.querySelector('video');
      video.srcObject = stream;
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
  }
  if(getUserMedia){
    initCameraRequest();
  }else{
    alert('Sorry, your browser cannot access device camera.');
  }
}
