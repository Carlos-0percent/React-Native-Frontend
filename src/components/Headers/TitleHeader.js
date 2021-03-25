import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

const TitleHeader = ({ title }) => {
    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <Text style={styles.headerText}>{title}</Text>
            </View>
        </View>
    );
}

export default TitleHeader;

const styles = StyleSheet.create({
    container: {
        height: Platform.OS === "ios" ? 80 : 45,
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        position: "absolute",
        top: 0,
        backgroundColor: Colors.White(1),
        paddingVertical: 10,
        paddingHorizontal: 20,
        zIndex: 9999
    },
    contentWrapper: {
        height: "40%",
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    headerText: {
        fontSize: 18,
        fontFamily: Fonts.MontserratMedium
    }
})