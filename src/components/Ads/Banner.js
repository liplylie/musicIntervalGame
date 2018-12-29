"use strict";

import React, { Component } from "react";
import { View, Text, TouchableOpacity, Linking, Platform } from "react-native";
import { Convert } from "../../styles";
import { Actions } from "react-native-router-flux";
import { BannerView } from "react-native-fbads";

class Banner extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (Platform.OS === "ios"){
            return (
                <View>
                    <BannerView
                        placementId="2098852450199441_2098862933531726"
                        type="standard"
                        onPress={() => console.log('click')}
                        onError={err => console.log('error', err)}
                    />
                </View>
            );
        }
       
    }
}
export default Banner;
