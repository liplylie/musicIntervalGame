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
    KeyboardAvoidingView
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Convert, Styles } from "../../styles";
import propTypes from "prop-types";

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
        const { dispatch } = this.props

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
                <AlarmList/>
            </View>
        )
    }
}


// const Home = connect(state => ({
//     state
// }))(UnconnectedHome);
export { Home };
export default Home;
