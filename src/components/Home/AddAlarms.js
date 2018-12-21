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

import NavBar from "../Common/NavBar";

const { height, width } = Dimensions.get("window");


class AddAlarm extends Component {

    componentWillMount() {
        const { dispatch } = this.props

    }

    render() {
        return (
            <View>
                <NavBar
                    title="Add Alarm"
                    leftButtonIcon="left"
                    onLeftButtonPress={()=>Actions.pop()}
                />
                <Text>Add Alarm</Text>
            </View>
        )
    }
}


// const AddAlarm = connect(state => ({
//     state
// }))(UnconnectedAddAlarm);
export { AddAlarm };
export default AddAlarm;
