"use strict";

import React, { Component } from "react";
import { Keyboard, Platform, View, Text, TouchableNativeFeedback, TouchableOpacity, StyleSheet } from "react-native";
import { Styles } from "../../styles";

class Button extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            accessible,
            accessibilityLabel,
            onPress,
            disabled,
            style,
            onLayout,
            noAnimation,
            hitSlop
        } = this.props;

        if (noAnimation) {
            return (
                <View accessible={accessible} accessibilityLabel={accessibilityLabel} onStartShouldSetResponder={() => !disabled} onResponderGrant={onPress} style={style} onLayout={onLayout} hitSlop={hitSlop} >
                    {this.props.children}
                </View>
            );
        }

        return (
            <TouchableOpacity
                accessible={accessible}
                accessibilityLabel={accessibilityLabel}
                disabled={disabled}
                onPress={onPress}
                style={[style]}
                onLayout={onLayout}
                hitSlop={hitSlop}
            >
                {this.props.children}
            </TouchableOpacity>
        );
    }
}

export { Button };
export default Button;
