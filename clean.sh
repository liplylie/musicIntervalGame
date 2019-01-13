rm -rf node_modules
npm cache clean --force
npm dedupe
yarn cache clean
echo "\nclean cache... DONE"
rm -rf $TMPDIR/react-*
echo "\nRemoving node_modules... DONE"
rm -rf ~/Library/Developer/Xcode/DerivedData
echo "\nRemoving Xcode DerivedData... DONE"
cd ios
rm -rf build
rm -rf ~/Library/Caches/CocoaPods
pod cache clean --all
rm -rf Pods
rm -rf ~/Library/Developer/Xcode/DerivedData/*
# pod install
cd ..
echo "\nRemoving iOS Build folder... DONE"
./android/gradlew clean -p ./android/
npm install
echo "\n npm install... DONE"
react-native link
npm start