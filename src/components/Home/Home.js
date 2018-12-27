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
    PushNotificationIOS
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Convert, Styles } from "../../styles";

import AlarmList from "./AlarmList";
import  NavBar  from "../Common/NavBar";
import moment from "moment"

const { height, width } = Dimensions.get("window");


class Home extends Component {
    constructor(){
        super()
        this.state = {
            activeGame: false
        }
        this.handleMusicSymbolPress = this.handleMusicSymbolPress.bind(this);
        this.handleAddAlarm = this.handleAddAlarm.bind(this);
       
    }

    componentWillMount() {
        // console.log(this.props, "home props")
        // this._navigateToGame()

    }

    componentDidMount(){
       
    }

    _navigateToGame(){
        let { alarms } = this.props.alarm;
        let { activeGame } = this.state;
        if (Platform.OS === "ios") {
            PushNotificationIOS.getScheduledLocalNotifications(
                notification => {
                    // console.log(notification, "notification navigate to Game in home");
                    if (notification.length && !activeGame) {
                        notification.forEach(({ userInfo }) => {
                            // console.log(userInfo, "userInfo")
                            // console.log(alarms, "alarms")
                            alarms.forEach(a => {
                                // console.log(a, "a")
                                // console.log(userInfo, "u")
                                if (a.id === userInfo.id && a.active) {
                                    // console.log("alarm", a)
                                    let activeAlarm = moment(a.date).isBefore(moment.now())
                                    // console.log(activeAlarm, "active alarm")
                                    // console.log(activeGame, "active game")
                                    if (activeAlarm && !activeGame) {
                                        // console.log("here")
                                        this.setState({
                                            activeGame: true
                                        }, () => Actions.Game({id:a.id}))
                                       
                                    }
                                   // Actions.Game(a.id)
                                }
                            })
                        })
                    }
                })
        }

    }

    handleMusicSymbolPress(){
        Actions.Game()
    }


    handleAddAlarm(){
        Actions.AddAlarms()
    }

    render() {
        return (
            <View style={{display: "flex", flex: 1}}>
                <NavBar 
                    title="Alarms"
                    leftButtonIcon="music"
                    rightButtonIcon="plus"
                    onLeftButtonPress={this.handleMusicSymbolPress}
                    onRightButtonPress={this.handleAddAlarm}
                />
                <ScrollView contentContainerStyle={{ display: "flex",flex: 1 }}>
                    <AlarmList />
                </ScrollView>
                
            </View>
        )
    }
}


// const Home = connect(state => ({
//     state
// }))(UnconnectedHome);

const mapStateToProps = state => ({alarm: state.alarm})
export default connect(mapStateToProps)(Home);
