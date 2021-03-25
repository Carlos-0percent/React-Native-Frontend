import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { Platform } from "react-native";
import AppStack from "./src/navigators/AppStack";


const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}

const App = () => {
  return (
    <>
      <AppNavigator />
      <Toast ref={(ref) => Toast.setRef(ref)} position="top" topOffset={Platform.OS === "ios" ? 80 : 50} />
    </>
  );
};

export default App;
