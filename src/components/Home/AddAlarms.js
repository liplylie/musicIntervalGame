import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  Button,
  TouchableHighlight,
  KeyboardAvoidingView,
  PushNotificationIOS,
  Animated
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Convert, Styles } from "../../styles";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import uuid from "../../helper/uuid";
import Alarm from "../../helper/Alarm";
import PushNotification from "react-native-push-notification";

import NavBar from "../Common/NavBar";

const { height, width } = Dimensions.get("window");

class AddAlarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      time: this.props.edit ? this.props.edit.time: moment()
        .startOf("minute")
        .format("hh:mm A"),
      date: this.props.edit ? this.props.edit.date : moment()
        .startOf("minute")
        .format(),
      message: this.props.edit ? this.props.edit.message : "",
      iconOne: new Animated.Value(0.7),
      iconTwo: new Animated.Value(0.7),
      springSpeed: 500
    };
    this._handleDatePicked = this._handleDatePicked.bind(this);
    this._addAlarm = this._addAlarm.bind(this);
    this._editAlarm = this._editAlarm.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // dispatch({ type: "addAlarm", payload: alarm })
  }

  componentDidMount(){
    PushNotification.checkPermissions(permissions => {
      if (!permissions.alert) {
        alert("Please enable push notifications for the alarm to work");
      }
    });
   this.runAnimation()
  }
  runAnimation() {
    this.state.iconOne.setValue(1.5);
    Animated.timing(this.state.iconOne, {
      toValue:  1,
      duration: 1000,
    }).start(()=> {
      Animated.timing(this.state.iconOne, {
        toValue: 1.5,
        duration: 1000,
      }).start();
    });
    Animated.timing(this.state.iconTwo, {
      toValue: 1,
      duration: 1000,
    }).start(() => {
      Animated.timing(this.state.iconTwo, {
        toValue: 1.5,
        duration: 1000,
      }).start(() => this.runAnimation());
    });
   
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = date => {
    // console.log("A date has been picked: ", date);
    this._hideDateTimePicker();
    let time = moment(date)
      .startOf("minute")
      .format("hh:mm A");
    date = moment(date)
      .startOf("minute")
      .format();
    this.setState({
      time,
      date
    });
  };

  _addAlarm() {
    let { dispatch, edit } = this.props;
    let { time, date, message } = this.state;
    if (!time) {
      alert("Please enter a time for the alarm");
    } else {
      let id = edit ? edit.id : uuid();
      if (moment(date).isBefore(moment().startOf("minute"))){
        date = moment(date).add(1, "days").startOf("minute").format()
      }
      let alarm = new Alarm(id, 1, time, date, message || "Alarm");
      dispatch({ type: "addAlarm", payload: alarm });
      if (Platform.OS === "android") {
        PushNotification.localNotificationSchedule({
          message: message || "Alarm",
          date: new Date(date),
          soundName: "PerfectFifth.mp3",
          repeatType: "minute",
          id: id,
          // repeatType: "minute"
          // repeatTime: new Date(Date.now() + (1000 * 60 * 10 ))
          // repeatTime: 100
        });
      } else {
        for (let i = 0; i < 4; i++) {
          let tempDate = moment(date).add(i * 8, "seconds");
          PushNotification.localNotificationSchedule({
            message: message || "Alarm",
            date: new Date(tempDate),
            soundName: "PerfectFifth.mp3",
            repeatType: "minute",
            userInfo: { id: id },
            repeatType: "minute"
            //repeatTime: new Date(Date.now() + 100)
          });
        }
      }
      Actions.Home();
    }
  }

  _editAlarm() {
    let { dispatch, edit } = this.props;
    let { time, date, message } = this.state;
    if (!time) {
      alert("Please enter a time for the alarm");
    } else {
      let id = edit.id
      if (moment(date).isBefore(moment().startOf("minute"))) {
        date = moment(date).add(1, "days").startOf("minute").format()
      }
      let alarm = new Alarm(id, 1, time, date, message || "Alarm");
      // console.log(alarm, "alarm edit")
      PushNotificationIOS.getScheduledLocalNotifications(notification => {
        console.log(notification, "local notification schedule in alarm list")
        notification.forEach(({ userInfo }) => {
          // console.log(userInfo, "userInfo")
          if (userInfo.id === edit.id) {
            PushNotification.cancelLocalNotifications({ id: userInfo.id })
          }
        })
      });
      dispatch({ type: "editAlarm", payload: alarm });
      if (Platform.OS === "android") {
        PushNotification.localNotificationSchedule({
          message: message || "Alarm",
          date: new Date(date),
          soundName: "PerfectFifth.mp3",
          repeatType: "minute",
          id: id,
          // repeatType: "minute"
          // repeatTime: new Date(Date.now() + (1000 * 60 * 10 ))
          // repeatTime: 100
        });
      } else {
        for (let i = 0; i < 4; i++) {
          let tempDate = moment(date).add(i * 8, "seconds");
          PushNotification.localNotificationSchedule({
            message: message || "Alarm",
            date: new Date(tempDate),
            soundName: "PerfectFifth.mp3",
            repeatType: "minute",
            userInfo: { id: id },
            repeatType: "minute"
            //repeatTime: new Date(Date.now() + 100)
          });
        }
      }
      Actions.Home();
    }
  }

  renderSelections(){
    return (
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
    )
  }

  render() {
    let { time, meridian } = this.state;
    let { edit } = this.props;
    return (
      <View style={{display: "flex", flex: 1}}>
        <NavBar
          title={ edit ? "Edit Alarm" : "Add Alarm"}
          leftButtonIcon="left"
          onLeftButtonPress={() => Actions.Home()}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-around",
            flexGrow: 1,
            backgroundColor: "white"
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
              <Text style={{ fontSize: Convert(80) }}>{time}</Text>
            </View>
            <View>
                <TouchableHighlight
                  style={{
                    height: Convert(40),
                    width: Convert(160),
                    borderRadius: Convert(10),
                    backgroundColor: "dodgerblue",
                    marginLeft: Convert(50),
                    marginRight: Convert(50),
                    marginTop: Convert(20)
                  }}>
                  <Button onPress={this._showDateTimePicker}
                    title="Edit"
                    accessibilityLabel="Edit Alarm"
                    color="white"
                  />
                </TouchableHighlight> 
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
              justifyContent: "space-around",
              alignSelf: "center",
            }}
          >
            <TextInput
              style={{ 
                height: Convert(40),
                width: Convert(300), 
                borderColor: 'gray', 
                borderWidth: 1, 
                borderRadius: Convert(10),
                backgroundColor: "white",
                textAlign: "center" 
              }}
              onChangeText={(message) => this.setState({ message })}
              value={this.state.message}
              placeholder="Description"
              maxLength={30}
            />
            <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around"}}>
              <Animated.Image 
                source={require("../../../assets/images/appIcon1024.png")} 
                style={{ 
                  height: Convert(40),
                  width: Convert(40),
                  resizeMode: "contain",
                  transform: [{ scale: this.state.iconOne }] 
                }}
                
               />
              <Animated.Image 
                source={require("../../../assets/images/appIcon1024.png")}
                style={{ height: Convert(40), width: Convert(40) }}
                style={{
                  height: Convert(40),
                  width: Convert(40),
                  resizeMode: "contain",
                  transform: [{ scale: this.state.iconTwo }]
                }}
              />
            </View>
          </View>
          <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
            <TouchableHighlight
              style={{
                height: Convert(45),
                width: width,
                backgroundColor: "dodgerblue",
                margin: 0
              }}>
              <Button onPress={edit ? this._editAlarm : this._addAlarm}
                title="SAVE"
                accessibilityLabel="Save Alarm"
                color="white"
              />
            </TouchableHighlight> 
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({ alarm: state.alarm });
export default connect(mapStateToProps)(AddAlarm);
