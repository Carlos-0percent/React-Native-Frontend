import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileHomeScreen from "../screens/ProfileHomeScreen";
import EditProfileScreen from "../screens/EditProfileScreen";

const Stack = createStackNavigator();

const ProfileStack = () => {
    const options = { headerShown: false };
    return (
        <Stack.Navigator>
            <Stack.Screen name="ProfileHome" component={ProfileHomeScreen} options={options} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={options} />
        </Stack.Navigator>
    );
}

export default ProfileStack;