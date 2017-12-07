import React, { Component } from 'react';
import {
  AppRegistery,
  Stylesheet,
  Text,
  Animated,
  Image
} from 'react-native';

export default class Alien extends Component {

  render() {
    return (
      // here the alien is very similar to the player class
      <Animated.Image source={this.props.alienImg}
        style = {{
          height: 100,
          width: 100,
          position: 'absolute',
          resizeMode: 'stretch',
          // how the alien will start
          left: this.props.alienStartposX,
          // here I specify how the alien should move,
          // and that is: by the properties I determine as the game runs
          transform: [
            { translateY: this.props.moveAlienval },
          ]
        }}>
      </Animated.Image>
      // the only real rational for seperating this component from App.js
      // was just to organize parts of my game in a cleaner way, and demonstrate
      // proper importing and instansiation in App.js of a necessary custom class.
    );
  }
}

