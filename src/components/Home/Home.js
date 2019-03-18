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
import Banner from "../Ads/Banner"

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
                <View style={{marginBottom: Convert(30)}}>
                    <Banner />
                </View>
               
            </View>
        )
    }
}

const mapStateToProps = state => ({alarm: state.alarm})
export default connect(mapStateToProps)(Home);
