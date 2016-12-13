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
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      afterChange: function(i){
         self.setState({wordToSpeech: self.props.items[i]})
      }
    };
    return (
      <div className="slider-wrapper">
         <Slider {...settings}>
            {this.props.items.map((item, index)=>{
               return <div key={index}>{item} <em>{this.props.translation[index]}</em>
               </div>
            })}
         </Slider>
         {'speechSynthesis' in window && this.props.voice && <SpeechBtn speak={this.state.wordToSpeech} voice={this.props.voice} /> }
      </div>
    );
  }
});
export default Carousel;
