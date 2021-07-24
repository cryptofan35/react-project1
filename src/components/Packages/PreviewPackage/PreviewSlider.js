import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./previewSlider.less";

export default class PreviewSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null
    };
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
  }

  render() {
    return (
      <div className="slider-container">
        <Slider
          // key={Date.now()}
          className="slider-view"
          asNavFor={this.state.nav2}
          ref={slider => (this.slider1 = slider)}
          arrows={false}
        >
          {this.props.images.map((image, index) =>
            <div key={`image-${index}`}>
              <img src={image} className="slider-image" alt="property" />
            </div>
          )}

        </Slider>
        <Slider
          className="nav-slider"
          asNavFor={this.state.nav1}
          ref={slider => (this.slider2 = slider)}
          slidesToShow={this.props.images.length > 4 ? 4 : this.props.images.length}
          swipeToSlide={true}
          focusOnSelect={true}
        >
          {this.props.images.map((image, index) =>
            <div key={`thumb-${index}`}>
              <img className="slider-image" src={image} alt="property" />
            </div>
          )}

        </Slider>
      </div>
    );
  }
}
