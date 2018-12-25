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

const { height, width } = Dimensions.get("window");


class Home extends Component {
    constructor(){
        super()
        this.handleMusicSymbolPress = this.handleMusicSymbolPress.bind(this);
        this.handleAddAlarm = this.handleAddAlarm.bind(this);
       
    }

    componentWillMount() {
        console.log(this.props, "home props")
        PushNotificationIOS.getScheduledLocalNotifications(notification => {
            console.log(notification, "local notification schedule in home")
        })
       

    }

    handleMusicSymbolPress(){
        Actions.Game()
    }


    handleAddAlarm(){
        Actions.AddAlarms()
    }

    render() {
        return (
            <View>
                <NavBar 
                    title="Alarms"
                    leftButtonIcon="music"
                    rightButtonIcon="plus"
                    onLeftButtonPress={this.handleMusicSymbolPress}
                    onRightButtonPress={this.handleAddAlarm}
                />
                <ScrollView>
                    <AlarmList />
                </ScrollView>
                
            </View>
        )
    }
}


// const Home = connect(state => ({
//     state
// }))(UnconnectedHome);
export default Home;
