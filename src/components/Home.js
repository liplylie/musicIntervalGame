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
import { Convert, Styles } from "../styles";
import propTypes from "prop-types"

const { height, width } = Dimensions.get("window");

class UnconnectedHome extends Component {
    static propTypes = {
        country: propTypes.object,
    };


    async componentWillMount() {
        const { dispatch } = this.props

    }

    render() {
        return (
            <View>
                <Text>Home</Text>
            </View>
        )
    }
}


const Home = connect(state => ({
    state
}))(UnconnectedHome);

export default Home;
