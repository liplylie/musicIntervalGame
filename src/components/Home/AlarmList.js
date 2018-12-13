
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
    }

    confirmDeletePress = data => {
        Alert.alert("Are you sure?", "Your chat will be deleted", [
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

    renderAlarms(data){
        console.log(data, "data bitch")
        var radio_props = [
            { label: 'On', value: 0 },
            { label: 'Off', value: 1 }
        ];
        if (!data) {
            return null
        }
        return (
            <View style={{height: Convert(100), display: "flex", flexDirection: "column", justifyContent: "space-around", borderStyle: "solid", borderColor: "black", borderWidth: 1, backgroundColor: "white"}}>
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}>
                    <Text style={{fontSize: 40}}>8:00</Text>
                    <RadioForm
                        radio_props={radio_props}
                        labelColor={'gray'}
                        onPress={value => { console.log(value, "value")}}
                        formHorizontal={true}
                        animation={true}
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
        const alarmData = [1,2,3,4]
        const dataSource = this.ds.cloneWithRows(alarmData);
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
export { AlarmList };
export default AlarmList;

