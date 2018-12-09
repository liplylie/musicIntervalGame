"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { Keyboard, Platform, View, Text, TouchableNativeFeedback, TouchableOpacity, StyleSheet } from "react-native";
import { Styles } from "../../styles";

class Button extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        onPress: PropTypes.func,
        style: PropTypes.any,
        onLayout: PropTypes.func,
        noAnimation: PropTypes.bool,
        hitSlop: PropTypes.object,
        accessible: PropTypes.bool,
        accessibilityLabel: PropTypes.string
    };

    static defaultProps = {
        disabled: false,
        onPress: () => { },
        style: {},
        onLayout: () => { },
        noAnimation: false,
        hitSlop: { top: 0, left: 0, bottom: 0, right: 0 },
        accessible: true,
        accessibilityLabel: "unlabled button"
    };

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
