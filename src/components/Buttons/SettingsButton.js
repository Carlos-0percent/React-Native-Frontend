import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Fonts from "../../constants/Fonts";


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
        paddingVertical: 10.5
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttonText: {
        marginHorizontal: 13.5,
        fontSize: 14,
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