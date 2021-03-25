import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BillingHomeScreen from "../screens/BillingHomeScreen";

const Stack = createStackNavigator();

const BillingStack = () => {
    const options = { headerShown: false };
    return (
        <Stack.Navigator>
            <Stack.Screen name="BillingHome" component={BillingHomeScreen} options={options} />
        </Stack.Navigator>
    );
}

export default BillingStack;