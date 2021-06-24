import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ReportsHomeScreen from "../screens/ReportsHomeScreen";
import PaymentHistoryScreen from "../screens/PaymentHistoryScreen";

const Stack = createStackNavigator();

const ReportsStack = () => {
    const options = { headerShown: false };
    return (
        <Stack.Navigator>
            <Stack.Screen name="ReportsHome" component={ReportsHomeScreen} options={options} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={options} />
        </Stack.Navigator>
    );
}

export default ReportsStack;