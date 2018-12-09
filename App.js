import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, PushNotificationIOS, AppState } from 'react-native';
import {  persistor } from "./src/store.js";
import store from "./src/store.js"
import { Provider } from "react-redux";
import Home from "./src/components/Home/Home";
import AddAlarms from "./src/components/Home/AddAlarms";
import Game from "./src/components/Game";
import { PersistGate } from "redux-persist/integration/react";
import { ActionConst, Actions, Router, Scene } from "react-native-router-flux";



export default class App extends Component {
  componentDidMount() {
    PushNotificationIOS.requestPermissions()
      .then(perms => console.log(`PERMS`, perms))
      .catch(err => console.log(`ERROR REQUESTING PERMISSIONS`, err));
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange(appState) {
    console.log(appState, "app state")
    if (appState === "background" || appState === "inactive") {
      let details = { alertBody: "test" };
      console.log(details, "details");
      console.log(PushNotificationIOS, "ios");
      // PushNotificationIOS.scheduleLocalNotification(details)
      PushNotificationIOS.presentLocalNotification(details);
    }


  }
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Scene key={"ROOT_SCENE"} panHandlers={null} passProps>
            <Scene
              key={"Home"}
              component={Home}
              hideNavBar
              type={ActionConst.RESET}
            />
            <Scene
              key={"Game"}
              component={Game}
              hideNavBar
              type={ActionConst.PUSH}
            />
            <Scene
              key={"AddAlarms"}
              component={AddAlarms}
              hideNavBar
              type={ActionConst.PUSH}
            />
          </Scene>
        </Router>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
