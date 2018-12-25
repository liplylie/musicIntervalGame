import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PushNotificationIOS,
  AppState
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
import moment from "moment"



export default class App extends Component {
  componentWillMount() {
    
   
  

   
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log("ROOT NOTIFICATION:", notification);
        let currentScene = Actions.currentScene;
        console.log(currentScene, "current Scene")
        let { userInteraction, foreground, message, data} = notification;
        const clicked = userInteraction;
        if (currentScene === "Home") {
          if (clicked) {
            Actions.Game(data.id)
          } else if (foreground && !clicked) {
            Actions.Game(data.id)
          }
        }
        
       // Actions.Game()
         
        // PushNotification.cancelAllLocalNotifications();
        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      popInitialNotification: false,
      requestPermissions: true
    });
   
  }
  componentDidMount() {
    
    // PushNotificationIOS.requestPermissions()
    //   .then(perms => console.log(`PERMS`, perms))
    //   .catch(err => console.log(`ERROR REQUESTING PERMISSIONS`, err));
    console.log(this.props, "app props")
    AppState.addEventListener("change", this._handleAppStateChange);
  }

   _handleAppStateChange(appState) {
    console.log(appState, "app state");
    
    if (appState === "background" || appState === "inactive") {
      let state = store.getState()
      let { alarms } = state.alarm;
      console.log(alarms, "fuck you")
      PushNotification.cancelAllLocalNotifications()
      alarms.map(a => {
       
        if (moment(a.date).isAfter(moment.now())) {
          // if the alarms are after the current time, schedule them
          if (a.active) {
            if (Platform.OS === "android") {
              PushNotification.localNotificationSchedule({
                message: a.message || "test alarm",
                date: new Date(a.date),
                soundName: "Eb4.mp3",
                // repeatType: "minute",
                id: a.id,
                repeatType: "minute",
                repeatTime: new Date(Date.now() + (1000 * 60 * 10))
              });
            } else {
              PushNotification.localNotificationSchedule({
                message: a.message || "test alarm",
                date: new Date(a.date),
                soundName: "Eb4.mp3",
                userInfo: { id: a.id },
                repeatType: "minute",
                repeatTime: new Date(Date.now() + (1000 * 60 * 10))
                // repeatType: "minute",
                //repeatTime: new Date(Date.now() + 100)
              });
            }
          }
        } else {
          // set the alarms to the next day
          let diff = moment().diff(moment(a.date), "days")
          console.log(a.date, "before");
          console.log(diff, "diff")
          a.date = moment(a.date).add(diff + 1, "days").format();
          console.log(a.date, "after")
          if (a.active) {
            if (Platform.OS === "android") {
              PushNotification.localNotificationSchedule({
                message: a.message || "test alarm",
                date: new Date(a.date),
                soundName: "Eb4.mp3",
                repeatType: "minute",
                id: a.id,
                //repeatType: "time"
                //repeatTime: new Date(Date.now() + 100)
              });
            } else {
              PushNotification.localNotificationSchedule({
                message: a.message || "test alarm",
                date: new Date(a.date),
                soundName: "Eb4.mp3",
                userInfo: { id: a.id },
                repeatType: "minute",
                //repeatTime: new Date(Date.now() + 100)
              });
            }
          }

        }
        
      })
      // PushNotificationIOS.scheduleLocalNotification(details)
      // PushNotification.presentLocalNotification(details);
     
     
    } else {
      // PushNotification.popInitialNotification(notification => {
      //   console.log(notification, "notification")
      // })
      
     
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
