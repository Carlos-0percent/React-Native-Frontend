import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ForwardArrowIcon } from "../../assets";
import Colors from "../../constants/Colors";
import { IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";

const CreditFactorButton = ({ title, percent, buttonPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={buttonPress}>
                <View style={styles.buttonContentWrapper}>
                    <View>
                        <Text style={styles.titleText}>{title}</Text>
                        <Text style={styles.percentText}>{percent}</Text>
                    </View>
                    <ForwardArrowIcon width={IsTablet ? 6 : 4} height={IsTablet ? 16 : 11} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default CreditFactorButton;

const styles = StyleSheet.create({
    container: {
        width: IsTablet ? "49%" : "100%",
        paddingVertical: scaleToWidth(0.8),
        paddingHorizontal: IsTablet ? scaleToWidth(1.4) : scaleToWidth(2.5),
    },
    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    buttonContentWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderWidth: 0.5,
        borderRadius: 7,
        paddingVertical: scaleToWidth(2.4),
        paddingRight: 12,
        paddingLeft: 16,
    },
    titleText: {
        fontSize: fontSize(12),
        fontFamily: Fonts.MontserratSBold
    },
    percentText: {
        fontSize: fontSize(16),
        fontFamily: Fonts.MontserratSBold,
        color: Colors.GoldYellowDark,
        marginTop: scaleToWidth(0.8)
    }
})