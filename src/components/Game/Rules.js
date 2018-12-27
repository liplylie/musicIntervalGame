"use strict";

import React, { Component } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Convert } from "../../styles";
import NavBar from "../Common/NavBar";
import { Actions } from "react-native-router-flux";

class Rules extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ margin: "auto", padding: Convert(10) }}>
        <NavBar
          title={"Rules"}
          leftButtonIcon="left"
          onLeftButtonPress={() => Actions.Game()}
        />
        <Text
          style={{ textAlign: "center", margin: "auto", fontSize: Convert(18) }}
        >
          This app is perfect for those who wish to train their musical ear!
          {"\n"}
          {"\n"}
          Simply set an alarm, and in order to turn the alarm off, you will need
          to answer three music interval questions correctly.
          {"\n"}
          Missing the alarm, or swiping out of the app while the alarm is going off will set a snooze for one minute.
           {"\n"}
        </Text>
        <View>
          <Text
            style={{
              textAlign: "center",
              margin: "auto",
              fontSize: Convert(18)
            }}
          >
            If you do not know what a music interval is, please see here:
            {"\n"}
          </Text>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://en.wikipedia.org/wiki/Interval_(music)")
            }
          >
            <Text
              style={{
                textAlign: "center",
                color: "blue",
                margin: "auto",
                fontSize: Convert(18)
              }}
            >
              Click here
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
export default Rules;
