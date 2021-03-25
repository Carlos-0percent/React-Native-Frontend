import React, { useState } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import _ from "lodash";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import PaymentHistoryScreen from "./CreditFactors/PaymentHistoryScreen";
import UtilizationHistoryScreen from "./CreditFactors/UtilizationHistoryScreen";
import AgeOfCreditScreen from "./CreditFactors/AgeOfCreditScreen";
import TotalAccountsMixScreen from "./CreditFactors/TotalAccountsMixScreen";
import NewInquiriesScreen from "./CreditFactors/NewInquiriesScreen";

const PaymentHistory = ({ navigation }) => <PaymentHistoryScreen navigation={navigation} />;
const UtilizationHistory = ({ navigation }) => <UtilizationHistoryScreen navigation={navigation} />;
const AgeOfCredit = ({ navigation }) => <AgeOfCreditScreen navigation={navigation} />;
const TotalAccountMix = ({ navigation }) => <TotalAccountsMixScreen navigation={navigation} />;
const NewInquiries = ({ navigation }) => <NewInquiriesScreen navigation={navigation} />;

const CreditFactorsScreen = ({ navigation }) => {
    const [index, setIndex] = useState(navigation.dangerouslyGetState().routes[1].params["tabOn"]);
    const [routes] = useState([
        { key: "PaymentHistory", title: "Payment History" },
        { key: "UtilizationHistory", title: "Utilization History" },
        { key: "AgeOfCredit", title: "Age of credit" },
        { key: "TotalAccountMix", title: "Total Account Mix" },
        { key: "NewInquiries", title: "New Inquiries" },
    ])

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case "PaymentHistory":
                return <PaymentHistory navigation={navigation} jumpTo={jumpTo} />;
            case "UtilizationHistory":
                return <UtilizationHistory navigation={navigation} jumpTo={jumpTo} />;
            case "AgeOfCredit":
                return <AgeOfCredit navigation={navigation} jumpTo={jumpTo} />;
            case "TotalAccountMix":
                return <TotalAccountMix navigation={navigation} jumpTo={jumpTo} />;
            case "NewInquiries":
                return <NewInquiries navigation={navigation} jumpTo={jumpTo} />;
            default:
                return null;
        }
    }

    const renderTabBar = (props) => (
        <TabBar
            {...props}
            indicatorStyle={styles.tabIndicator}
            style={styles.tabBar}
            renderLabel={({ route, focused, color }) => (
                <View style={styles.tabLabelWrapper}>
                    <Text numberOfLines={1} style={styles.tabLabelText(color, focused)}>
                        {_.capitalize(route.title) + " "}
                    </Text>
                </View>
            )}
            activeColor={Colors.Black(1)}
            inactiveColor={Colors.Black(1)}
            scrollEnabled
            tabStyle={styles.tabView}
        />
    );

    return (
        <View style={styles.container}>
            <Header title="Credit Factors" backIconPress={() => navigation.goBack()} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get("screen").width }}
            />
        </View>
    );
}

export default CreditFactorsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative",
        paddingTop: Platform.OS === "ios" ? 80 : 45
    },
    tabLabelWrapper: {
        width: 140,
        alignItems: "center"
    },
    tabLabelText: (color, focused) => ({
        color, 
        fontSize: 12, 
        fontFamily: focused ? Fonts.MontserratSBold : Fonts.MontserratRegular, 
        overflow: "visible"
    }),
    tabIndicator: {
        backgroundColor: Colors.Black(0)
    },
    tabBar: {
        backgroundColor: Colors.White(1)
    },
    tabView: {
        width: 150
    }
})