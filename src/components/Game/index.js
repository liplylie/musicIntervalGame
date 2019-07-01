import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import Sound from "react-native-sound";

// Global
import { Convert } from "../../styles";
import {
  notes,
  intervals,
  cancelAlarm,
  shuffle,
  androidCancelAlarm
} from "../../helper";
import { firstNum, secondNum } from "../../helper/randomNum";

// Sounds
import * as Clarinet from "../../samples/Clarinet";
import * as Piano from "../../samples/Piano";

import NavBar from "../Common/NavBar";

const { height } = Dimensions.get("window");
const AnimatableListView = Animatable.createAnimatableComponent(ListView);
const Instrument = {
  "Clarinet": Clarinet,
  "Piano": Piano
}

class Game extends Component {
  constructor(props) {
    super(props);
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
      count: this.props.answersNeeded ? Number(this.props.answersNeeded) : 3,
      checking: false,
      instrument: this.props.instrument || "Piano"
    };
    this.springAnimation = this.springAnimation.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this._navToDirections = this._navToDirections.bind(this);
    this.endGame = this.endGame.bind(this);

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.E3 = new Sound(Instrument[this.state.instrument].E3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.G3 = new Sound(Instrument[this.state.instrument].G3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Ab3 = new Sound(Instrument[this.state.instrument].Ab3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.A3 = new Sound(Instrument[this.state.instrument].A3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Bb3 = new Sound(Instrument[this.state.instrument].Bb3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.B3 = new Sound(Instrument[this.state.instrument].B3, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.C4 = new Sound(Instrument[this.state.instrument].C4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Db4 = new Sound(Instrument[this.state.instrument].Db4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.D4 = new Sound(Instrument[this.state.instrument].D4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Eb4 = new Sound(Instrument[this.state.instrument].Eb4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.E4 = new Sound(Instrument[this.state.instrument].E4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.F4 = new Sound(Instrument[this.state.instrument].F4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Gb4 = new Sound(Instrument[this.state.instrument].Gb4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.G4 = new Sound(Instrument[this.state.instrument].G4, error => {
      if (error) {
        console.log("sound failed G4");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Ab4 = new Sound(Instrument[this.state.instrument].Ab4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.A4 = new Sound(Instrument[this.state.instrument].A4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Bb4 = new Sound(Instrument[this.state.instrument].Bb4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.B4 = new Sound(Instrument[this.state.instrument].B4, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.C5 = new Sound(Instrument[this.state.instrument].C5, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Db5 = new Sound(Instrument[this.state.instrument].Db5, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.D5 = new Sound(Instrument[this.state.instrument].D5, error => {
      if (error) {
        console.log("sound failed");
        console.log(error);
      } else {
        console.log("sound loaded");
      }
    });
    this.Eb5 = new Sound(Instrument[this.state.instrument].Eb5, error => {
      if (error) {
        console.log("sound failed Eb5");
        console.log(error);
      } else {
        console.log("sound loaded Eb5");
      }
    });
    this.E5 = new Sound(Instrument[this.state.instrument].E5, error => {
      if (error) {
        console.log("sound failed E5 ");
        console.log(error);
      } else {
        console.log("sound loaded E5");
      }
    });
    this.F5 = new Sound(Instrument[this.state.instrument].F5, error => {
      if (error) {
        console.log("sound failed F5");
        console.log(error);
      } else {
        console.log("sound loaded F5");
      }
    });
    this.Gb5 = new Sound(Instrument[this.state.instrument].Gb5, error => {
      if (error) {
        console.log("sound failed Gbb5");
        console.log(error);
      } else {
        console.log("sound loaded Gb5");
      }
    });
    this.G5 = new Sound(Instrument[this.state.instrument].G5, error => {
      if (error) {
        console.log("sound failed G5");
        console.log(error);
      } else {
        console.log("sound loaded G5");
      }
    });
    this.Ab5 = new Sound(Instrument[this.state.instrument].Ab5, error => {
      if (error) {
        console.log("sound failed Ab5");
        console.log(error);
      } else {
        console.log("sound loaded Ab5");
      }
    });
    this.A5 = new Sound(Instrument[this.state.instrument].A5, error => {
      if (error) {
        console.log("sound failed A5");
        console.log(error);
      } else {
        console.log("sound loaded A5");
      }
    });
    Sound.setCategory("Playback");
  }

  componentWillMount() {
    console.log(this.props, "game props");
  }

  componentDidMount() {
    setTimeout(() => this.startNewGame(), 500);
  }

  startNewGame(difficulty) {
    let { noteOne, noteTwo } = this.state;
    if (noteOne && noteTwo) {
      this[noteOne].stop();
      this[noteTwo].stop();
    }
    let randomOne = firstNum(13);
    let randomTwo = secondNum(13, randomOne);
    let firstNote = notes[randomOne];
    let secondNote = notes[randomTwo];
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

  endGame() {
    let { id, dispatch, oid, alarm } = this.props;
    this.stopSoundOne();
    this.stopSoundTwo();

    if (id) {
      if (Platform.OS === "ios") {
        dispatch({ type: "activateAlarm", payload: { id: oid, active: 0 } });
        cancelAlarm(Platform.OS, JSON.stringify(id), oid);
      } else {
        dispatch({ type: "activateAlarm", payload: { id: id, active: 0 } });
        androidCancelAlarm(id, alarm.alarms);
      }

      setTimeout(() => Actions.Home(), 0);
    }
  }

  stopAnimation() {
    this.setState({
      stopAnimation: true
    });
  }

  playSoundOne() {
    let { noteOne } = this.state;
    this[noteOne].play(success => {
      if (!success) {
        //Alert.alert("There was an error playing this audio");
      }
    });
  }

  stopSoundOne() {
    let { noteOne } = this.state;
    if (noteOne) {
      this[noteOne].stop(() =>
        this.setState({ noteOne: "", stopAnimation: true })
      );
    }
  }

  playSoundTwo() {
    let { noteTwo } = this.state;
    this[noteTwo].play(success => {
      // console.log(success, "success play");
      if (!success) {
        //Alert.alert("There was an error playing this audio");
      }
    });
  }

  stopSoundTwo() {
    let { noteTwo } = this.state;
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

    if (!stopAnimation) {
      if (type === "One") {
        this.playSoundOne();
        Animated.spring(noteSpringOne, {
          toValue: 1.7,
          friction: springSpeed,
          tension: springSpeed,
          useNativeDriver: true
        }).start(
          stopAnimation ? () => {} : () => this.springAnimation("OneShrink")
        );
      } else if (type === "Two") {
        this.playSoundTwo();
        Animated.spring(noteSpringTwo, {
          toValue: 1.7,
          friction: springSpeed,
          tension: springSpeed,
          useNativeDriver: true
        }).start(
          stopAnimation ? () => {} : () => this.springAnimation("TwoShrink")
        );
      } else if (type === "OneShrink") {
        Animated.spring(noteSpringOne, {
          toValue: 1,
          friction: springSpeed,
          tension: springSpeed,
          useNativeDriver: true
        }).start(stopAnimation ? () => {} : () => this.springAnimation("Two"));
      } else if (type === "TwoShrink") {
        Animated.spring(noteSpringTwo, {
          toValue: 1,
          friction: springSpeed,
          tension: springSpeed,
          useNativeDriver: true
        }).start(stopAnimation ? () => {} : () => this.springAnimation("One"));
      }
    } else {
      Animated.spring(noteSpringOne, {
        toValue: 1,
        friction: springSpeed,
        tension: springSpeed,
        useNativeDriver: true
      }).start();
      Animated.spring(noteSpringTwo, {
        toValue: 1,
        friction: springSpeed,
        tension: springSpeed,
        useNativeDriver: true
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

    Animated.loop(
      Animated.sequence([
        Animated.timing(renderAnswer, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true
        }),
        Animated.timing(renderAnswer, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
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
    let { correctAnswer, count } = this.state;
    let { id } = this.props;
    if (id) {
      if (guess === correctAnswer.long && count > 1) {
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

      if (guess === correctAnswer.long && count <= 1) {
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
    let buttonColor = ["#4c669f", "#3b5998", "#192f6a"];
    let wrongColor = ["#ff4d4d", "#e60000"];
    let correctColor = ["#0BAB64", "#3BB78F"];

    if (correctAnswer) {
      correct = item === correctAnswer.long;
    }

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
            colors={
              attempt ? (correct ? correctColor : wrongColor) : buttonColor
            }
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
    setTimeout(() => Actions.Rules(), 100);
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
              onPress={() => this._navToDirections()}
              title="Rules"
              accessibilityLabel="Rules for game"
              color={Platform.OS === "ios" ? "white" : ""}
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

const mapStateToProps = state => ({ alarm: state.alarm });
export default connect(mapStateToProps)(Game);
