import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  AppState, 
  AsyncStorage
} from "react-native";
import { persistor } from "./src/store.js";
import store from "./src/store.js";
import { Provider } from "react-redux";
import Home from "./src/components/Home/Home";
import AddAlarms from "./src/components/Home/AddAlarms";
import Game from "./src/components/Game";
import { PersistGate } from "redux-persist/integration/react";
import { ActionConst, Actions, Router, Scene } from "react-native-router-flux";
import PushNotification from "react-native-push-notification";
import moment from "moment";
import Rules from "./src/components/Game/Rules";
import { resetAlarm } from "./src/helper";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      activeGame: false
    };
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }
  componentWillMount() {
    PushNotification.configure({
      onNotification: function(notification) {
        console.log("ROOT NOTIFICATION:", notification);
        let currentScene = Actions.currentScene;
        console.log(currentScene, "current Scene");
        let { userInteraction, foreground, message, data, id } = notification;
        const clicked = userInteraction;
        if (currentScene === "Home") {
          if (clicked) {
            if (Platform.OS === "ios"){
              Actions.Game({ id: data.id, oid: data.oid, answersNeeded: data.answersNeeded });
            } else {
              Actions.Game({ id: id, oid: id, answersNeeded: data.answersNeeded});
            }
           
          } else if (foreground && !clicked) {
            if (Platform.OS === "ios") {
              Actions.Game({ id: data.id, oid: data.oid, answersNeeded: data.answersNeeded });
            } else {
              Actions.Game({ id: id, oid: id, answersNeeded: data.answersNeeded });
            }
          }
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      popInitialNotification: Platform.OS === "android",
      requestPermissions: true
    });
  }
  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    PushNotificationIOS.addEventListener("localNotification", notification => {
      console.log(notification, "received");
    });
  }

  async _handleAppStateChange(appState) {
    console.log(appState, "app state");

    if (appState === "active") {
      let { activeGame } = this.state;
      let state = store.getState();
      let { alarms } = state.alarm;
      if (Platform.OS === "ios") {
        PushNotificationIOS.getScheduledLocalNotifications(notification => {
          console.log(notification, "notification navigate to Game in app");
          if (notification.length && !activeGame) {
            notification.forEach(({ userInfo }) => {
              console.log(userInfo, "userInfo");
              console.log(alarms, "alarms");
              alarms.forEach(a => {
                console.log(a, "a");
                console.log(userInfo, "u");
                if ( (a.id === userInfo.id || a.id === userInfo.oid) && a.active) {
                  let activeAlarm = moment(a.date)
                    .startOf("minute")
                    .isBefore(moment.now());
                  let currentScene = Actions.currentScene;
                  if (activeAlarm && !activeGame && currentScene === "Home") {
                    this.setState(
                      {
                        activeGame: true
                      },
                      () => Actions.Game({ id: a.id, oid: userInfo.oid || a.id })
                    );
                  }
                }
              });
            });
          }
        });
      }
    }

    if (appState === "background" || appState === "inactive") {
      let state = store.getState();
      let { alarms } = state.alarm;
      console.log(alarms, "alarms");
      alarms.map(a => {
        if (moment(a.date).isAfter(moment.now())) {
          // if the alarms are after the current time, schedule them
          if (a.active) {
            resetAlarm(Platform.OS, a, id, a.snoozeTime = 3);
          }
        } else {
          // set the alarms to the next day
          if (!active) {
            let diff = moment().diff(moment(a.date), "days");
            a.date = moment(a.date)
              .add(diff + 1, "days")
              .format();
          }

          if (a.active) {
            resetAlarm(Platform.OS, a, id, a.snoozeTime = 3);
          }
        }
      });
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
                type={ActionConst.RESET}
              />
              <Scene
                key={"AddAlarms"}
                component={AddAlarms}
                hideNavBar
                type={ActionConst.RESET}
              />
              <Scene
                key={"EditAlarm"}
                component={AddAlarms}
                hideNavBar
                type={ActionConst.RESET}
              />
              <Scene
                key={"Rules"}
                component={Rules}
                hideNavBar
                type={ActionConst.RESET}
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
