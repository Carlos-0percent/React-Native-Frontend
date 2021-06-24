import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ForwardArrowIcon } from "../../assets";
import Colors from "../../constants/Colors";
import { IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";

const BillingButton = ({ title, Icon, iconStyle, buttonPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={buttonPress}>
                <View style={styles.buttonContentWrapper}>
                    <View style={styles.titleWrapper}>
                        <Icon width={iconStyle.width} height={iconStyle.height} />
                        <Text style={styles.titleText}>{title}</Text>
                    </View>
                    <ForwardArrowIcon width={IsTablet ? 6 : 4} height={IsTablet ? 16 : 11} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default BillingButton;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: scaleToWidth(0.8)
    },
    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingVertical: 1
    },
    buttonContentWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderWidth: 0.5,
        borderRadius: 7,
        borderColor: Colors.Black(0.65),
        paddingVertical: IsTablet ? scaleToWidth(2.8) : scaleToWidth(4),
        paddingRight: 12,
        paddingLeft: 16,
    },
    titleWrapper: {
        flexDirection: "row",
    },
    titleText: {
        fontSize: fontSize(12),
        fontFamily: Fonts.MontserratSBold,
        marginLeft: scaleToWidth(3.2)
    },
})