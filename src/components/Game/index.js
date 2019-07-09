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
  Easing
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
import * as Guitar from "../../samples/Guitar";

// Components
import NavBar from "../Common/NavBar";
import Modal from "../Common/Modal";

const { height } = Dimensions.get("window");
const AnimatableListView = Animatable.createAnimatableComponent(ListView);

const Instrument = {
  Clarinet: Clarinet,
  Piano: Piano,
  Guitar: Guitar
};

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteSpringOne: new Animated.Value(0.7),
      noteSpringTwo: new Animated.Value(0.7),
      renderAnswer: new Animated.Value(0),
      spinValue: new Animated.Value(0),
      springSpeed: 500,
      stopAnimation: false,
      noteOne: "",
      noteTwo: "",
      buttonData: ["", "", "", ""],
      correct: false,
      attempt: false,
      count: this.props.answersNeeded ? Number(this.props.answersNeeded) : 3,
      checking: false,
      instrument: this.props.instrument || "Clarinet",
      showModal: false
    };
    this.springAnimation = this.springAnimation.bind(this);
    this.stopAnimation = this.stopAnimation.bind(this);
    this.renderButton = this.renderButton.bind(this);
    this._navToDirections = this._navToDirections.bind(this);
    this.endGame = this.endGame.bind(this);

    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    Sound.setCategory("Playback");
  }

  componentWillMount() {
    this.loadInstrumentFiles();
  }

  componentDidMount() {
    setTimeout(() => this.startNewGame(), 1000);
  }

  loadInstrumentFiles = () => {
    const { instrument } = this.state;
    for (let key in Instrument[instrument]) {
      this[key] = new Sound(Instrument[instrument][key], error => {
        if (error) {
          console.error(error);
        }
      });
    }
  };

  startNewGame = difficulty => {
    let { noteOne, noteTwo } = this.state;
    if (noteOne && noteTwo) {
      this[noteOne].stop();
      this[noteTwo].stop();
    }
    let randomOne = firstNum(13);
    let randomTwo = secondNum(13, randomOne);
    console.log(randomOne, "random One");
    console.log(randomTwo, "random two");
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
  };

  renderButtonData(num) {
    let buttonData = [];
    let interval = intervals[num];
    buttonData.push(interval);

    while (buttonData.length < 4) {
      // first num is used to generate a random number
      let random = firstNum(13);

      if (!buttonData.includes(intervals[random])) {
        buttonData.push(intervals[random]);
      }
    }

    buttonData = shuffle(buttonData);
    console.log(interval, "interval");
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
    let { noteOne, noteTwo } = this.state;
    console.log(noteOne, "note One");
    if (noteOne === noteTwo) {
      this[noteOne].setCurrentTime(0);
    }
    this[noteOne].play(success => {
      if (!success) {
        console.log("one fail");
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
    let { noteOne, noteTwo } = this.state;
    console.log(noteTwo, "note Two");
    if (noteOne === noteTwo) {
      this[noteTwo].setCurrentTime(0);
    }
    this[noteTwo].play(success => {
      if (!success) {
        console.log("one fail");
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
    let { renderAnswer } = this.state;

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

  gearAnimation = callback => {
    let { spinValue } = this.state;
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(callback);
  };

  renderAnswer(val) {
    let { renderAnswer } = this.state;
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
              transform: [{ scale: renderAnswer }]
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
              transform: [{ scale: renderAnswer }]
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

  _navToDirections = () => {
    this.stopSoundOne();
    this.stopSoundTwo();
    this.gearAnimation(() =>
      this.setState({ showModal: true, spinValue: new Animated.Value(0) })
    );
  };

  renderDirections() {
    let { id } = this.props;
    let { spinValue } = this.state;

    if (!id) {
      const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
      });

      return (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
        >
          <TouchableOpacity
            style={{
              height: "auto",
              width: "auto",
              marginTop: Convert(10),
              marginRight: Convert(10)
            }}
            onPress={() => this._navToDirections()}
          >
            <Animated.Image
              id="settings"
              source={require("../../../assets/images/gear.png")}
              style={{
                height: Convert(50),
                width: Convert(50),
                //top: Convert(1)/2,
                resizeMode: "contain",
                transform: [{ rotate: spin }]
              }}
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  }

  onModalClose = instrument => {
    if (!instrument) {
      this.setState({ showModal: false }, this.startNewGame);
    } else {
      this.setState({ instrument, showModal: false }, this.loadInstrumentFiles);
      setTimeout(this.startNewGame, 500);
    }
  };

  render() {
    let { buttonData, correct, attempt, showModal, instrument } = this.state;
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
          <Modal
            showModal={showModal}
            instrument={instrument}
            onClose={instrument => this.onModalClose(instrument)}
          />

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
