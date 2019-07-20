import React from "react";
import { View, Text } from "react-native";

export const Capitalize = props => {
  let text =
    props.children &&
    props.children.slice(0, 1).toUpperCase() +
      props.children.slice(1, props.children.length);

  return (
    <View>
      <Text {...props}>{text}</Text>
    </View>
  );
};

export default Capitalize;
