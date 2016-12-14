import React from 'react';
import Slider from 'react-slick/dist/react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SpeechBtn from './Speech';
const Carousel = React.createClass({
   getInitialState(){
      return {
         wordToSpeech : this.props.items[0]
      }
   },
  render: function () {
    let self = this;
    var settings = {
      dots: true,
      infinite: true,
      arrows: false,
      centerMode: true,
      centerPadding: '15px',
      speed: 500,
      slidesToScroll: 1,
      afterChange: function(i){
         self.setState({wordToSpeech: self.props.items[i]})
      }
    };
    return (
      <div className="slider-wrapper">
         {'speechSynthesis' in window && this.props.voice && <SpeechBtn speak={this.state.wordToSpeech} voice={this.props.voice} /> }
         <Slider {...settings}>
            {this.props.items.map((item, index)=>{
               return (
                  <div key={index}>
                     <div className="slider-content">{item} <em>{this.props.translation[index]}</em></div>
                  </div>
               )
            })}
         </Slider>
      </div>
    );
  }
});
export default Carousel;
