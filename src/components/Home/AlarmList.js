
import React, { Component } from "react";
import {
    TouchableWithoutFeedback,
    Alert,
    Text,
    Keyboard,
    Animated,
    Dimensions,
    Easing,
    Image,
    StatusBar,
    View,
    StyleSheet,
    TouchableOpacity,
    ListView,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { Actions, ActionConst } from "react-native-router-flux";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

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

    confirmDeletePress = data => {
        Alert.alert("Are you sure?", "Your alarm will be deleted", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Yes",
                onPress: () => this.handleDeletePress(data)
            }
        ]);
    };

    handleAlarmActivation(value, alarm){
        console.log(alarm, "alarm", value, "value")
        let { dispatch } = this.props;
        if (value){
           dispatch({type: "editAlarm", payload: { id: alarm.id}})
        }
    }

    renderAlarms(data){
        console.log(data, "bitch")
        var radio_props = [
            { label: 'On', value: 1 },
            { label: 'Off', value: 0 }
        ];
        if (!data) {
            return null
        }
        return (
            <View style={{height: Convert(100), display: "flex", flexDirection: "column", justifyContent: "space-around", borderStyle: "solid", borderColor: "black", borderWidth: 1, backgroundColor: "white"}}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                    <Text style={{fontSize: 40}}>{data.time}{data.meridiem}</Text>
                    <RadioForm
                        radio_props={radio_props}
                        labelColor={'gray'}
                        onPress={value => this.handleAlarmActivation(value, data)}
                        formHorizontal={true}
                        animation={true}
                        initial={data.active ? 1: 0}
                        radioStyle={{ paddingRight: Convert(13) }}
                        style={{marginLeft: Convert(100)}}
                    />
                </View>
                <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Text>Alarm Description</Text>
                </View>
                
            </View>
        )
    }

    handleDeletePress(data) {
        // delete data
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
                                this.confirmDeletePress(data)
                            }
                        >
                            <Image
                                style={{ height: Convert(40), width: Convert(40) }}
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

