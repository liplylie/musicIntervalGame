
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
    PushNotificationIOS
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Actions, ActionConst } from "react-native-router-flux";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import PushNotification from "react-native-push-notification";
import moment from "moment"

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

    handleAlarmActivation(value, alarm){
        console.log(alarm, "alarm", value, "value")
        let { dispatch } = this.props;
        dispatch({type: "activateAlarm", payload: { id: alarm.id, active: value}})
        if (value === 0 ) {
            if (Platform.OS === "ios") {
                PushNotificationIOS.getScheduledLocalNotifications(notification => {
                    console.log(notification, "local notification schedule in end game")
                    notification.forEach(({ userInfo }) => {
                        console.log(userInfo, "userInfo")
                        if (userInfo.id === alarm.id) {
                            PushNotification.cancelLocalNotifications({ id: alarm.id })
                        }
                    })
                });
            }
        } else if (value === 1) {
            if (!moment(alarm.date).isAfter(moment.now())){
                let diff = moment().diff(moment(alarm.date), "days")
                alarm.date = moment(alarm.date).add(diff + 1, "days").format();
            }
            if (Platform.OS === "android") {
                PushNotification.localNotificationSchedule({
                    message: alarm.message || "Alarm",
                    date: new Date(alarm.date),
                    soundName: "PerfectFifth.mp3",
                    repeatType: "minute",
                    id: alarm.id,
                    // repeatType: "time",
                    // repeatTime: 1000
                });
            } else {
                PushNotification.localNotificationSchedule({
                    message: alarm.message || "Alarm",
                    date: new Date(alarm.date),
                    soundName: "PerfectFifth.mp3",
                    userInfo: { id: alarm.id },
                    // repeatType: "time",
                    // repeatTime: 1000
                    // repeatTime: new Date(Date.now() + (1000 * 60 * 10))
                    repeatType: "minute",
                    //repeatTime: new Date(Date.now() + 100)
                });
            }
        }
    }

    renderAlarms(data){
        console.log(data, "alarm data")
        var radio_props = [
            { label: 'On', value: 1 },
            { label: 'Off', value: 0 }
        ];
        if (!data) {
            return null
        }
        return (
            <View style={{height: Convert(100), display: "flex", flexDirection: "column", justifyContent: "space-around", borderStyle: "solid", borderColor: "black", borderWidth: 1, backgroundColor: "white"}}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}} >
                    <TouchableOpacity onPress={() => Actions.EditAlarm({ edit: data })}><Text style={{fontSize: 40}}>{data.time}</Text></TouchableOpacity>
                    <RadioForm
                        radio_props={radio_props}
                        labelColor={'gray'}
                        onPress={value => this.handleAlarmActivation(value, data)}
                        formHorizontal={true}
                        animation={true}
                        initial={data.active ? 0 : 1 }
                        radioStyle={{ paddingRight: Convert(13) }}
                        style={{marginLeft: Convert(100)}}
                    />
                </View>
                <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Text>{data.message}</Text>
                </View>
                
            </View>
        )
    }

    handleDeletePress(data, rowRef) {
        // delete data
        let { dispatch } = this.props;
        dispatch({type: "deleteAlarm", payload: data})
        if (Platform.OS === "ios") {
            PushNotificationIOS.getScheduledLocalNotifications(notification => {
                console.log(notification, "local notification schedule in alarm list")
                notification.forEach(({ userInfo }) => {
                    console.log(userInfo, "userInfo")
                    if (userInfo.id === data.id) {
                        PushNotification.cancelLocalNotifications({ id: userInfo.id })
                    }
                })
            });
        }
        rowRef.manuallySwipeRow(0);
    }

    render(){
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
                            backgroundColor: "red",
                            padding: Convert(11)
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>
                                this.confirmDeletePress(data, rowMap[`${secId}${rowId}`])
                            }
                        >
                            <Image
                                style={{ height: Convert(60), width: Convert(60) }}
                                source={require("../../../assets/images/trash.png")}
                            />
                        </TouchableOpacity>
                    </View>
                )}
                rightOpenValue={-75}
            />
        )
    }
}

const mapStateToProps = state => ({ alarms: state.alarm.alarms})

export default connect(mapStateToProps)(AlarmList);

