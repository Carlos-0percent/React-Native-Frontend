import React from "react";
import { StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";

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
        width: "100%",
        paddingVertical: 50
    },
    percentWrapper: {
        marginVertical: 6
    },
    progressBlankSquare: {
        position: "relative",
        width: 97,
        height: 4.6,
        backgroundColor: Colors.Black(0.11),
        borderRadius: 33
    },
    progressColorSquare: (percent, backgroundColor) => ({
        position: "absolute",
        width: (percent / 100) * 97,
        height: 4.6,
        backgroundColor,
        borderRadius: 33,
        left: 0,
        top: 0,
    })
})