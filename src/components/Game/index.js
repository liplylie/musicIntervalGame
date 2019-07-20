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
  androidCancelAlarm,
  Capitalize
} from "../../helper";
import { firstNum, secondNum } from "../../helper/randomNum";
import termQuestions from "../../questions/termQuestions";

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
  state = {
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
    correctAnswer: "",
    attempt: false,
    count: this.props.answersNeeded ? Number(this.props.answersNeeded) : 3,
    checking: false,
    instrument: this.props.instrument || "Clarinet",
    showModal: false,
    intervalType: this.props.intervalType || "Ascending",
    navToDirections: false,
    gameType: "Interval",
    musicTerm: {}
  };

  componentWillMount() {
    Sound.setCategory("Playback");
    this.loadInstrumentFiles();
  }

  componentDidMount() {
    setTimeout(() => this.startNewGame(), 700);
  }

  ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
  });

  loadInstrumentFiles = () => {
    const { instrument } = this.state;
    for (let key in Instrument[instrument]) {
      this[key] = new Sound(Instrument[instrument][key], error => {
        if (error) {
          console.log(error);
        }
      });
    }
  };

  startNewGame = () => {
    let {
      noteOne,
      noteTwo,
      intervalType,
      navToDirections,
      gameType
    } = this.state;

    if (navToDirections) return;

    if (noteOne && noteTwo) {
      this[noteOne].stop();
      this[noteTwo].stop();
    }

    if (gameType === "Terms") {
      const random = firstNum(Object.keys(termQuestions).length);
      const [definition, term] = Object.entries(termQuestions)[random];
      const musicTerm = { definition, term };
      this.setState(
        {
          musicTerm,
          stopAnimation: true
        },
        () => this.renderButtonData()
      );
    }

    if (gameType === "Interval") {
      let randomOne = firstNum(13);
      let randomTwo = secondNum(13, randomOne);
      let firstNote = notes[randomOne];
      let secondNote = notes[randomTwo];

      this.setState(
        {
          noteOne: intervalType === "Ascending" ? firstNote : secondNote,
          noteTwo: intervalType === "Ascending" ? secondNote : firstNote,
          stopAnimation: true
        },
        () => this.renderButtonData(randomTwo - randomOne)
      );
    }
  };

  renderButtonData = num => {
    const { gameType, musicTerm } = this.state;
    let buttonData = [];
    if (gameType === "Interval") {
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

    if (gameType === "Terms") {
      buttonData.push(musicTerm.definition);
      console.log(buttonData, "button data terms");

      while (buttonData.length < 4) {
        // first num is used to generate a random number
        let random = Object.keys(termQuestions)[firstNum(5)];
        console.log(random, "random");
        if (!buttonData.includes(random)) {
          buttonData.push(random);
        }
      }

      buttonData = shuffle(buttonData);

      this.setState({
        buttonData,
        correctAnswer: musicTerm.definition,
        stopAnimation: false,
        correct: false,
        attempt: false,
        checking: false
      });
    }
  };

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

  endGame = () => {
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
  };

  stopAnimation = () => {
    this.setState({
      stopAnimation: true
    });
  };

  playSoundOne() {
    let { noteOne, noteTwo } = this.state;

    if (noteOne === noteTwo) {
      this[noteOne].setCurrentTime(0);
    }
    this[noteOne].play(success => {
      if (!success) {
        console.log("sound one fail");
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

    if (noteOne === noteTwo) {
      this[noteTwo].setCurrentTime(0);
    }
    this[noteTwo].play(success => {
      if (!success) {
        console.log("sound two fail");
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
          <Text
            style={{
              fontSize: Convert(20),
              position: "absolute",
              top: Convert(-20)
            }}
          >
            {count}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }

  springAnimation = type => {
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
  };

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
    let { renderAnswer, navToDirections } = this.state;
    if (navToDirections) return;
    this.answerAnimation();
    if (val) {
      return (
        <View
          style={{
            position: "absolute",
            top: Convert(-60),
            right: Convert(10),
            alignSelf: "center"
          }}
        >
          <Animated.Image
            source={require("../../../assets/images/greenCheck.png")}
            style={{
              height: Convert(50),
              width: Convert(50),
              resizeMode: "contain",
              transform: [{ scale: renderAnswer }]
            }}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            position: "absolute",
            top: Convert(-60),
            right: Convert(20)
          }}
        >
          <Animated.Image
            source={require("../../../assets/images/redX.png")}
            style={{
              height: Convert(50),
              width: Convert(50),
              resizeMode: "contain",
              transform: [{ scale: renderAnswer }]
            }}
          />
        </View>
      );
    }
  }

  checkAnswerByGameType = (guess, correct) => {
    let { gameType } = this.state;
    if (gameType === "Interval") {
      return guess === correct.long;
    }

    if (gameType === "Terms") {
      return guess === correct;
    }
  };

  checkAnswer = guess => {
    let { correctAnswer, count, gameType } = this.state;
    let { id } = this.props;
    console.log(correctAnswer, "correct");
    console.log(guess, "guess guess");
    if (id) {
      if (this.checkAnswerByGameType(guess, correctAnswer) && count > 1) {
        this.setState(
          {
            stopAnimation: true,
            correct: true,
            attempt: true,
            count: count - 1
          },
          () => setTimeout(() => this.startNewGame(), 700)
        );
      } else if (!this.checkAnswerByGameType(guess, correctAnswer)) {
        this.setState(
          {
            stopAnimation: true,
            correct: false,
            attempt: true
          },
          () => setTimeout(() => this.startNewGame(), 700)
        );
      }

      if (this.checkAnswerByGameType(guess, correctAnswer) && count <= 1) {
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
      if (this.checkAnswerByGameType(guess, correctAnswer)) {
        this.setState(
          {
            stopAnimation: true,
            correct: true,
            attempt: true
          },
          () => setTimeout(() => this.startNewGame(), 700)
        );
      } else if (!this.checkAnswerByGameType(guess, correctAnswer)) {
        this.setState(
          {
            stopAnimation: true,
            correct: false,
            attempt: true
          },
          () => setTimeout(() => this.startNewGame(), 700)
        );
      }
    }
  };

  renderButton = item => {
    let { checking, attempt, correctAnswer } = this.state;
    let correct;
    let buttonColor = ["#4c669f", "#3b5998", "#192f6a"];
    let wrongColor = ["#ff4d4d", "#e60000"];
    let correctColor = ["#0BAB64", "#3BB78F"];

    if (correctAnswer) {
      correct = this.checkAnswerByGameType(item, correctAnswer);
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
  };

  _navToDirections = () => {
    this.setState({
      navToDirections: true
    });
    this.stopSoundOne();
    this.stopSoundTwo();
    this.gearAnimation(() =>
      this.setState({
        showModal: true,
        spinValue: new Animated.Value(0)
      })
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
            justifyContent: "flex-end",
            position: "absolute",
            zIndex: 1,
            right: 0
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

  onModalClose = ({ instrument, intervalType, gameType }) => {
    if (gameType) {
      this.setState(
        {
          showModal: false,
          navToDirections: false,
          gameType,
          buttonData: ["", "", "", ""],
          correct: false,
          correctAnswer: ""
        },
        this.startNewGame
      );
    }
    if (!instrument && !intervalType) {
      this.setState(
        { showModal: false, navToDirections: false },
        this.startNewGame
      );
    } else {
      this.setState(
        {
          instrument,
          intervalType,
          showModal: false,
          navToDirections: false
        },
        this.loadInstrumentFiles
      );
      setTimeout(this.startNewGame, 500);
    }
  };

  gameTypeDisplay = () => {
    const { gameType, musicTerm } = this.state;

    if (gameType === "Terms") {
      return (
        <Capitalize style={{ fontSize: Convert(30) }}>
          {musicTerm.term}
        </Capitalize>
      );
    }

    if (gameType === "Interval") {
      return this.renderMusicIcon("separate");
    }
  };

  renderRow = data => {
    const { gameType } = this.state;

    if (gameType === "Terms") {
      return this.renderButton(data);
    }

    if (gameType === "Interval") {
      return this.renderButton(data.long);
    }
  };

  render() {
    let {
      buttonData,
      correct,
      attempt,
      showModal,
      instrument,
      intervalType,
      gameType
    } = this.state;
    let { id } = this.props;
    const dataSource = this.ds.cloneWithRows(buttonData);
    return (
      <View style={{ display: "flex", position: "relative" }}>
        <NavBar
          title="Game"
          leftButtonIcon={id ? null : "left"}
          onLeftButtonPress={() => this.goBack()}
        />

        <View
          style={{
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Modal
            showModal={showModal}
            instrument={instrument}
            onClose={data => this.onModalClose(data)}
            intervalType={intervalType}
            gameType={gameType}
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
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                position: "relative"
              }}
            >
              {this.renderCount()}

              {attempt ? this.renderAnswer(correct) : null}

              {this.gameTypeDisplay()}
            </View>
          </View>

          <View style={{ backgroundColor: "white", height: (height * 2) / 3 }}>
            <AnimatableListView
              dataSource={dataSource}
              renderRow={this.renderRow}
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
