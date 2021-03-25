import React from "react";
import { Platform, StyleSheet, TouchableWithoutFeedback as NativeTouchableWithoutFeedback, View } from "react-native";
import { TouchableWithoutFeedback as GHTouchableWithoutFeedback } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";

const TouchableWithoutFeedback = Platform.OS === "ios" ? GHTouchableWithoutFeedback : NativeTouchableWithoutFeedback;

const RadioInput = ({ checked, radioPress }) => {
    return (
        <TouchableWithoutFeedback style={styles.container} onPress={radioPress}>
            <View style={styles.container}>
                {checked ? <View style={styles.innerCircle} /> : <></>}
            </View>
        </TouchableWithoutFeedback>
    );
}

export default RadioInput;

const styles = StyleSheet.create({
    container: {
        height: 14,
        width: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.Black(1),
        borderRadius: 50
    },
    innerCircle: {
        height: 10,
        width: 10,
        backgroundColor: Colors.BrownYellow,
        borderRadius: 50
    }
})