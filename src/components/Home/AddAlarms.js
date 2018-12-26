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
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import uuid from "../../helper/uuid";
import Alarm from "../../helper/Alarm";
import PushNotification from "react-native-push-notification"

import NavBar from "../Common/NavBar";

const { height, width } = Dimensions.get("window");

class AddAlarm extends Component {
    constructor(){
        super()
        this.state = {
            isDateTimePickerVisible: false,
            time: moment().startOf('minute').format("hh:mm A"),
            date: moment().startOf('minute').format(), 
            message: ""
        };
        this._handleDatePicked = this._handleDatePicked.bind(this);
        this._addAlarm = this._addAlarm.bind(this);
    }

 
  componentWillMount() {
    const { dispatch } = this.props;
    console.log(moment().startOf('minute').format(), "time")
    // dispatch({ type: "addAlarm", payload: alarm })
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this._hideDateTimePicker();
    let time = moment(date).startOf("minute").format("hh:mm A");
    this.setState({
      time,
      date
    });
  };

  _addAlarm(){
      let { dispatch } = this.props;
      let { time, date, message } = this.state;
      if (!time ){
          alert("Please enter a time for the alarm")
      } else {
          let id = uuid();
          let alarm = new Alarm(id, 1, time, date)
          dispatch({ type: "addAlarm", payload: alarm })
          if (Platform.OS === "android") {
              PushNotification.localNotificationSchedule({
                message: message || "test alarm",
                date: new Date(date),
                soundName: "PerfectFifth.mp3",
                repeatType: "minute",
                id: id,
                // repeatType: "minute",
                // repeatTime: new Date(Date.now() + (1000 * 60 * 10 ))
                repeatTime: 100
              });
          } else {
              PushNotification.localNotificationSchedule({
                  message: message || "test alarm",
                  date: new Date(date),
                soundName: "PerfectFifth.mp3",
                  repeatType: "minute",
                  userInfo: { id: id },
                  // repeatType: "minute",
                  repeatTime: 100
                  //repeatTime: new Date(Date.now() + 100)
              });
          }
          Actions.pop()
         
      }

  }

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
              <Text style={{ fontSize: Convert(40) }}>{time }</Text>
            </View>
            <View>
              <TouchableOpacity onPress={this._showDateTimePicker}>
                <Text>Edit</Text>
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
            <TouchableOpacity onPress={this._addAlarm}>
                <Text>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({alarm: state.alarm})
export default connect(mapStateToProps)(AddAlarm);
