import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    ScrollView,
    Platform,
    PermissionsAndroid,
    Dimensions,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    StyleSheet,
    Animated,
    ListView
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Convert, Styles } from "../../styles";
import propTypes from "prop-types";
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from "react-native-animatable";
import Sound from "react-native-sound";

import A4 from "../../samples/A4.mp3";
import E4 from "../../samples/E4.mp3";
import E3 from "../../samples/E3.mp3";

import NavBar from "../Common/NavBar";

const { height, width } = Dimensions.get("window");

const AnimatableListView = Animatable.createAnimatableComponent(ListView);


class Game extends Component {
    constructor(){
        super()
        this.state = {
            noteSpringOne: new Animated.Value(0.7),
            noteSpringTwo: new Animated.Value(0.7),
            springSpeed: 500,
            stopAnimation: false
        }
        this.springAnimation = this.springAnimation.bind(this);
        this.stopAnimation = this.stopAnimation.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        this.soundOne = new Sound(A4, error => {
            if (error) {
                console.log("sound failed");
                console.log(error);
            } else {
                console.log("sound loaded");
            }
        });
        this.soundTwo = new Sound(E3, error => {
            if (error) {
                console.log("sound failed");
                console.log(error);
            } else {
                console.log("sound loaded");
            }
        });
    }

    componentWillMount() {
    }

    componentDidMount(){
        setTimeout(() => this.springAnimation("One"), 300)
    }

    componentWillUnmount(){
        this.setState({
            stopAnimation: true
        })
    }

    goBack(){
        this.setState({
            stopAnimation: true
        }, () => Actions.pop())
    }

    stopAnimation(){
        this.playSoundOne()
        this.setState({
            stopAnimation: true
        })
    }

    playSoundOne(){
        this.soundOne.play(success => {
                console.log(success, "success play");
                if (!success) {
                    Alert.alert("There was an error playing this audio");
                }
            });
    }

    playSoundTwo() {
        this.soundTwo.play(success => {
            console.log(success, "success play");
            if (!success) {
                Alert.alert("There was an error playing this audio");
            }
        });
    }

    springAnimation(type){
        let {springSpeed, stopAnimation, noteSpringOne, noteSpringTwo} = this.state
        console.log(stopAnimation, "stop")
        if (!stopAnimation){
            if (type === "One") {
                this.playSoundOne()
                Animated.spring(noteSpringOne, {
                    toValue: 1.7,
                    friction: springSpeed,
                    tension: springSpeed
                }).start(() => this.springAnimation("OneShrink"));

            } else if (type === "Two") {
                this.playSoundTwo()
                Animated.spring(noteSpringTwo, {
                    toValue: 1.7,
                    friction: springSpeed,
                    tension: springSpeed
                }).start(() => this.springAnimation("TwoShrink"));
            } else if (type === "OneShrink") {
                Animated.spring(noteSpringOne, {
                    toValue: 1,
                    friction: springSpeed,
                    tension: springSpeed
                }).start(() => this.springAnimation("Two"));
            } else if (type === "TwoShrink") {
                Animated.spring(noteSpringTwo, {
                    toValue: 1,
                    friction: springSpeed,
                    tension: springSpeed
                }).start(() => this.springAnimation("One"));
            }
        }
    }

    renderMusicIcon(type){
        let icon;
        if (type === "separate"){
            icon = (
                <View style={{display: "flex",flexDirection: "row"}}>
                    <Animated.Image
                        source={require("../../../assets/images/quarterNote.png")}
                        style={{
                            height: Convert(100),
                            width: Convert(50),
                            //top: Convert(1)/2,
                            resizeMode: "contain",
                            transform: [{scale: this.state.noteSpringOne}]
                        }}
                    /><Animated.Image
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
        return icon
    }

    renderButton(item){
        return (
            <Animatable.View ref="view">
            <LinearGradient 
                style={styles.item} 
                start={{ x: 0.0, y: 0.25 }} 
                end={{ x: 0.5, y: 1.0 }} 
                colors={["#4c669f", "#3b5998", "#192f6a"]}
            >
                <Text style={styles.fontStyle}>{item}</Text>
            </LinearGradient>
            </Animatable.View>
            
        )
       
    }

    render() {
        const data = [{key: 'Major 2'},{key: 'Minor three'},{key: 'Major 5'},{key: 'Diminished Fifth'}];
        const dataSource = this.ds.cloneWithRows(data);
        return (
            <View style={{display:"flex"}}>
                <NavBar
                    title="Game"
                    leftButtonIcon="left"
                    onLeftButtonPress={()=>this.goBack()}
                />
                <View style={{display: "flex", flexDirection: "column"}}>
                    <View style={{backgroundColor:"white", height: height * 1/3, display: "flex", justifyContent:"center", alignItems: "center" }}>
                        <View>
                            <TouchableOpacity onPress={() => this.stopAnimation()} ><Text>Stop</Text></TouchableOpacity>
                            {this.renderMusicIcon("separate")}
                        </View>
                    </View>
                    <View style={{ backgroundColor: "white", height: height * 2 / 3 }}>
                        <AnimatableListView
                            dataSource={dataSource}
                            renderRow={({ key }) => this.renderButton(key)}
                            animation="bounceInUp"
                            duration={800}
                            delay={0}
                            removeClippedSubviews={false}
                        />
                    </View>
                </View>
            </View>
        )
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
    height: height/9,
    borderRadius: 40,
    backgroundColor: "#C8C8C8",
    margin: Convert(8),
      shadowColor: '#000000',
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
      color: "white"
  }
})


// const Game = connect(state => ({
//     state
// }))(UnconnectedHome);
export { Game };
export default Game;
