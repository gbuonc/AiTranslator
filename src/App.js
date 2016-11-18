import React from 'react';
import {apiUrls} from './config';
import getCameraAccess from './enableCamera';
import axios from 'axios/dist/axios';
import './App.css';

const App = React.createClass({
  componentDidMount(){
    getCameraAccess(this.vid);
  },
  takePicture(){
    const video = this.vid;
    const canvas = this.canvas;
    const source = video.getBoundingClientRect();
    source.offsetLeft = Math.abs(source.left);
    source.visibleWidth = Math.round(source.right-source.offsetLeft);
    const sourceRatio = source.visibleWidth / source.height;
    const scaleRatio = video.videoHeight / source.height;
    /* set canvas dimensions as the same ratio of the cropped video */
    canvas.height = video.videoHeight;
    canvas.width  = canvas.height*sourceRatio;
    /* draw picture to canvas */
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, source.offsetLeft*scaleRatio, source.top*scaleRatio, source.visibleWidth*scaleRatio, source.height*scaleRatio, 0,0, canvas.width, canvas.height);
    /* send picture to google */
    axios({
      method: 'post',
      url: apiUrls.cloudVision,
      data: {
        requests: [
          {
            image: {
              content: canvas.toDataURL('image/jpeg', 1).replace('data:image/jpeg;base64,', '')
            },
            features: {type: 'LABEL_DETECTION', maxResults: 5}
          }
        ]
      }
    }).then(function(resp){
      if(resp.status === 200){
        const returnedWords = resp.data.responses[0].labelAnnotations.map(w => w.description);
        alert(returnedWords);
        axios({
          method: 'get',
          url: apiUrls.translate,
          params: {
            q : returnedWords.toString(),
            source : 'en',
            target : 'it'
          }
        }).then(function(resp){
          const translatedWords = resp.data.data.translations[0].translatedText.split(',');
          alert(translatedWords);
        })
      }else{
        alert('error. Try again');
      }
    });
  },
   render() {
     return (
       <div className="App">
          <div className="videoWrap">
            <video ref={(vid)=>this.vid = vid} src="" autoPlay id="videoStream"></video>
          </div>
           <canvas ref={(canvas)=>this.canvas = canvas} width="200" height="200"></canvas>
           <div className="snap-btn" onClick={this.takePicture} />
       </div>
     );
   }
});
export default App;
