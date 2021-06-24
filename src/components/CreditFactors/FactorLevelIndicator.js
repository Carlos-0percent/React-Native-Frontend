import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";

const FactorLevelIndicator = ({ level }) => {
    return (
        <View style={styles.container}>
            {!!level[0] ?
                <View style={styles.indicatorWrapper}>
                    <View style={styles.indicatorBar(Colors.CreditFactorRed)} />
                    <Text style={styles.indicatorText}>{level[0]}</Text>
                </View>
                : <></>}
            {!!level[1] ?
                <View style={styles.indicatorWrapper}>
                    <View style={styles.indicatorBar(Colors.CreditFactorOrange)} />
                    <Text style={styles.indicatorText}>{level[1]}</Text>
                </View>
                : <></>}
            {!!level[2] ?
                <View style={styles.indicatorWrapper}>
                    <View style={styles.indicatorBar(Colors.CreditFactorYellow)} />
                    <Text style={styles.indicatorText}>{level[2]}</Text>
                </View>
                : <></>}
            {!!level[3] ?
                <View style={styles.indicatorWrapper}>
                    <View style={styles.indicatorBar(Colors.CreditFactorLightGreen)} />
                    <Text style={styles.indicatorText}>{level[3]}</Text>
                </View>
                : <></>}
            {!!level[4] ?
                <View style={styles.indicatorWrapper}>
                    <View style={styles.indicatorBar(Colors.CreditFactorDarkGreen)} />
                    <Text style={styles.indicatorText}>{level[4]}</Text>
                </View>
                : <></>}
        </View>
    );
}

export default FactorLevelIndicator;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: IsTablet ? "auto" : "100%"
    },
    indicatorWrapper: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: scaleToWidth(0.8)
    },
    indicatorBar: (backgroundColor) => ({
        width: IsTablet ? 68.1 : 50,
        height: IsTablet ? 12.4 : 3,
        backgroundColor,
        borderRadius: IsTablet ? 28.6 : 22
    }),
    indicatorText: {
        fontSize: fontSize(12),
        fontFamily: Fonts.MontserratRegular,
        marginVertical: scaleToWidth(0.8)
    }
})