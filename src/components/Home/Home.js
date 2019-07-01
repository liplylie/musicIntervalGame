import React from "react";
import { View, ScrollView } from "react-native";
import { Actions } from "react-native-router-flux";
import { Convert } from "../../styles";
import Banner from "../Ads/Banner";

import AlarmList from "./AlarmList";
import NavBar from "../Common/NavBar";

const Home = () => {
  const handleMusicSymbolPress = () => {
    Actions.Game();
  };

  const handleAddAlarm = () => {
    Actions.AddAlarms();
  };

  return (
    <View style={{ display: "flex", flex: 1 }}>
      <NavBar
        title="Alarms"
        leftButtonIcon="music"
        rightButtonIcon="plus"
        onLeftButtonPress={handleMusicSymbolPress}
        onRightButtonPress={handleAddAlarm}
      />
      <ScrollView contentContainerStyle={{ display: "flex", flex: 1 }}>
        <AlarmList />
      </ScrollView>

      <View style={{ marginBottom: Convert(30) }}>
        <Banner />
      </View>
    </View>
  );
};

export default Home;
