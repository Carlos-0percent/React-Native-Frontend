import React from "react";
import { StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { GreenCheckIcon } from "../../assets";
import Colors from "../../constants/Colors";

const Checkbox = ({ checked, checkboxPress }) => {
    return (
        <TouchableWithoutFeedback style={styles.container} onPress={checkboxPress}>
            {checked ? <GreenCheckIcon width={16} height={12} /> : <></>}
        </TouchableWithoutFeedback>
    );
}

export default Checkbox;

const styles = StyleSheet.create({
    container: {
        height: 19,
        width: 19,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: Colors.Black(1)
    }
})