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
  Animated,
  Picker
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Convert, Styles } from "../../styles";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import uuid from "../../helper/uuid";
import Alarm from "../../helper/Alarm";
import PushNotification from "react-native-push-notification";
import ModalSelector from "react-native-modal-selector";

import NavBar from "../Common/NavBar";

const { height, width } = Dimensions.get("window");
const iphoneX = height > 800;
class AddAlarm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      time: this.props.edit
        ? this.props.edit.time
        : moment()
            .startOf("minute")
            .format("hh:mm A"),
      date: this.props.edit
        ? this.props.edit.date
        : moment()
            .startOf("minute")
            .format(),
      message: this.props.edit ? this.props.edit.message : "",
      iconOne: new Animated.Value(0.7),
      iconTwo: new Animated.Value(0.7),
      springSpeed: 500,
      snooze: 1,
      answersNeeded: 3,
      snoozePicker: false,
      instrument: "",
      renderInstrumentModal: false,
      instrumentModalData: [
        { key: 0, section: true, label: 'Instruments' },
        { key: 1, label: 'Piano', accessibilityLabel: 'Piano' },
        { key: 2, label: 'Clarinet', accessibilityLabel: 'Clarinet' }
      ],
    };
    this._handleDatePicked = this._handleDatePicked.bind(this);
    this._addAlarm = this._addAlarm.bind(this);
    this._editAlarm = this._editAlarm.bind(this);
    this.instrumentModal = this.instrumentModal.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    // dispatch({ type: "addAlarm", payload: alarm })
  }

  componentDidMount() {
    PushNotification.checkPermissions(permissions => {
      if (!permissions.alert) {
        alert("Please enable push notifications for the alarm to work");
      }
    });
    this.runAnimation();
  }
  runAnimation() {
    this.state.iconOne.setValue(1.5);
    Animated.timing(this.state.iconOne, {
      toValue: 1,
      duration: 1000
    }).start(() => {
      Animated.timing(this.state.iconOne, {
        toValue: 1.5,
        duration: 1000
      }).start();
    });
    Animated.timing(this.state.iconTwo, {
      toValue: 1,
      duration: 1000
    }).start(() => {
      Animated.timing(this.state.iconTwo, {
        toValue: 1.5,
        duration: 1000
      }).start(() => this.runAnimation());
    });
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _hideSnoozePicker = () => this.setState({ snoozePicker: false });

  _showSnoozePicker = () => this.setState({ snoozePicker: true });


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
      let id = edit ? edit.id : uuid(Platform.OS);
      if (moment(date).isBefore(moment().startOf("minute"))) {
        date = moment(date)
          .add(1, "days")
          .startOf("minute")
          .format();
      }
      let alarm = new Alarm(id, 1, time, date, message || "Alarm");
      dispatch({ type: "addAlarm", payload: alarm });
      if (Platform.OS === "android") {
        PushNotification.localNotificationSchedule({
          message: message || "Alarm",
          date: new Date(date),
          soundName: "perfect_fifth.mp3",
          repeatType: "minute",
          id: JSON.stringify(id),
          userInfo: { id: JSON.stringify(id) }
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
      let id = edit.id;
      if (moment(date).isBefore(moment().startOf("minute"))) {
        date = moment(date)
          .add(1, "days")
          .startOf("minute")
          .format();
      }
      let alarm = new Alarm(id, 1, time, date, message || "Alarm");
      // console.log(alarm, "alarm edit")
      if (Platform.OS === "ios") {
        PushNotificationIOS.getScheduledLocalNotifications(notification => {
          console.log(
            notification,
            "local notification schedule in alarm list"
          );
          notification.forEach(({ userInfo }) => {
            // console.log(userInfo, "userInfo")
            if (userInfo.id === edit.id) {
              PushNotification.cancelLocalNotifications({ id: userInfo.id });
            }
          });
        });
      } else {
        PushNotification.cancelLocalNotifications({ id: JSON.stringify(id) });
      }
      dispatch({ type: "editAlarm", payload: alarm });
      if (Platform.OS === "android") {
        PushNotification.localNotificationSchedule({
          message: message || "Alarm",
          date: new Date(date),
          soundName: "perfect_fifth.mp3",
          repeatType: "minute",
          id: JSON.stringify(id),
          userInfo: { id: JSON.stringify(id) }
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

  instrumentModal(){
    let {
      instrumentModalData,
      instrument
    } = this.state;
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          flex: 1,
        }}
        // onPress={() => this._showSnoozePicker()}
      >
        <ModalSelector
          data={instrumentModalData}
          initValue="Select an Instrument"
          supportedOrientations={['portrait']}
          accessible={true}
          scrollViewAccessibilityLabel={'Scrollable options'}
          cancelButtonAccessibilityLabel={'Cancel Button'}
          onChange={({ label }) => { this.setState({ instrument: label }) }}
        >
          <TextInput style={{ fontSize: Convert(20) }} onSubmitEditing={false}>Instrument</TextInput>
        </ModalSelector>
        <Text style={{ fontSize: Convert(20) }}>{instrument}</Text>
      </View>
      
    )
  }

  snoozeModal(){
    let {
      snooze
    } = this.state;
    let data = [
      {key: 0, section: true, label: "Snooze Time"}
    ];
    for (let i = 1; i < 60; i++) {
      data.push({
        key: i + "", 
        label: i + "",
        accessibilityLabel: i + ""
      })
    }
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          flex: 1,
        }}
        // onPress={() => this._showSnoozePicker()}
      >
        <ModalSelector
          data={data}
          initValue="Select an Instrument"
          supportedOrientations={['portrait']}
          accessible={true}
          scrollViewAccessibilityLabel={'Scrollable options'}
          cancelButtonAccessibilityLabel={'Cancel Button'}
          onChange={({ label }) => { this.setState({ snooze: label }) }}
        >
          <TextInput style={{ fontSize: Convert(20) }} onSubmitEditing={false}>Snooze</TextInput>
        </ModalSelector>
        <Text style={{ fontSize: Convert(20) }}>{snooze} minute{snooze > 1 ? "s" : null}</Text>
      </View>

    )
  }

  answersNeededModal() {
    let {
      answersNeeded
    } = this.state;
    let data = [
      { key: 0, section: true, label: "Answers Needed To Turn Off Alarm" }
    ];
    for (let i = 1; i < 11; i++) {
      data.push({
        key: i + "",
        label: i + "",
        accessibilityLabel: i + ""
      })
    }
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          flex: 1,
        }}
      >
        <ModalSelector
          data={data}
          initValue="Answers Needed To Stop Alarm"
          supportedOrientations={['portrait']}
          accessible={true}
          scrollViewAccessibilityLabel={'Scrollable options'}
          cancelButtonAccessibilityLabel={'Cancel Button'}
          onChange={({ label }) => { this.setState({ answersNeeded: label }) }}
        >
          <TextInput style={{ fontSize: Convert(20) }} onSubmitEditing={false}>Answers Needed</TextInput>
        </ModalSelector>
        <Text style={{ fontSize: Convert(20) }}>{answersNeeded}</Text>
      </View>

    )
  }

  renderSelections() {
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
    );
  }

  render() {
    let { 
      time, 
      meridian,
      snoozePicker, 
      instrument,
      renderInstrumentModal
    } = this.state;
    let { edit } = this.props;
    
    return (
      <View style={{ display: "flex", flex: 1 }}>
        <NavBar
          title={edit ? "Edit Alarm" : "Add Alarm"}
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
                  backgroundColor: Platform.OS === "ios" ? "dodgerblue" : "",
                  marginLeft: Convert(50),
                  marginRight: Convert(50),
                  marginTop: Convert(20),
                  marginBottom: Convert(30)
                }}
              >
                <Button
                  onPress={this._showDateTimePicker}
                  title="Edit"
                  accessibilityLabel="Edit Alarm"
                  color={Platform.OS === "ios" ? "white" : ""}
                />
              </TouchableHighlight>
              <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                mode="time"
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around"
                }}
              >
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
          </View>
          <View
            style={{
              flexGrow: 1.5,
              flexDirection: "column",
              alignSelf: "center"
            }}
          >
            <TextInput
              style={{
                height: Convert(40),
                width: Convert(300),
                borderColor: "gray",
                borderWidth: 1,
                borderRadius: Convert(10),
                backgroundColor: "white",
                textAlign: "center"
              }}
              onChangeText={message => this.setState({ message })}
              value={this.state.message}
              placeholder="Description"
              maxLength={30}
            />
            <View
              style={{
                display: "flex",
                flex: 0.4,
                flexDirection: "column",
                justifyContent: "space-around"
              }}
            >
              { renderInstrumentModal ? this.instrumentModal() : null}
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1
                }}
              >
                {this.snoozeModal()}
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomColor: "lightgray",
                  borderBottomWidth: 1
                }}
              >
                {this.answersNeededModal()}

              </View>
            </View>
          </View>
          <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
            <TouchableHighlight
              style={{
                height: iphoneX ? Convert(80) : Convert(50),
                width: width,
                backgroundColor: Platform.OS === "ios" ? "dodgerblue" : "",
                margin: 0
              }}
            >
              <Button
                onPress={edit ? this._editAlarm : this._addAlarm}
                title="SAVE"
                accessibilityLabel="Save Alarm"
                color={Platform.OS === "ios" ? "white" : ""}
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
