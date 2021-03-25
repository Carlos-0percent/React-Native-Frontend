import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity as NativeTouchableOpacity, View } from "react-native";
import { TouchableOpacity as GHTouchableOpacity } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

const TouchableOpacity = Platform.OS === "ios" ? GHTouchableOpacity : NativeTouchableOpacity;

const LongButton = ({ text, buttonPress, disabled }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity disabled={disabled} style={disabled ? styles.buttonDisabled : styles.button} onPress={buttonPress}>
                <Text style={styles.buttonText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default LongButton;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 30,
        paddingVertical: 4
    },
    button: {
        backgroundColor: Colors.Black(1),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        borderRadius: 7
    },
    buttonDisabled: {
        backgroundColor: Colors.Black(0.5),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        borderRadius: 7
    },
    buttonText: {
        fontSize: 12,
        color: Colors.White(1),
        fontFamily: Fonts.MontserratRegular
    }
})