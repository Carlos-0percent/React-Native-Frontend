import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NotificationIcon, SettingsIcon } from "../../assets";
import Colors from "../../constants/Colors";
import { IsIOS, IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";

const DashboardHeader = ({ user, settingsPress, notificationPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <Text style={styles.headerText1}>{"Hey, "}</Text>
                <Text style={styles.headerText2}>{user}</Text>
            </View>
            <View style={styles.contentWrapper}>
                <TouchableOpacity onPress={settingsPress}>
                    <SettingsIcon width={IsTablet ? 24 : 18} height={IsTablet ? 24 : 18} style={styles.settingsIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={notificationPress}>
                    <NotificationIcon width={IsTablet ? 24 : 18} height={IsTablet ? 24 : 18} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DashboardHeader;

const styles = StyleSheet.create({
    container: {
        height: IsIOS ? 80 : 45,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        position: "absolute",
        top: 0,
        paddingHorizontal: IsTablet ? scaleToWidth(2.8) : scaleToWidth(5),
        paddingVertical: scaleToWidth(2),
        backgroundColor: Colors.White(1),
        zIndex: 9999
    },
    contentWrapper: {
        flexDirection: "row"
    },
    headerText1: {
        fontSize: fontSize(18),
        fontFamily: Fonts.MontserratLight
    },
    headerText2: {
        fontSize: fontSize(18),
        fontFamily: Fonts.MontserratBold
    },
    settingsIcon: {
        marginHorizontal: scaleToWidth(4)
    }
})