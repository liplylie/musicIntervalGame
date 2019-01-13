"use strict";

import React, { Component } from "react";
import { Text, StyleSheet } from "react-native";

import _ from "lodash";
import { Styles, Convert, Colors } from "../../styles";

class SuperText extends Component {

    render() {
        const {
            style,
            type,
            color,
            fontSize,
            autoHeight,
            numberOfLines,
            textAlign
        } = this.props;

        let family = Styles.mainFamily;
        if (type === "regular") {
            family = Styles.mainFamily;
        } else if (type === "medium") {
            family = Styles.mediumFamily;
        } else if (type === "thin" || type === "light") {
            family = Styles.thinFamily;
        } else if (type === "bold") {
            family = Styles.boldFamily;
        } else if (type === "italic") {
            family = Styles.italicFamily;
        }

        return (
            <Text style={[family, styles.main, { color, fontSize, textAlign }, style]}
                numberOfLines={numberOfLines}
                allowFontScaling={false}>
                {this.props.children}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: 'transparent'
    }
});

export { SuperText };
export default SuperText;
