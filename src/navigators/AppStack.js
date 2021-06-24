import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import SetNewPasswordScreen from "../screens/SetNewPasswordScreen";
import CompleteProfileScreen from "../screens/CompleteProfileScreen";
import VerifyOTPScreen from "../screens/VerifyOTPScreen";
import InAppTab from "./InAppTab";
import TermsAndConditionsScreen from "../screens/TermsAndConditionsScreen";

const Stack = createStackNavigator();

const AppStack = () => {
    const options = { headerShown: false };
    return (
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={SplashScreen} options={options} />
            <Stack.Screen name="Signup" component={SignupScreen} options={options} />
            <Stack.Screen name="Login" component={LoginScreen} options={options} />
            <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={options} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={options} />
            <Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen} options={options} />
            <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={options} />
            <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} options={options} />
            <Stack.Screen name="InAppTab" component={InAppTab} options={options} />
        </Stack.Navigator>
    );
}

export default AppStack;