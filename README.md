# Music Interval Alarm
This is the Music Interval Alarm.

## Setup
1.  clone this repo
2.  `npm install`
3. react-native link
4. For ios, cd into ios, and run pod install

## Deployment
- ios: build archive, send to itunes connect
- android: build signed apk, send to google play store

## Structure
- src/components: contains main components (Ads, Common, Game, Home)
- src/helpers: helper functions (Alarm, cancelAlarm)
- src/reducuers: redux reducers
- src/samples: sound files
- store.js: redux store4
- style.js: responsive styling

## Developing Locally
- ios: open `.xcworkspace` 
- android: open android studio, open emulator, run `react-native run android`. If this doesn't work, try running `sh androidBuild.sh` and building from Android studio. If the error ` Error: Duplicate resources` occurs, delete `/android/app/src/main/res/` drawable files and raw folder.