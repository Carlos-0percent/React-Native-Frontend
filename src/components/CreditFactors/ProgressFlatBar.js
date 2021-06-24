import React from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";
import { IsTablet } from "../../constants/Constants";
import { scaleToWidth } from "../../helpers/ContentHelpers";

const ProgressFlatBar = ({ color, content, percent }) => {
    return (
        <View style={styles.container}>
            <View style={styles.percentWrapper}>{content}</View>
            <View style={styles.progressBlankSquare}>
                <View style={styles.progressColorSquare(percent, color)} />
            </View>
        </View>
    );
}

export default ProgressFlatBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: IsTablet ? "auto" : "100%",
        paddingVertical: 50,
        paddingHorizontal: scaleToWidth(5)
    },
    percentWrapper: {
        marginVertical: 6
    },
    progressBlankSquare: {
        position: "relative",
        width: IsTablet ? 176.7 : 97,
        height: IsTablet ? 8.1 : 4.6,
        backgroundColor: Colors.Black(0.11),
        borderRadius: IsTablet ? 33.8 : 33
    },
    progressColorSquare: (percent, backgroundColor) => ({
        position: "absolute",
        width: (percent / 100) * IsTablet ? 176.7 : 97,
        height: IsTablet ? 8.1 : 4.6,
        backgroundColor,
        borderRadius: IsTablet ? 33.8 : 33,
        left: 0,
        top: 0,
    })
})