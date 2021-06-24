import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { IsIOS, IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";

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
        height: IsIOS ? 80 : 45,
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        position: "absolute",
        top: 0,
        backgroundColor: Colors.White(1),
        paddingVertical: 10,
        paddingHorizontal: scaleToWidth(4),
        zIndex: 9999
    },
    contentWrapper: {
        height: IsTablet ? "60%" : "40%",
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    headerText: {
        fontSize: fontSize(18),
        fontFamily: Fonts.MontserratMedium
    }
})