import React from 'react';
import {apiUrls} from './config';
import './App.css';

const App = React.createClass({
  componentDidMount(){
    const getUserMedia = (() => {
      const fn = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      return fn ? fn.bind(navigator) : null
    })()
    const video = this.vid;
    if(getUserMedia){
      getUserMedia({ video: true }, function(stream){
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
    }else{
      alert('NO USERMEDIA SUPPORT');
    }

  },
   render() {
     return (
       <div className="App">
         <div className="App-header">
           <video ref={(vid)=>this.vid = vid} src="" autoPlay id="videoStream"></video>
         </div>
       </div>
     );
   }
});
export default App;
