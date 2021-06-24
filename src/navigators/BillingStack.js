import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BillingHomeScreen from "../screens/BillingHomeScreen";
import MyPlanScreen from "../screens/MyPlanScreen";
import SubscriptionPlansScreen from "../screens/SubscriptionPlansScreen";
import PaymentsScreen from "../screens/PaymentsScreen";
import StripePurchaseScreen from "../screens/StripePurchaseScreen";

const Stack = createStackNavigator();

const BillingStack = () => {
    const options = { headerShown: false };
    return (
        <Stack.Navigator>
            <Stack.Screen name="BillingHome" component={BillingHomeScreen} options={options} />
            <Stack.Screen name="MyPlan" component={MyPlanScreen} options={options} />
            <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} options={options} />
            <Stack.Screen name="Payments" component={PaymentsScreen} options={options} />
            <Stack.Screen name="StripePurchase" component={StripePurchaseScreen} options={options} />
        </Stack.Navigator>
    );
}

export default BillingStack;