import { StyleSheet, PixelRatio, Dimensions, Platform } from "react-native";

const { height, width, scale } = Dimensions.get("window");

export const HEIGHT = height;
export const WIDTH = width;
export const IOS = Platform.OS === "ios";

export const Convert = dp => {
    if (width <= 350) {
        return dp * 0.8;
    }
    return dp * 0.93;
};

export const Styles = StyleSheet.create({
    flatListItem: {
        height: height >= 667 ? height * 0.08 : height * 0.1,
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "gray"
    },
    flatList: {
        // marginVertical: height * 0.01,
        marginVertical: 0
    },
    row: {
        flexDirection: "row"
    },
    scroll: {
        flexWrap: "wrap",
        alignItems: "flex-start",
        flexDirection: "row"
    }
})