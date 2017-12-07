/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Platform,
  ImageBackground,
  Image
} from 'react-native';

// a custom component for this game
import Alien from './app/components/Alien';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // player or 'Human' start values


      // how fast the human may move
      movePlayerVal: new Animated.Value(40),
      playerSide: 'left',
      // How many aliens you've avoided manslaughtering:
      points: 0,

      // alien start values
      moveAlienval: new Animated.Value(0),
      alienStartposX: 0,
      alienSide: 'left',
      alienSpeed: 4200,

      // game status start
      gameOver: false,
    };



  }

  render() {
    return (
      <ImageBackground source={require('./app/img/space.png')} style={styles.container}>
        <View style={styles.points}>
          <Text style={{fontWeight: 'bold', fontSize: 40 }}>{this.state.points}</Text>
        </View>
        <Animated.Image source={require('./app/img/goodship.png')}
           style={{
              height: 100,
              width: 100,
              position: 'absolute',
              zIndex: 1,
              bottom: 50,
              resizeMode: 'stretch',
              transform: [
                { translateX: this.state.movePlayerVal }
              ]
           }}
        >
        </Animated.Image>

        <Alien alienImg={require('./app/img/badship.png')}
        alienStartposX={this.state.alienStartposX}
        moveAlienval={this.state.moveAlienval} />

        <View style={styles.controls}>
          <Text style={styles.left} onPress={ () => this.movePlayer('left') }> {'<'} </Text>
          <Text style={styles.right} onPress={ () => this.movePlayer('right') }> {'>'} </Text>
        </View>
      </ImageBackground>
    );
  }

  // what happens when an arrow above is clicked
  movePlayer(direction){
    if (direction == 'right') {
      this.setState({ playerSide: 'right' });
      Animated.spring(
        // move to the edge of the right side of the screen
        this.state.movePlayerVal,
        {
          toValue: Dimensions.get('window').width - 140,
          tension: 150,
        }
        // with a spring of "150" tension.  Quite a speed when dealing with springs!
      ).start();
    } else if (direction == 'left') {
      this.setState({ playerSide: 'left' });
      Animated.spring(
        this.state.movePlayerVal,
        {
          toValue: 40,
          tension: 150,
        }
        // once more but for the left
      ).start();
    }
    // basically a spring function was called with boundry values
    // depending on wheter one wanted to go right or left
  }

  // begins out animation when app starts
  componentDidMount() {
    this.animateAlien();
  }

  animateAlien() {
    // every alien has to spawn about itself so
    // the aliens start at -100 pixels off the screen in case
    // on were to spawn while another were still on the screen
    this.state.moveAlienval.setValue(-100);

    let windowH = Dimensions.get('window').height;

    // make left or right choice for alien for alien
    // be random chance of 50 50 probability for left of right
    let r = Math.floor(Math.random()* 2) + 1;

    if (r == 2) {
      r = 40;
      this.setState ({ alienSide: 'left' });
    } else {
      r = Dimensions.get('window').width - 140;
      // alien goes right
      this.setState({alienSide: 'right'});
    }
    // alien then uses the new r value to be positioned in left or right side
    // in the corresponding window positioning
    this.setState({alienStartposX: r});

    let refreshIntervalId;
    // here every 50 ms I check if the player an alien has crossed paths meaning:
    // a. the alien statyed in the boundries of the game
    // b. the player was on the same side as the alien
    // and if so, end the game.
    refreshIntervalId= setInterval( () => {
      // collision parts
      // but in code, not just an abstract design idea
      if (this.state.moveAlienval._value > windowH - 280
         && this.state.moveAlienval._value < windowH - 180
         && this.state.playerSide == this.state.alienSide) {
           clearInterval(refreshIntervalId)
           this.setState({gameOver: true});
           this.gameOver();
       }
    }, 50);


    // increase alien speed for tougher alien deliveries every 2 sc
    setInterval( () =>  {
      this.setState({alienSpeed: this.state.alienSpeed - 100})
      // it may seem counterintuitive to increase speed by decreasing the alien speed value,
      // but it actually makes sense if you think about how animations programmatically work...
      // meaning, the smaller the number : the less time the interperator is supposed to take
      // to move an entity from point A to point B hence speeding the entity.
    }, 2000);

    // animate indivual alien
    // by here being where the game requests another alien move animation
    Animated.timing(
      this.state.moveAlienval,
      {
        toValue: Dimensions.get('window').height,
        duration: this.state.alienSpeed,
      }
      // which translated to 'animate to value of rest of the window's height,
      // or total game play view... which makes the alien close the gap in "duration"
      // time.  A smaller duration value means a faster appearance of movement.
    ).start(event => {
      // This is only true if no collisions, so give yourself a point
      if(event.finished && this.state.gameOver == false){
        clearInterval(refreshIntervalId);
        this.setState({points: ++this.state.points});
        this.animateAlien();
      }
    });
  }

  gameOver() {
    // A sad warning the game is over (and the world)
    // because you collided with a peaceful alien!
    // That alien had strong family bonds...
    // and a way more tougher military than ours.
    alert('You hurt an alien! Now they will all attack Earth.');
  }
}


// a whole lot styles
// for various elements on my game
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  points: {
    width: 80,
    height: 80,
    backgroundColor: '#F00',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  right: {
    flex: 1,
    color: '#BADA55',
    margin: 0,
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  left: {
    flex: 1,
    color: '#BADA55',
    margin: 0,
    fontSize: 60,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


AppRegistry.registerComponent('App', () => App)
