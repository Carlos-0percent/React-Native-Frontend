import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { DialerIcon, MailIcon } from "../assets";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";

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
            <View style={styles.pageContainer}>
                <Text style={styles.troubleText}>{"Having trouble? Reach us on"}</Text>
                <View style={styles.buttonsWrapper}>
                    <TouchableOpacity style={styles.button} onPress={() => copyToClipboard("Phone Number", "+198766543219")}>
                        <View style={styles.buttonIconWrapper}>
                            <DialerIcon width={16} height={16} />
                        </View>
                        <View style={styles.buttonTextWrapper}>
                            <Text style={styles.buttonText}>{"+1 98766543219"}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => copyToClipboard("Email Id", "help@gmail.com")}>
                        <View style={styles.buttonIconWrapper}>
                            <MailIcon width={16} height={16} />
                        </View>
                        <View style={styles.buttonTextWrapper}>
                            <Text style={styles.buttonText}>{"help@gmail.com"}</Text>
                        </View>
                    </TouchableOpacity>
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
    pageContainer: {
        top: Platform.OS === "ios" ? 80 : 45,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 80 : 45,
    },
    troubleText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratRegular,
        marginVertical: 10,
        marginHorizontal: 30
    },
    buttonsWrapper: {
        paddingVertical: 10,
        paddingHorizontal: 26
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10
    },
    buttonIconWrapper: {
        width: 20,
        height: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    buttonTextWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.Black(0.85),
        marginLeft: 10
    },
    buttonText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratMedium
    }
})