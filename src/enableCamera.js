export default function(video){
  const getUserMedia = (() => {
    const fn = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    return fn ? fn.bind(navigator) : null
  })()
  const initCameraRequest = (video, sources) => {
    const rearFacingCamera = sources.filter(source => source.facing === 'environment')[0];
      getUserMedia(
        {
          audio :false,
          video: rearFacingCamera ? {optional:[{sourceId: rearFacingCamera.id}] } : true
        },
        function(stream){
        const mediaStream = stream;
        if (typeof (video.srcObject) !== 'undefined') {
            video.srcObject = mediaStream;
        }
        else {
            video.src = URL.createObjectURL(mediaStream);
        }
      }, function(){
        console.log('error')
      });
  }
  if(getUserMedia){
    // const video = this.vid;
    const sourceSupport = MediaStreamTrack && MediaStreamTrack.getSources;
    if (sourceSupport) {
      MediaStreamTrack.getSources(function(sources){
        initCameraRequest(video, sources)
      })
    } else {
      initCameraRequest(video)
    }
  }else{
    alert('Sorry, your browser cannot access device camera.');
  }

}
