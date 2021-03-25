import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ReportsHomeScreen from "../screens/ReportsHomeScreen";

const Stack = createStackNavigator();

const ReportsStack = () => {
    const options = { headerShown: false };
    return (
        <Stack.Navigator>
            <Stack.Screen name="ReportsHome" component={ReportsHomeScreen} options={options} />
        </Stack.Navigator>
    );
}

export default ReportsStack;