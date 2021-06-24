import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";


const SettingsButton = ({ text, buttonPress, Icon, iconStyle, disabled }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} disabled={disabled} onPress={buttonPress}>
                <View style={styles.iconWrapper}>
                    <Icon width={iconStyle.width} height={iconStyle.height} />
                </View>
                <Text style={styles.buttonText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SettingsButton;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 26,
        paddingVertical: IsTablet ? scaleToWidth(2.4) : scaleToWidth(3.2)
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        marginHorizontal: scaleToWidth(3.2),
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratMedium
    },
    iconWrapper: {
        width: 18,
        height: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
})