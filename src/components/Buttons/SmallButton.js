import React from "react";
import { StyleSheet, Text, TouchableOpacity as NativeTouchableOpacity, View } from "react-native";
import { TouchableOpacity as GHTouchableOpacity } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import { IsIOS, IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize } from "../../helpers/ContentHelpers";

const TouchableOpacity = IsIOS ? GHTouchableOpacity : NativeTouchableOpacity;

const SmallButton = ({ text, buttonPress, disabled }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity disabled={disabled} style={disabled ? styles.buttonDisabled : styles.button} onPress={buttonPress}>
                <Text style={styles.buttonText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SmallButton;

const styles = StyleSheet.create({
    container: {
        width: "70%"
    },
    button: {
        backgroundColor: Colors.Black(1),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: IsTablet ? 55.3 : 45,
        borderRadius: 7
    },
    buttonDisabled: {
        backgroundColor: Colors.Black(0.5),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: IsTablet ? 55.3 : 45,
        borderRadius: 7
    },
    buttonText: {
        fontSize: fontSize(12),
        color: Colors.White(1),
        fontFamily: Fonts.PoppinsRegular
    }
})