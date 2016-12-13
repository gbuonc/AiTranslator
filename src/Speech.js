import React from 'react';
const SpeechBtn = React.createClass({
   tellMe(phrase){
      let speech = new SpeechSynthesisUtterance(phrase);
      speech.voice = this.props.voice;
      speech.lang = 'en-GB';
      window.speechSynthesis.speak(speech);
   },
   render() {
      return (
         <img className="speechBtn" src="./speaker.svg" onClick={(e)=>this.tellMe(this.props.speak)} alt="speak" />
      );
   }
});
export default SpeechBtn;
