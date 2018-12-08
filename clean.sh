rm -rf node_modules
rm -rf $TMPDIR/react-*
echo "\nRemoving node_modules... DONE"
rm -rf ~/Library/Developer/Xcode/DerivedData
echo "\nRemoving Xcode DerivedData... DONE"
rm -rf ./ios/build
echo "\nRemoving iOS Build folder... DONE"
./android/gradlew clean -p ./android/
npm install
echo "\n npm install... DONE"
npm start