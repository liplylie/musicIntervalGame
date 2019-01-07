import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  PushNotificationIOS,
  Platform,
  Dimensions,
  StyleSheet,
  Animated,
  ListView,
  TouchableHighlight,
  Button
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import PushNotification from "react-native-push-notification";
import { Convert, Styles } from "../../styles";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import Sound from "react-native-sound";

import notes from "../../helper/noteArray";
import intervals from "../../helper/intervals";
import { firstNum, secondNum } from "../../helper/randomNum";

import G3 from "../../samples/G3.mp3";
import Ab3 from "../../samples/Ab3.mp3";
import A3 from "../../samples/A3.mp3";
import Bb3 from "../../samples/Bb3.mp3";
import B3 from "../../samples/B3.mp3";
import C4 from "../../samples/C4.mp3";
import Db4 from "../../samples/Db4.mp3";
import D4 from "../../samples/D4.mp3";
import Eb4 from "../../samples/Eb4.mp3";
import E4 from "../../samples/E4.mp3";
import F4 from "../../samples/F4.mp3";
import Gb4 from "../../samples/Gb4.mp3";
import G4 from "../../samples/G4.mp3";
import Ab4 from "../../samples/Ab4.mp3";
import A4 from "../../samples/A4.mp3";
import Bb4 from "../../samples/Bb4.mp3";
import B4 from "../../samples/B4.mp3";
import C5 from "../../samples/C5.mp3";
import Db5 from "../../samples/Db5.mp3";
import D5 from "../../samples/D5.mp3";
import Eb5 from "../../samples/Eb5.mp3";
import E5 from "../../samples/E5.mp3";
import F5 from "../../samples/F5.mp3";
import Gb5 from "../../samples/Gb5.mp3";

import E3 from "../../samples/E3.mp3";

import NavBar from "../Common/NavBar";
import shuffle from "../../helper/shuffle";

const { height, width } = Dimensions.get("window");

const AnimatableListView = Animatable.createAnimatableComponent(ListView);

class Game extends Component {
  constructor() {
    super();
    this.state = {
      noteSpringOne: new Animated.Value(0.7),
      noteSpringTwo: new Animated.Value(0.7),
      renderAnswer: new Animated.Value(0),
      springSpeed: 500,
      stopAnimation: false,
      noteOne: "",
      noteTwo: "",
      buttonData: ["", "", "", ""],
      correct: false,
      attempt: false,
      count: 3,
      checking: false
    };
    this.springAnimation = this.springAnimation.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this._navToDirections = this._navToDirections.bind(this);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.E3 = new Sound(E3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.G3 = new Sound(G3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Ab3 = new Sound(Ab3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.A3 = new Sound(A3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Bb3 = new Sound(Bb3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.B3 = new Sound("B3.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.C4 = new Sound("C4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Db4 = new Sound("Db4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.D4 = new Sound("D4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Eb4 = new Sound("Eb4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.E4 = new Sound("E4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.F4 = new Sound("F4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Gb4 = new Sound("Gb4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.G4 = new Sound("G4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed G4");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Ab4 = new Sound("Ab4.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.A4 = new Sound(A4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Bb4 = new Sound(Bb4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.B4 = new Sound(B4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.C5 = new Sound(C5, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Db5 = new Sound(Db5, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.D5 = new Sound(D5, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.E5 = new Sound(E5, error => {
      if (error) {
        console.log("sound failed E5 ");
        console.log(error);
      } else {
        console.log("sound loaded E5");
      }
    });
    this.Eb5 = new Sound("Eb5.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed Eb5");
        console.log(error);
      } else {
        console.log("sound loaded Eb5");
      }
    });
    this.F5 = new Sound(F5, error => {
      if (error) {
        console.log("sound failed F5");
        console.log(error);
      } else {
        console.log("sound loaded F5");
      }
    });
    this.Gb5 = new Sound("Gb5.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed Gbb5");
        console.log(error);
      } else {
        console.log("sound loaded Gb5");
      }
    });
    this.G5 = new Sound("G5.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed G5");
        console.log(error);
      } else {
        console.log("sound loaded G5");
      }
    });
    this.Ab5 = new Sound("Ab5.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed Ab5");
        console.log(error);
      } else {
        console.log("sound loaded Ab5");
      }
    });
    this.A5 = new Sound("A5.mp3", Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log("sound failed A5");
        console.log(error);
      } else {
        console.log("sound loaded A5");
      }
    });
    Sound.setCategory("Playback")
  }

  componentWillMount() {
    console.log(this.props, "game props");
  }

  componentDidMount() {
    // starts the game
    setTimeout(() => this.startNewGame(), 500);
  }

  componentWillUnmount() {
    // this.setState({
    //   stopAnimation: true
    // });
  }

  startNewGame(difficulty) {
    let { noteOne, noteTwo } = this.state;
    if (noteOne || noteTwo) {
      this[noteOne].stop();
      this[noteTwo].stop();
    }
    let randomOne = firstNum(13);
    let randomTwo = secondNum(13, randomOne);
    let firstNote = notes[randomOne];
    let secondNote = notes[randomTwo];
    console.log(notes.length, "length of notes array");
    this.setState(
      {
        noteOne: firstNote,
        noteTwo: secondNote,
        stopAnimation: true
      },
      () => this.renderButtonData(randomTwo - randomOne)
    );
  }

  renderButtonData(num) {
    let { noteOne, noteTwo } = this.state;
    let buttonData = [];
    console.log(num, "num");
    let interval = intervals[num];
    buttonData.push(interval);
    console.log(interval, "interval in render data");
    while (buttonData.length < 4) {
      // first num is used to generate a random number
      let random = firstNum(13);
      console.log(random, "rand");
      if (!buttonData.includes(intervals[random])) {
        buttonData.push(intervals[random]);
      }
    }
    console.log(buttonData, "button data");
    buttonData = shuffle(buttonData);
    this.setState(
      {
        buttonData,
        correctAnswer: interval,
        stopAnimation: false,
        correct: false,
        attempt: false,
        checking: false
      },
      () => this.springAnimation("One")
    );
  }

  goBack() {
    this.stopSoundOne();
    this.stopSoundTwo();
    this.setState(
      {
        stopAnimation: true
      },
      () => Actions.Home()
    );
  }

  async endGame() {
    let { id, dispatch } = this.props;
    this.stopSoundOne();
    this.stopSoundTwo();
    // this.setState(
    //   {
    //     stopAnimation: true
    //   }
    // )
    if (id) {
      await dispatch({ type: "activateAlarm", payload: { id: id, active: 0 } });
      if (Platform.OS === "ios") {
        PushNotificationIOS.getScheduledLocalNotifications(notification => {
          console.log(notification, "local notification schedule in end game");
          notification.forEach(({ userInfo }) => {
            console.log(userInfo, "userInfo");
            if (userInfo.id === id) {
              PushNotification.cancelLocalNotifications({ id: userInfo.id });
            }
          });
        });
      }
    }
    Actions.Home();
  }

  stopAnimation() {
    // this.playSoundOne();
    this.setState({
      stopAnimation: true
    });
  }

  playSoundOne() {
    let { noteOne } = this.state;
    console.log(noteOne, "note one play");
    this[noteOne].play(success => {
      console.log(success, "success play");

      if (!success) {
        //Alert.alert("There was an error playing this audio");
      }
    });
  }

  stopSoundOne() {
    let { noteOne } = this.state;
    // console.log(noteOne, "note one play");
    if (noteOne) {
      this[noteOne].stop(() =>
        this.setState({ noteOne: "", stopAnimation: true })
      );
    }
  }

  playSoundTwo() {
    let { noteTwo } = this.state;
    // console.log(noteTwo, "note two");
    this[noteTwo].play(success => {
      // console.log(success, "success play");
      if (!success) {
        //Alert.alert("There was an error playing this audio");
      }
    });
  }

  stopSoundTwo() {
    let { noteTwo } = this.state;
    console.log(noteTwo, "note one play");
    if (noteTwo) {
      this[noteTwo].stop(() =>
        this.setState({ noteTwo: "", stopAnimation: true })
      );
    }
  }

  renderCount() {
    let { count } = this.state;
    let { id } = this.props;
    if (id) {
      return (
        <View>
          <Text style={{ fontSize: Convert(20) }}>{count}</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  springAnimation(type) {
    let {
      springSpeed,
      stopAnimation,
      noteSpringOne,
      noteSpringTwo
    } = this.state;
    // console.log(stopAnimation, "stop");
    // console.log(type, "type");
    if (!stopAnimation) {
      if (type === "One") {
        this.playSoundOne();
        Animated.spring(noteSpringOne, {
          toValue: 1.7,
          friction: springSpeed,
          tension: springSpeed
        }).start(
          stopAnimation ? () => {} : () => this.springAnimation("OneShrink")
        );
      } else if (type === "Two") {
        this.playSoundTwo();
        Animated.spring(noteSpringTwo, {
          toValue: 1.7,
          friction: springSpeed,
          tension: springSpeed
        }).start(
          stopAnimation ? () => {} : () => this.springAnimation("TwoShrink")
        );
      } else if (type === "OneShrink") {
        Animated.spring(noteSpringOne, {
          toValue: 1,
          friction: springSpeed,
          tension: springSpeed
        }).start(stopAnimation ? () => {} : () => this.springAnimation("Two"));
      } else if (type === "TwoShrink") {
        Animated.spring(noteSpringTwo, {
          toValue: 1,
          friction: springSpeed,
          tension: springSpeed
        }).start(stopAnimation ? () => {} : () => this.springAnimation("One"));
      }
    } else {
      Animated.spring(noteSpringOne, {
        toValue: 1,
        friction: springSpeed,
        tension: springSpeed
      }).start();
      Animated.spring(noteSpringTwo, {
        toValue: 1,
        friction: springSpeed,
        tension: springSpeed
      }).start();
      return;
    }
  }

  renderMusicIcon(type) {
    let icon;
    if (type === "separate") {
      // for two seperate interals
      icon = (
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Animated.Image
            source={require("../../../assets/images/quarterNote.png")}
            style={{
              height: Convert(100),
              width: Convert(50),
              //top: Convert(1)/2,
              resizeMode: "contain",
              transform: [{ scale: this.state.noteSpringOne }]
            }}
          />
          <Animated.Image
            source={require("../../../assets/images/quarterNote.png")}
            style={{
              height: Convert(100),
              width: Convert(50),
              //top: Convert(1)/2,
              resizeMode: "contain",
              transform: [{ scale: this.state.noteSpringTwo }]
            }}
          />
        </View>
      );
    }
    return icon;
  }

  answerAnimation() {
    let { renderAnswer, springSpeed } = this.state;
    // Animated.spring(renderAnswer, {
    //   toValue: 1.7,
    //   friction: springSpeed,
    //   tension: springSpeed
    // }).start();
    // Animated.spring(renderAnswer, {
    //   toValue: 1,
    //   friction: springSpeed,
    //   tension: springSpeed
    // }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(renderAnswer, {
          toValue: 1,
          duration: 0
        }),
        Animated.timing(renderAnswer, {
          toValue: 0,
          duration: 500
        })
      ]),
      {
        iterations: 1
      }
    ).start();
  }

  renderAnswer(val) {
    this.answerAnimation();
    if (val) {
      return (
        <View>
          <Animated.Image
            source={require("../../../assets/images/greenCheck.png")}
            style={{
              height: Convert(40),
              width: Convert(50),
              //top: Convert(1)/2,
              resizeMode: "contain",
              transform: [{ scale: this.state.renderAnswer }]
            }}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Animated.Image
            source={require("../../../assets/images/redX.png")}
            style={{
              height: Convert(40),
              width: Convert(50),
              //top: Convert(1)/2,
              resizeMode: "contain",
              transform: [{ scale: this.state.renderAnswer }]
            }}
          />
        </View>
      );
    }
  }

  checkAnswer(guess) {
    // console.log(guess, "guess");
    let { correctAnswer, count } = this.state;
    let { id } = this.props;
    if (id) {
      if (guess === correctAnswer.long && count > 1) {
        // alert("correct")
        this.setState(
          {
            stopAnimation: true,
            correct: true,
            attempt: true,
            count: count - 1
          },
          () => setTimeout(() => this.startNewGame("easy"), 600)
        );
      } else if (guess !== correctAnswer.long) {
        this.setState(
          {
            stopAnimation: true,
            correct: false,
            attempt: true
          },
          () => setTimeout(() => this.startNewGame("easy"), 700)
        );
      }

      if (guess === correctAnswer.long && count === 1) {
        this.setState(
          {
            stopAnimation: true,
            correct: true,
            attempt: true,
            count: count - 1
          },
          () => this.endGame()
        );
      }
    } else {
      if (guess === correctAnswer.long) {
        // alert("correct")
        this.setState(
          {
            stopAnimation: true,
            correct: true,
            attempt: true
          },
          () => setTimeout(() => this.startNewGame("easy"), 700)
        );
      } else if (guess !== correctAnswer.long) {
        this.setState(
          {
            stopAnimation: true,
            correct: false,
            attempt: true
          },
          () => setTimeout(() => this.startNewGame("easy"), 700)
        );
      }
    }
  }

  renderButton(item) {
    let { checking, attempt, correctAnswer } = this.state;
    let correct;
    if (correctAnswer){
      correct = item === correctAnswer.long;

    }
    let buttonColor = ["#4c669f", "#3b5998", "#192f6a"]
    let wrongColor = ["#ff4d4d", "#e60000"];
    let correctColor = ["#0BAB64","#3BB78F"];
    return (
      <Animatable.View ref="view">
        <TouchableOpacity
          disabled={checking}
          onPress={() =>
            this.setState(
              {
                checking: true
              },
              () => this.checkAnswer(item)
            )
          }
        >
          <LinearGradient
            style={styles.item}
            start={{ x: 0.0, y: 0.25 }}
            end={{ x: 0.5, y: 1.0 }}
            colors={attempt ? correct ? correctColor : wrongColor : buttonColor}
          >
            <Text style={styles.fontStyle}>{item}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animatable.View>
    );
  }

  _navToDirections() {
    this.stopSoundOne();
    this.stopSoundTwo();
    setTimeout(() =>Actions.Rules(), 100)
  }

  renderDirections() {
    let { id } = this.props;
    if (!id) {
      return (
        <View style={{ display: "flex", alignItems: "center" }}>
          <TouchableHighlight
            style={{
              height: Convert(40),
              width: Convert(100),
              borderRadius: Convert(10),
              backgroundColor: "dodgerblue",
              marginTop: Convert(10)
            }}
          >
            <Button
              onPress={() =>this._navToDirections()}
              title="Rules"
              accessibilityLabel="Rules for game"
              color="white"
            />
          </TouchableHighlight>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    let { buttonData, correct, attempt } = this.state;
    let { id } = this.props;
    const dataSource = this.ds.cloneWithRows(buttonData);
    return (
      <View style={{ display: "flex" }}>
        <NavBar
          title="Game"
          leftButtonIcon={id ? null : "left"}
          onLeftButtonPress={() => this.goBack()}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white"
          }}
        >
          {this.renderDirections()}
          <View
            style={{
              backgroundColor: "white",
              height: (height * 1) / 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.renderCount()}
              {attempt ? this.renderAnswer(correct) : null}
              {/* <TouchableOpacity onPress={() => this.stopAnimation()}>
                <Text style={[styles.fontStyle, {color: "black"}]}>Stop</Text>
              </TouchableOpacity> */}
              {this.renderMusicIcon("separate")}
            </View>
          </View>
          <View style={{ backgroundColor: "white", height: (height * 2) / 3 }}>
            <AnimatableListView
              dataSource={dataSource}
              renderRow={({ long }) => this.renderButton(long)}
              animation="bounceInUp"
              duration={800}
              delay={0}
              removeClippedSubviews={false}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22
  },
  item: {
    fontSize: 18,
    borderWidth: 0,
    height: height / 10,
    borderRadius: 40,
    backgroundColor: "#C8C8C8",
    margin: Convert(8),
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 1.0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  fontStyle: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontFamily: "Helvetica"
  }
});

// const Game = connect(state => ({
//     state
// }))(UnconnectedHome);
export default connect(null)(Game);
