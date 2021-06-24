import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { DialerIcon, MailIcon } from "../assets";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import { IsIOS, IsTablet } from "../constants/Constants";
import Fonts from "../constants/Fonts";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";

const HelpScreen = ({ navigation }) => {
    const copyToClipboard = (dataType, string) => {
        Clipboard.setString(string);
        Toast.show({
            type: "success",
            text1: `Copied ${dataType}`,
            text2: string,
            autoHide: true,
            visibilityTime: 5000
        })
    }

    return (
        <View style={styles.container}>
            <Header title="Help" backIconPress={() => navigation.goBack()} />
            <View style={IsTablet ? styles.tabletContainer : styles.pageContainer}>
                <View>
                    <Text style={styles.troubleText}>{"Having trouble? Reach us on"}</Text>
                    <View style={styles.buttonsWrapper}>
                        <TouchableOpacity style={styles.button} onPress={() => copyToClipboard("Phone Number", "+198766543219")}>
                            <View style={styles.buttonIconWrapper}>
                                <DialerIcon width={IsTablet ? 23 : 16} height={IsTablet ? 23 : 16} />
                            </View>
                            <View style={styles.buttonTextWrapper}>
                                <Text style={styles.buttonText}>{"+1 98766543219"}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => copyToClipboard("Email Id", "help@gmail.com")}>
                            <View style={styles.buttonIconWrapper}>
                                <MailIcon width={IsTablet ? 23 : 16} height={IsTablet ? 23 : 16} />
                            </View>
                            <View style={styles.buttonTextWrapper}>
                                <Text style={styles.buttonText}>{"help@gmail.com"}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default HelpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    tabletContainer: {
        flex: 1,
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    pageContainer: {
        top: IsIOS ? 80 : 45,
        paddingTop: 10,
        paddingBottom: IsIOS ? 80 : 45,
    },
    troubleText: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratRegular,
        marginVertical: scaleToWidth(2),
        marginHorizontal: scaleToWidth(7)
    },
    buttonsWrapper: {
        paddingVertical: scaleToWidth(1),
        paddingHorizontal: scaleToWidth(7)
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: IsTablet ? scaleToWidth(1.8) : scaleToWidth(2.8)
    },
    buttonIconWrapper: {
        width: IsTablet ? 24 : 20,
        height: IsTablet ? 24 : 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonTextWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.Black(0.85),
        marginLeft: scaleToWidth(2.4)
    },
    buttonText: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratMedium
    }
})