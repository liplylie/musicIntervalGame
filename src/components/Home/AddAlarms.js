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
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";

import NavBar from "../Common/NavBar";

const { height, width } = Dimensions.get("window");

class AddAlarm extends Component {
  state = {
    isDateTimePickerVisible: false,
    time: "0:00",
    date: ""
  };
  componentWillMount() {
    const { dispatch } = this.props;
    // dispatch({ type: "addAlarm", payload: alarm })
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this._hideDateTimePicker();
    let time = moment(date).format("hh:mm A");
    this.setState({
      time,
      date
    });
  };

  render() {
    let { time, meridian } = this.state;
    return (
      <View>
        <NavBar
          title="Add Alarm"
          leftButtonIcon="left"
          onLeftButtonPress={() => Actions.pop()}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
            height: height
          }}
        >
          <View
            style={{
              flexGrow: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View>
              <Text style={{ fontSize: Convert(40) }}>{time}</Text>
            </View>
            <View>
              <TouchableOpacity onPress={this._showDateTimePicker}>
                <Text>edit</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                mode="time"
              />
            </View>
          </View>
          <View
            style={{
              flexGrow: 1,
              flexDirection: "column",
              alignItems: "flex-end",
              alignSelf: "flex-start",
              justifyContent: "space-around",
              paddingLeft: Convert(10)
            }}
          >
            <Text>data</Text>
            <Text>data</Text>
            <Text>data</Text>
            <Text>data</Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text>Save</Text>
          </View>
        </View>
      </View>
    );
  }
}

// const AddAlarm = connect(state => ({
//     state
// }))(UnconnectedAddAlarm);
export { AddAlarm };
export default AddAlarm;
