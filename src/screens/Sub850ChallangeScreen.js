import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import { IsIOS } from "../constants/Constants";
import Fonts from "../constants/Fonts";
import { fontSize } from "../helpers/ContentHelpers";

const Sub850ChallangeScreen = ({ navigation }) => {
    const creditInfo = useSelector(state => state.credit.info);

    return (
        <View style={styles.container}>
            <Header title="Subscribe 850 Challenge" backIconPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
                <Text style={styles.pageContent}>{creditInfo.content}</Text>
            </ScrollView>
        </View>
    );
}

export default Sub850ChallangeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    scrollContainer: {
        paddingHorizontal: 30,
        top: IsIOS ? 80 : 45,
        paddingTop: 20,
        paddingBottom: IsIOS ? 80 : 45,
    },
    pageContent: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratRegular,
        lineHeight: 16.3
    }
})