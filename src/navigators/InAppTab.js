import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardStack from "./DashboardStack";
import ReportsStack from "./ReportsStack";
import ProfileStack from "./ProfileStack";
import BillingStack from "./BillingStack";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { BillingFilledIcon, BillingIcon, DashboardFilledIcon, DashboardIcon, ProfileFilledIcon, ProfileIcon, ReportsFilledIcon, ReportsIcon } from "../assets";
import { fontSize } from "../helpers/ContentHelpers";
import { IsTablet } from "../constants/Constants";

const Tab = createBottomTabNavigator();

const InAppTab = () => {
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let icon;

      if (route.name === "Dashboard") {
        icon = focused
          ? <DashboardFilledIcon width={IsTablet ? 26 : 15} height={IsTablet ? 26 : 15} />
          : <DashboardIcon width={IsTablet ? 35 : 23} height={IsTablet ? 35 : 22} />;
      }
      if (route.name === "Reports") {
        icon = focused
          ? <ReportsFilledIcon width={IsTablet ? 26 : 16} height={IsTablet ? 26 : 15} />
          : <ReportsIcon width={IsTablet ? 35 : 23} height={IsTablet ? 35 : 22} />;
      }
      if (route.name === "Profile") {
        icon = focused
          ? <ProfileFilledIcon width={IsTablet ? 23 : 14} height={IsTablet ? 26 : 15} />
          : <ProfileIcon width={IsTablet ? 32 : 20} height={IsTablet ? 35 : 22} />;
      }
      if (route.name === "Billing") {
        icon = focused
          ? <BillingFilledIcon width={IsTablet ? 20 : 13} height={IsTablet ? 26 : 15} />
          : <BillingIcon width={IsTablet ? 27 : 18} height={IsTablet ? 35 : 22} />;
      }

      return icon;
    }
  })

  const tabBarOptions = {
    style: { backgroundColor: Colors.Black(1) },
    labelStyle: { fontFamily: Fonts.MontserratRegular, fontSize: fontSize(11) },
    activeTintColor: Colors.White(1),
    inactiveTintColor: "transparent"
  }

  return (
    <Tab.Navigator screenOptions={screenOptions} tabBarOptions={tabBarOptions}>
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Reports" component={ReportsStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
      <Tab.Screen name="Billing" component={BillingStack} />
    </Tab.Navigator>
  );
}

export default InAppTab;