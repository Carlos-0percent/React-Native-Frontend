import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BackArrowIcon } from "../../assets";
import Colors from "../../constants/Colors";
import { IsIOS, IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize } from "../../helpers/ContentHelpers";

const Header = ({ title, backIconPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <TouchableOpacity onPress={backIconPress}>
                    <BackArrowIcon width={IsTablet ? 8 : 6} height={IsTablet ? 21 : 16} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>{title}</Text>
            </View>
        </View>
    );
}

export default Header;

const styles = StyleSheet.create({
    container: {
        height: IsIOS ? 80 : 45,
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        position: "absolute",
        top: 0,
        backgroundColor: Colors.White(1),
        paddingVertical: 10,
        zIndex: 9999
    },
    contentWrapper: {
        height: IsTablet ? "60%" : "40%",
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
    },
    headerText: {
        fontSize: fontSize(18),
        fontFamily: Fonts.MontserratMedium
    },
    backIcon: {
        marginHorizontal: 12
    }
})