import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ForwardArrowIcon } from "../../assets";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

const CreditFactorButton = ({ title, percent, buttonPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.buttonWrapper} onPress={buttonPress}>
                <View style={styles.buttonContentWrapper}>
                    <View>
                        <Text style={styles.titleText}>{title}</Text>
                        <Text style={styles.percentText}>{percent}</Text>
                    </View>
                    <ForwardArrowIcon width={4} height={11} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default CreditFactorButton;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: 20,
        paddingVertical: 4
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
        paddingVertical: 10,
        paddingRight: 12,
        paddingLeft: 16,
    },
    titleText: {
        fontSize: 12,
        fontFamily: Fonts.MontserratSBold
    },
    percentText: {
        fontSize: 16,
        fontFamily: Fonts.MontserratSBold,
        color: Colors.GoldYellowDark,
        marginTop: 4
    }
})