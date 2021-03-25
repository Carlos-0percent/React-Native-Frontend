import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardHomeScreen from "../screens/DashboardHomeScreen";
import CreditFactorsScreen from "../screens/CreditFactorsScreen";
import BrowseScreen from "../screens/BrowseScreen";
import VideoPlayScreen from "../screens/VideoPlayScreen";
import Sub850ChallangeScreen from "../screens/Sub850ChallangeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HelpScreen from "../screens/HelpScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import TermsAndConditionsScreen from "../screens/TermsAndConditionsScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";

const Stack = createStackNavigator();

const DashboardStack = () => {
    const options = { headerShown: false };
    return (
        <Stack.Navigator>
            <Stack.Screen name="DashboardHome" component={DashboardHomeScreen} options={options} />
            <Stack.Screen name="CreditFactors" component={CreditFactorsScreen} options={options} />
            <Stack.Screen name="Browse" component={BrowseScreen} options={options} />
            <Stack.Screen name="VideoPlay" component={VideoPlayScreen} options={options} />
            <Stack.Screen name="Sub850Challange" component={Sub850ChallangeScreen} options={options} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={options} />
            <Stack.Screen name="Help" component={HelpScreen} options={options} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={options} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={options} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={options} />
        </Stack.Navigator>
    );
}

export default DashboardStack;