import React from "react";
import { StyleSheet, View } from "react-native";
import { CardFilledIcon, CardOutlineIcon, CashOutlineIcon } from "../assets";
import BillingButton from "../components/Buttons/BillingButton";
import TitleHeader from "../components/Headers/TitleHeader";
import Colors from "../constants/Colors";
import { IsIOS, IsTablet } from "../constants/Constants";
import { scaleToWidth } from "../helpers/ContentHelpers";

const BillingHomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <TitleHeader title="Billing" />
            <View style={styles.pageContent}>
                <BillingButton
                    title="My Plan"
                    Icon={CardOutlineIcon}
                    iconStyle={styles.iconStyle}
                    buttonPress={() => navigation.push("MyPlan")}
                />
                <BillingButton
                    title="Subscription Plans"
                    Icon={CardFilledIcon}
                    iconStyle={styles.iconStyle}
                    buttonPress={() => navigation.push("SubscriptionPlans")}
                />
                <BillingButton
                    title="Payments"
                    Icon={CashOutlineIcon}
                    iconStyle={styles.iconStyle}
                    buttonPress={() => navigation.push("Payments")}
                />
            </View>
        </View>
    );
}

export default BillingHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    pageContent: {
        top: IsIOS ? 80 : 45,
        paddingVertical: 10,
        paddingHorizontal: scaleToWidth(4)
    },
    iconStyle: {
        width: IsTablet ? 34 : 24,
        height: IsTablet ? 23 : 16
    }
})