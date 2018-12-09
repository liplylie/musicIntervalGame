import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Platform,
    View,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Image
} from "react-native";
import { Styles, Convert, Colors } from "../../styles";
import Arrow from "./Arrow";
import Button from "./Button";
import SuperText from "./SuperText";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

export default class NavBar extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        leftButtonTitle: PropTypes.string,
        rightButtonTitle: PropTypes.string,
        leftButtonIcon: PropTypes.string, // left | right | menu | board | edit | invite | none
        rightButtonIcon: PropTypes.string, // left | right | menu | board | edit | invite | none | close | search | list
        rightIconColor: PropTypes.string,
        leftButtonStyle: PropTypes.any,
        leftButtonTextStyle: PropTypes.any,
        leftArrowColor: PropTypes.string,
        rightButtonTextStyle: PropTypes.any,
        onLeftButtonPress: PropTypes.func,
        onRightButtonPress: PropTypes.func,
        showDivider: PropTypes.bool,
        backgroundColor: PropTypes.string,
        top: PropTypes.number,
        setToTop: PropTypes.bool
    };

    static defaultProps = {
        title: "",
        leftButtonTitle: "",
        rightButtonTitle: "",
        leftButtonIcon: "none",
        rightButtonIcon: "none",
        rightIconColor: "black",
        onLeftButtonPress: () => { },
        onRightButtonPress: () => { },
        leftButtonTextStyle: {},
        rightButtonTextStyle: {},
        showDivider: true,
        backgroundColor: "white",
        top: 0,
        setToTop: false
    };

    constructor(props) {
        super(props);
    }

    renderLeftButton = () => {
        const {
            leftButtonTitle,
            leftButtonIcon,
            leftButtonTextStyle,
            onLeftButtonPress
        } = this.props;

        let icon;
        if (leftButtonIcon === "left") {
            icon = (
                <Arrow
                    width={Convert(8.8)}
                    height={Convert(16.7)}
                    direction="left"
                    color={this.props.leftArrowColor}
                />
            );
        } else if (leftButtonIcon === "menu") {
            icon = (
                <Image
                    source={require("../../../assets/images/menuIcon.png")}
                    style={{
                        marginRight: Convert(8),
                        height: Convert(16),
                        //top: Convert(1)/2,
                        resizeMode: "contain"
                    }}
                />
            );
        }
        else if (leftButtonIcon === "music") {
            icon = (
                <FontAwesome
                    size={Convert(20)}
                    name="music"
                    color={Colors.actionGreen}
                    style={{ marginLeft: Convert(10) }}
                />
            );
        }


        return (
            <Button
                style={[this.leftButtonStyle, styles.leftBtn]}
                onPress={onLeftButtonPress}
                accessibilityLabel={leftButtonTitle || leftButtonIcon || 'left nav button'}>
                {icon}
                <SuperText style={[styles.leftBtnText, leftButtonTextStyle,]} >
                    {leftButtonTitle}
                </SuperText>
            </Button>
        );
    };

    renderRightButton = () => {
        const {
            rightButtonTitle,
            rightButtonIcon,
            rightButtonTextStyle,
            onRightButtonPress,
            rightIconColor
        } = this.props;

        let icon;
        if (rightButtonIcon === "musicSymbol") {
            icon = (
                <FontAwesome
                    size={Convert(19.7)}
                    name={"music"}
                    style={{
                        transform: [{ scaleY: -1 }],
                        marginLeft: Convert(7.31)
                    }}
                />
            );
        } else if (rightButtonIcon === "music") {
            icon = (
                <FontAwesome
                    size={Convert(20)}
                    name="music"
                    color={Colors.actionGreen}
                    style={{ marginLeft: Convert(10) }}
                />
            );
        } else if (rightButtonIcon === "right") {
            icon = (
                <Arrow
                    width={Convert(8.8)}
                    height={Convert(16.7)}
                    direction="right"
                />
            );
        } else if (rightButtonIcon === "close") {
            icon = (
                <Image
                    source={require("../../../assets/images/buttonClose.png")}
                    style={{
                        width: Convert(18),
                        height: Convert(18)
                    }}
                />
            );
        } else if (rightButtonIcon === "search") {
            icon = (
                <Ionicons
                    name="ios-search-outline"
                    size={Convert(27)}
                    color={Colors.textBlack}
                    style={{
                        transform: [{ translateY: Convert(2) }]
                    }}
                />
            );
        } else if (rightButtonIcon === "list") {
            icon = (
                <Ionicons
                    name="ios-list"
                    size={Convert(36)}
                    color={Colors.textBlack}
                    style={{
                        transform: [{ translateY: Convert(2) }, { translateX: -Convert(0) }]
                    }}
                />
            );
        }
        else if (rightButtonIcon === "plus") {
            icon = (
                <FontAwesome
                    size={Convert(20)}
                    name="plus"
                    color={Colors.actionGreen}
                    style={{ marginLeft: Convert(10) }}
                />
            );
        }


        return (
            <Button
                style={styles.rightBtn}
                onPress={onRightButtonPress}
                accessibilityLabel={
                    rightButtonTitle || rightButtonIcon || "right nav button"
                }
            >
                <SuperText
                    style={[
                        {
                            fontSize: Convert(16),
                            letterSpacing: -0.4,
                            top: Convert(1)
                        },
                        rightButtonTextStyle
                    ]}
                >
                    {rightButtonTitle}
                </SuperText>
                {icon}
            </Button>
        );
    };

    renderTitle = () => {
        const { title } = this.props;
        return (
            <SuperText style={{ fontSize: Convert(21.3), letterSpacing: Convert(-0.5), textAlign: 'center' }} >
                {title}
            </SuperText>
        );
    };

    render() {
        const {
            leftButtonTitle,
            rightButtonTitle,
            leftButtonIcon,
            rightButtonIcon,
            title,
            showDivider,
            backgroundColor,
            top
        } = this.props;

        const setToTopStyle = this.props.setToTop
            ? {
                position: "absolute",
                top: top,
                zIndex: 1000
            }
            : {};

        if (this)
            return (
                <View style={[setToTopStyle, styles.navBar, { borderBottomColor: showDivider ? Colors.textBlack10 : 'transparent' }]}>

                    <View style={styles.container}>
                        {(leftButtonTitle || leftButtonIcon) && this.renderLeftButton()}

                        {this.renderTitle()}

                        {(rightButtonTitle || rightButtonIcon) && this.renderRightButton()}
                    </View>
                </View>
            );
    }
}


const styles = StyleSheet.create({
    navBar: {
        height: Height * .1,
        width: Width,
        borderWidth: 1,
        borderColor: 'transparent'
    },
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: Width * 0.03,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    leftBtnContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        top: Width * 0.08,
        width: Width * 0.1
    },
    leftBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: Convert(18),
        paddingRight: Convert(18),
        position: 'absolute',
        left: 0,
        top: Width * 0.025,
        height: Height * 0.05,
    },
    leftBtnText: {
        fontSize: Convert(16),
        letterSpacing: -0.4
    },
    rightBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: Convert(18),
        paddingRight: Convert(18),
        position: 'absolute',
        right: 0,
        top: Width * 0.025,
        height: Height * 0.05,
    },
    TitleText: {
        fontSize: Convert(20),
        height: Convert(20),
        letterSpacing:
            Convert(5.5),
        textAlign: 'center',
        color: 'black'
    }
});