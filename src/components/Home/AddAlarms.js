import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Platform,
  Dimensions,
  Button,
  TouchableHighlight,
  Animated,
  StyleSheet
} from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { Convert } from "../../styles";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { uuid, Alarm, cancelAlarm, setAlarm } from "../../helper";
import PushNotification from "react-native-push-notification";
import ModalSelector from "react-native-modal-selector";

import NavBar from "../Common/NavBar";

const { height, width } = Dimensions.get("window");
const iphoneX = height > 800;

class AddAlarm extends Component {
  state = {
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
    snooze: this.props.edit ? Number(this.props.edit.snoozeTime) : 1,
    answersNeeded: this.props.edit ? Number(this.props.edit.answersNeeded) : 3,
    snoozePicker: false,
    instrument: this.props.instrument || "Clarinet",
    intervalType: this.props.intervalType || "Ascending",
    instrumentListData: [
      { key: 0, section: true, label: "Instruments" },
      { key: 1, label: "Piano", accessibilityLabel: "Piano" },
      { key: 2, label: "Clarinet", accessibilityLabel: "Clarinet" },
      { key: 2, label: "Guitar", accessibilityLabel: "Guitar" }
    ],
    intervalListData: [
      { key: 0, section: true, label: "Interval Type" },
      { key: 1, label: "Ascending", accessibilityLabel: "Ascending" },
      { key: 2, label: "Descending", accessibilityLabel: "Descending" }
    ]
  };

  componentDidMount() {
    PushNotification.checkPermissions(permissions => {
      if (!permissions.alert) {
        alert("Please enable push notifications for the alarm to work");
      }
    });
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _hideSnoozePicker = () => this.setState({ snoozePicker: false });

  _showSnoozePicker = () => this.setState({ snoozePicker: true });

  _handleDatePicked = date => {
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

  _addAlarm = () => {
    let { dispatch, edit } = this.props;
    let { time, date, message, snooze, answersNeeded, instrument, intervalType } = this.state;
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
      let alarm = new Alarm(
        id,
        1,
        time,
        date,
        message || "Alarm",
        snooze,
        answersNeeded,
        instrument,
        intervalType
      );
      dispatch({ type: "addAlarm", payload: alarm });
      setAlarm(
        Platform.OS,
        id,
        date,
        snooze,
        answersNeeded,
        message,
        instrument,
        intervalType
      );
      Actions.Home();
    }
  };

  _editAlarm = () => {
    let { dispatch, edit } = this.props;
    let { time, date, message, snooze, answersNeeded, instrument, intervalType } = this.state;
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
      let alarm = new Alarm(
        id,
        1,
        time,
        date,
        message || "Alarm",
        snooze,
        answersNeeded,
        instrument,
        intervalType
      );
      cancelAlarm(Platform.OS, id);
      dispatch({ type: "editAlarm", payload: alarm });
      setAlarm(
        Platform.OS,
        id,
        date,
        snooze,
        answersNeeded,
        message,
        instrument,
        intervalType
      );
      Actions.Home();
    }
  };

  instrumentList = () => {
    let { instrumentListData, instrument } = this.state;

    return (
      <View style={styles.setting}>
        <ModalSelector
          data={instrumentListData}
          initValue="Select an Instrument"
          supportedOrientations={["portrait"]}
          accessible={true}
          style={{ flex: 1 }}
          scrollViewAccessibilityLabel={"Scrollable options"}
          cancelButtonAccessibilityLabel={"Cancel Button"}
          onChange={({ label }) => {
            this.setState({ instrument: label });
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontSize: Convert(20) }}>Instrument</Text>

            <Text style={{ fontSize: Convert(20) }}>{instrument}</Text>
          </View>
        </ModalSelector>
      </View>
    );
  };

  intervalList = () => {
    let { intervalListData, intervalType } = this.state;

    return (
      <View style={styles.setting}>
        <ModalSelector
          data={intervalListData}
          initValue="Select Interval Type"
          supportedOrientations={["portrait"]}
          accessible={true}
          style={{ flex: 1 }}
          scrollViewAccessibilityLabel={"Scrollable options"}
          cancelButtonAccessibilityLabel={"Cancel Button"}
          onChange={({ label }) => {
            this.setState({ intervalType: label });
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontSize: Convert(20) }}>Interval Type</Text>

            <Text style={{ fontSize: Convert(20) }}>{intervalType}</Text>
          </View>
        </ModalSelector>
      </View>
    );
  };

  snoozeModal() {
    let { snooze } = this.state;
    let data = [{ key: 0, section: true, label: "Snooze Time" }];
    for (let i = 1; i < 60; i++) {
      data.push({
        key: i + "",
        label: i + "",
        accessibilityLabel: i + ""
      });
    }
    return (
      <View style={styles.setting}>
        <ModalSelector
          data={data}
          initValue="Select an Instrument"
          supportedOrientations={["portrait"]}
          accessible={true}
          scrollViewAccessibilityLabel={"Scrollable options"}
          cancelButtonAccessibilityLabel={"Cancel Button"}
          style={{ flex: 1 }}
          onChange={({ label }) => {
            this.setState({ snooze: label });
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontSize: Convert(20) }}>Snooze</Text>

            <Text style={{ fontSize: Convert(20) }}>
              {snooze} minute{snooze > 1 ? "s" : null}
            </Text>
          </View>
        </ModalSelector>
      </View>
    );
  }

  answersNeededModal = () => {
    let { answersNeeded } = this.state;
    let data = [
      { key: 0, section: true, label: "Answers Needed To Turn Off Alarm" }
    ];
    for (let i = 1; i < 11; i++) {
      data.push({
        key: i + "",
        label: i + "",
        accessibilityLabel: i + ""
      });
    }
    return (
      <View style={styles.setting}>
        <ModalSelector
          data={data}
          initValue="Answers Needed To Stop Alarm"
          supportedOrientations={["portrait"]}
          accessible={true}
          style={{ flex: 1 }}
          scrollViewAccessibilityLabel={"Scrollable options"}
          cancelButtonAccessibilityLabel={"Cancel Button"}
          onChange={({ label }) => {
            this.setState({ answersNeeded: label });
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ fontSize: Convert(20) }}>Answers Needed</Text>

            <Text style={{ fontSize: Convert(20) }}>{answersNeeded}</Text>
          </View>
        </ModalSelector>
      </View>
    );
  };

  renderNoteAnimation() {
    let { iconOne, iconTwo } = this.state;

    return (
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
            transform: [{ scale: iconOne }]
          }}
        />
        <Animated.Image
          source={require("../../../assets/images/appIcon1024.png")}
          style={{
            height: Convert(40),
            width: Convert(40),
            resizeMode: "contain",
            transform: [{ scale: iconTwo }]
          }}
        />
      </View>
    );
  }

  render() {
    let { time, isDateTimePickerVisible } = this.state;
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
                  marginLeft: Convert(50),
                  marginRight: Convert(50),
                  marginTop: Convert(20),
                  marginBottom: Convert(30),
                  backgroundColor:
                    Platform.OS === "ios" ? "dodgerblue" : null
                }}
              >
                <Button
                  onPress={this._showDateTimePicker}
                  title="Edit"
                  accessibilityLabel="Edit Alarm"
                  color={Platform.OS === "ios" ? "white" : null}
                />
              </TouchableHighlight>

              <DateTimePicker
                isVisible={isDateTimePickerVisible}
                onConfirm={this._handleDatePicked}
                onCancel={this._hideDateTimePicker}
                mode="time"
              />
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
                textAlign: "center",
                alignSelf: "center"
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
                justifyContent: "space-around",
                width: Convert(300)
              }}
            >
              <View>{this.instrumentList()}</View>

              <View>{this.intervalList()}</View>

              <View>{this.snoozeModal()}</View>

              <View>{this.answersNeededModal()}</View>
            </View>
          </View>

          <View style={{ flexGrow: 1, justifyContent: "flex-end" }}>
            <TouchableHighlight
              style={{
                height: iphoneX ? Convert(80) : Convert(50),
                width: width,
                backgroundColor:
                  Platform.OS === "ios" ? "dodgerblue" : null,
                margin: 0
              }}
            >
              <Button
                onPress={edit ? this._editAlarm : this._addAlarm}
                title="SAVE"
                accessibilityLabel="Save Alarm"
                color={Platform.OS === "ios" ? "white" : null}
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  setting: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1
  }
});

const mapStateToProps = state => ({ alarm: state.alarm });
export default connect(mapStateToProps)(AddAlarm);
