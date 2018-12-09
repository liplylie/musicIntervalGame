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
    StyleSheet
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Convert, Styles } from "../../styles";
import propTypes from "prop-types";

import NavBar from "../Common/NavBar";

const { height, width } = Dimensions.get("window");


class Game extends Component {

    componentWillMount() {
        const { dispatch } = this.props

    }

    render() {
        const data = [{key: 'Major 2'},{key: 'Minor three'},{key: 'Major 5'},{key: 'Diminished Fifth'},];
        return (
            <View style={{display:"flex"}}>
                <NavBar
                    title="Game"
                    leftButtonIcon="left"
                    onLeftButtonPress={()=>Actions.pop()}
                />
                <View style={{display: "flex", flexDirection: "column"}}>
                    <View style={{backgroundColor:"red", height: height * 1/3}}>
                        <Text>symbol</Text>
                    </View>
                    <View style={{backgroundColor:"blue",  height: height * 2/3}}>
                        <FlatList
                            data={data}
                            renderItem={({item}) => <View style={styles.item}><Text >{item.key}</Text></View>}
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
    borderColor: "black",
    borderWidth: 1,
    height: height/7,
  },
})


// const Game = connect(state => ({
//     state
// }))(UnconnectedHome);
export { Game };
export default Game;
