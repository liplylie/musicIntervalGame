"use strict";

import React, { Component } from "react";
import {
  View,
  Platform,
  Dimensions
} from "react-native";

import { BannerView, NativeAdsManager, AdSettings } from "react-native-fbads";

const { height, width } = Dimensions.get("window");
const iphoneX = height > 800;
const mode = process.env.NODE_ENV;

const placementId =
  Platform.OS === "ios"
    ? "2098852450199441_2098862933531726"
    : "2098852450199441_2124160657668620";

const Banner = () => {
  if (mode === "development") return null;

  return (
    <View style={{ margin: 0, padding: 0 }}>
      <BannerView
        placementId={placementId}
        type={iphoneX ? "large" : "standard"}
        onError={err => console.error("error in banner", err)}
      />
    </View>
  );
};
export default Banner;
