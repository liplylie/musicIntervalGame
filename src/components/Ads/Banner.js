"use strict";

import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  Dimensions
} from "react-native";
import { Convert } from "../../styles";
import { Actions } from "react-native-router-flux";
import { BannerView, NativeAdsManager, AdSettings } from "react-native-fbads";

const { height, width } = Dimensions.get("window");
const iphoneX = height > 800;
const mode = process.env.NODE_ENV;

const placementId =
  Platform.OS === "ios"
    ? "2098852450199441_2098862933531726"
    : "2098852450199441_2124160657668620";
class Banner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ margin: 0, padding: 0 }}>
        <BannerView
          placementId={mode === "development" ? "" : placementId}
          type={iphoneX ? "large" : "standard"}
          onPress={() => console.log("click")}
          onError={err => console.log("error in banner", err)}
        />
      </View>
    );
  }
}
export default Banner;
