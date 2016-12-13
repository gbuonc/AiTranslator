import React from 'react';
import {apiUrls} from './config';
import getCameraAccess from './enableCamera';
import axios from 'axios/dist/axios';
import Spinner from './Spinner';
import Carousel from './Carousel';
import './App.css';

const App = React.createClass({
   getInitialState(){
      return {
         waiting : false,
         englishWords : [],
         translatedWords : [],
         voice : null
      }
   },
   componentDidMount(){
      getCameraAccess(this.vid);
      this.voices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () {
         this.voices = window.speechSynthesis.getVoices();
         if(this.voices.length > 0){
            this.setState({voice : this.voices.filter(function(voice) { return voice.name === 'Google UK English Female'; })[0]});
         }
      }.bind(this);
   },
  takePicture(){
     let self = this;
     self.setState({waiting: true});
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
        self.setState({englishWords : returnedWords});
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
          self.setState({
             translatedWords : translatedWords,
             waiting: false});
          ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            {this.state.englishWords.length > 0 && this.state.waiting=== false && <Carousel items={this.state.englishWords} translation={this.state.translatedWords} voice={this.state.voice} /> }
            <div className="snap-btn-wrapper">
               <div className="snap-btn" onClick={this.takePicture}>
                  <img className="snap-btn-icon" src="/camera.svg" alt="snap" style={{'display' : this.state.waiting ? 'none' : 'block'}}/>
               </div>
            </div>
            <Spinner waiting={this.state.waiting} />
         </div>
      );
   }
});
export default App;
