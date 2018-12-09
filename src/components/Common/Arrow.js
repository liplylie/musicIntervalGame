"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Convert } from "../../styles";

class Arrow extends Component {
    static propTypes = {
        height: PropTypes.number,
        direction: PropTypes.string,
        color: PropTypes.string,
        style: PropTypes.object
    };

    static defaultProps = {
        height: Convert(16.7),
        direction: "left",
        color: "black",
        style: {}
    };

    constructor(props) {
        super(props);
    }

    render() {
        const { height, direction, color, style } = this.props;

        let width = 8.8 / 16.7 * height;
        let sideLength = Math.sqrt(width * width + height / 2 * (height / 2));

        let angle;
        if (direction === "left") {
            angle = "-45deg";
        } else if (direction === "right") {
            angle = "135deg";
        }

        return (
            <View style={style}>
                <View
                    style={[
                        {
                            width: sideLength,
                            height: sideLength,
                            backgroundColor: "transparent",
                            borderStyle: "solid",
                            borderColor: color,
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            transform: [
                                { rotate: angle },
                                { translateY: 0 } // it should be centered with 0 translateY
                            ]
                        }
                    ]}
                />
            </View>
        );
    }
}

export { Arrow };
export default Arrow;
