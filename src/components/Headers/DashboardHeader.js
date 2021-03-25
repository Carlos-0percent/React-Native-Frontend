import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NotificationIcon, SettingsIcon } from "../../assets";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

const DashboardHeader = ({ user, settingsPress, notificationPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.contentWrapper}>
                <Text style={styles.headerText1}>{"Hey, "}</Text>
                <Text style={styles.headerText2}>{user}</Text>
            </View>
            <View style={styles.contentWrapper}>
                <TouchableOpacity onPress={settingsPress}>
                    <SettingsIcon width={18} height={18} style={styles.settingsIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={notificationPress}>
                    <NotificationIcon width={18} height={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default DashboardHeader;

const styles = StyleSheet.create({
    container: {
        height: Platform.OS === "ios" ? 80 : 45,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        position: "absolute",
        top: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: Colors.White(1),
        zIndex: 9999
    },
    contentWrapper: {
        flexDirection: "row"
    },
    headerText1: {
        fontSize: 18,
        fontFamily: Fonts.MontserratLight
    },
    headerText2: {
        fontSize: 18,
        fontFamily: Fonts.MontserratBold
    },
    settingsIcon: {
        marginHorizontal: 17
    }
})