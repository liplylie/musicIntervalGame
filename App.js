import React, { Component } from "react";
import { Platform, PushNotificationIOS, AppState } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ActionConst, Actions, Router, Scene } from "react-native-router-flux";
import PushNotification from "react-native-push-notification";
import moment from "moment";

// Global
import { resetAlarm } from "./src/helper";
import store, { persistor } from "./src/store.js";

// Components
import Rules from "./src/components/Game/Rules";
import Home from "./src/components/Home/Home";
import AddAlarms from "./src/components/Home/AddAlarms";
import Game from "./src/components/Game";

export default class App extends Component {
  state = {
    activeGame: false
  };

  componentWillMount() {
    PushNotification.configure({
      onNotification: function(notification) {
        let currentScene = Actions.currentScene;
        let { userInteraction, foreground, data, userInfo } = notification;
        const clicked = userInteraction;
        if (currentScene === "Home") {
          if (clicked) {
            if (Platform.OS === "ios") {
              Actions.Game({
                id: data.id,
                oid: data.oid,
                answersNeeded: data.answersNeeded,
                instrument: data.instrument,
                intervalType: data.intervalType,
                gameType: data.gameType
              });
            } else {
              Actions.Game({
                id: userInfo.id,
                oid: userInfo.id,
                answersNeeded: userInfo.answersNeeded,
                instrument: userInfo.instrument,
                intervalType: userInfo.intervalType,
                gameType: userInfo.gameType
              });
            }
          } else if (foreground && !clicked) {
            if (Platform.OS === "ios") {
              Actions.Game({
                id: data.id,
                oid: data.oid,
                answersNeeded: data.answersNeeded,
                instrument: data.instrument,
                intervalType: data.intervalType,
                gameType: data.gameType
              });
            } else {
              Actions.Game({
                id: userInfo.id,
                oid: userInfo.id,
                answersNeeded: userInfo.answersNeeded,
                instrument: userInfo.instrument,
                intervalType: userInfo.intervalType,
                gameType: userInfo.gameType
              });
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
  }

  _handleAppStateChange = async appState => {
    if (appState === "active") {
      let { activeGame } = this.state;
      let state = store.getState();
      let { alarms } = state.alarm;
      if (Platform.OS === "ios") {
        PushNotificationIOS.getScheduledLocalNotifications(notification => {
          if (notification.length && !activeGame) {
            notification.forEach(({ userInfo }) => {
              alarms.forEach(a => {
                if (
                  (a.id === userInfo.id || a.id === userInfo.oid) &&
                  a.active
                ) {
                  let activeAlarm = moment(a.date)
                    .startOf("minute")
                    .isBefore(moment.now());
                  let { currentScene } = Actions;
                  if (activeAlarm && !activeGame && currentScene === "Home") {
                    this.setState(
                      {
                        activeGame: true
                      },
                      () =>
                        Actions.Game({
                          id: a.id,
                          oid: userInfo.oid || a.id,
                          snooze: a.snoozeTime || 1,
                          answersNeeded: a.answersNeeded || 3
                        })
                    );
                  }
                }
              });
            });
          }
        });
      } else {
        alarms.forEach(a => {
          if (a.active) {
            let activeAlarm = moment(a.date)
              .startOf("minute")
              .isBefore(moment.now());
            let { currentScene } = Actions;
            if (activeAlarm && !activeGame && currentScene === "Home") {
              this.setState(
                {
                  activeGame: true
                },
                () =>
                  Actions.Game({
                    id: a.id,
                    oid: a.id,
                    snooze: a.snoozeTime || 1,
                    answersNeeded: a.answersNeeded || 3
                  })
              );
            }
          }
        });
      }
    }

    if (appState === "background" || appState === "inactive") {
      let state = store.getState();
      let { alarms } = state.alarm;

      alarms.map(a => {
        if (moment(a.date).isAfter(moment.now())) {
          // if the alarms are after the current time, schedule them
          if (a.active) {
            resetAlarm({
              device: Platform.OS,
              alarm: a,
              id,
              snooze: snoozeTime
            });
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
            resetAlarm({
              device: Platform.OS,
              alarm: a,
              id,
              snooze: snoozeTime
            });
          }
        }
      });
    }
  };

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
