import "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Toast, { BaseToast } from "react-native-toast-message";
import messaging from "@react-native-firebase/messaging";
import AppStack from "./src/navigators/AppStack";
import { IsIOS, IsTablet } from "./src/constants/Constants";
import Colors from "./src/constants/Colors";
import { fontSize, scaleToWidth } from "./src/helpers/ContentHelpers";
import Fonts from "./src/constants/Fonts";
import { BackHandler, StyleSheet, ToastAndroid } from "react-native";

messaging().setBackgroundMessageHandler(remoteMessage => {
  const { notification } = remoteMessage;
  Toast.show({
    type: "info",
    text1: notification.title,
    text2: notification.body,
    autoHide: true,
    visibilityTime: 5000
  })
});

const AppNavigator = () => {
  const backPressRef = useRef(0);

  useEffect(() => {
    const unsubscribeRemoteMessage = messaging().onMessage(remoteMessage => {
      const { notification } = remoteMessage;
      Toast.show({
        type: "info",
        text1: notification.title,
        text2: notification.body,
        autoHide: true,
        visibilityTime: 5000
      })
    });
    return unsubscribeRemoteMessage;
  }, [])

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (backPressRef.current === 0) {
        backPressRef.current = 1;
        ToastAndroid.show("Press back again to exit the app", 2000);
        setTimeout(() => {
          backPressRef.current = 0;
        }, 5000);
      } else if (backPressRef.current === 1) {
        BackHandler.exitApp();
      }
      return true;
    })
    return () => backHandler.remove();
  }, [])

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
}

const toastColor = (type) => {
  let color = "";
  switch (type) {
    case "success":
      color = Colors.CreditFactorLightGreen;
      break;
    case "error":
      color = Colors.CreditFactorRed;
      break;
    case "info":
      color = Colors.CreditBlue;
      break;
    default:
      color = Colors.CreditBlue;
      break;
  }

  return color;
}

const toastConfig = {
  success: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={styles.toastStyle(toastColor("success"))}
      contentContainerStyle={styles.toastContainer}
      text1Style={styles.toastText1}
      text2Style={styles.toastText2}
      text1={text1}
      text2={text2}
    />
  ),
  error: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={styles.toastStyle(toastColor("error"))}
      contentContainerStyle={styles.toastContainer}
      text1Style={styles.toastText1}
      text2Style={styles.toastText2}
      text1={text1}
      text2={text2}
    />
  ),
  info: ({ text1, text2, ...rest }) => (
    <BaseToast
      {...rest}
      style={styles.toastStyle(toastColor("info"))}
      contentContainerStyle={styles.toastContainer}
      text1Style={styles.toastText1}
      text2Style={styles.toastText2}
      text1={text1}
      text2={text2}
    />
  )
};

const App = () => {
  return (
    <>
      <AppNavigator />
      <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} position="top" topOffset={IsIOS ? 80 : 50} />
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  toastStyle: (borderLeftColor) => ({
    borderLeftColor,
    height: IsTablet ? 100 : 60,
    width: IsTablet ? "60%" : "80%",
  }),
  toastContainer: {
    paddingHorizontal: IsTablet ? scaleToWidth(4) : scaleToWidth(6),
    paddingVertical: scaleToWidth(2),
  },
  toastText1: {
    fontSize: fontSize(14),
    fontFamily: Fonts.MontserratSBold
  },
  toastText2: {
    fontSize: fontSize(12),
    fontFamily: Fonts.MontserratMedium
  }
})
