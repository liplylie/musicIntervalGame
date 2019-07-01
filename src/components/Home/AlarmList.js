import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  Alert,
  Text,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
  ListView,
  Platform,
  PushNotificationIOS,
  StyleSheet
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SwipeListView } from "react-native-swipe-list-view";
import { Actions, ActionConst } from "react-native-router-flux";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";
import PushNotification from "react-native-push-notification";
import moment from "moment";
import { cancelAlarm, setAlarm } from "../../helper";

import { connect } from "react-redux";
import { Colors, Convert, Styles } from "../../styles";
const { height, width } = Dimensions.get("window");

class AlarmList extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.handleAlarmActivation = this.handleAlarmActivation.bind(this);
    this.renderAlarms = this.renderAlarms.bind(this);
    this.handleDeletePress = this.handleDeletePress.bind(this);
  }

  confirmDeletePress = (data, rowRef) => {
    Alert.alert("Are you sure?", "Your alarm will be deleted", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: () => this.handleDeletePress(data, rowRef)
      }
    ]);
  };

  handleAlarmActivation(value, alarm) {
    let { dispatch } = this.props;
    dispatch({
      type: "activateAlarm",
      payload: { id: alarm.id, active: value }
    });
    if (value === 0) {
      cancelAlarm(Platform.OS, alarm.id);
    } else if (value === 1) {
      if (!moment(alarm.date).isAfter(moment.now())) {
        let diff = moment().diff(moment(alarm.date), "days");
        alarm.date = moment(alarm.date)
          .add(diff + 1, "days")
          .format();
      }
      setAlarm(
        Platform.OS,
        alarm.id,
        alarm.date,
        alarm.snoozeTime,
        alarm.answersNeeded,
        alarm.message,
        alarm.instrument
      );
    }
  }

  renderAlarms(data) {
    let radio_props = [{ label: "On", value: 1 }, { label: "Off", value: 0 }];
    let alarmColor = ["rgba(240, 240, 240, 0.9)", "rgba(200, 200, 200, 1)"];
    let alarmReverse = ["rgba(200, 200, 200, 1)", "rgba(240, 240, 240, 0.9)"];
    if (!data) {
      return null;
    }
    return (
      <LinearGradient
        style={styles.alarmContainer}
        start={{ x: 0.0, y: 0.25 }}
        end={{ x: 1, y: 1.0 }}
        colors={data.active ? alarmColor : alarmReverse}
      >
        <View style={{ display: "flex", flexDirection: "column" }}>
          <View style={styles.alarm}>
            <TouchableOpacity onPress={() => Actions.EditAlarm({ edit: data })}>
              <Text style={{ fontSize: Convert(40), paddingLeft: Convert(10) }}>
                {data.time}
              </Text>
            </TouchableOpacity>
            <RadioForm
              radio_props={radio_props}
              labelColor={"gray"}
              onPress={value => this.handleAlarmActivation(value, data)}
              formHorizontal={true}
              animation={true}
              initial={data.active ? 0 : 1}
              radioStyle={{ paddingRight: Convert(13) }}
              style={{ marginLeft: Convert(60) }}
            />
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text>{data.message}</Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  handleDeletePress(data, rowRef) {
    let { dispatch } = this.props;
    dispatch({ type: "deleteAlarm", payload: data });
    cancelAlarm(Platform.OS, data.id);
    rowRef.manuallySwipeRow(0);
  }

  render() {
    const { alarms } = this.props;
    const dataSource = this.ds.cloneWithRows(alarms);
    return (
      <SwipeListView
        style={{
          width: width,
          height: height,
          backgroundColor: Colors.lightGray
        }}
        dataSource={dataSource}
        renderRow={this.renderAlarms}
        renderHiddenRow={(data, secId, rowId, rowMap) => (
          <View
            style={{
              alignSelf: "flex-end",
              marginRight: Convert(10),
              marginTop: Convert(5),
              padding: Convert(11),
              backgroundColor: "red"
            }}
          >
            <TouchableOpacity
              onPress={() =>
                this.confirmDeletePress(data, rowMap[`${secId}${rowId}`])
              }
            >
              <Image
                style={{
                  height: Convert(60),
                  width: Convert(60)
                }}
                source={require("../../../assets/images/trash.png")}
              />
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
      />
    );
  }
}

const styles = StyleSheet.create({
  alarmContainer: {
    height: Convert(100),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    borderStyle: "solid",
    borderColor: "rgba(235, 235,235, 1)",
    borderWidth: 1,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 3,
    shadowOpacity: 1.0
  },
  alarm: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  }
});

const mapStateToProps = state => ({ alarms: state.alarm.alarms });

export default connect(mapStateToProps)(AlarmList);
