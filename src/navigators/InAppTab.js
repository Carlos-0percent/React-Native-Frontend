import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardStack from "./DashboardStack";
import ReportsStack from "./ReportsStack";
import ProfileStack from "./ProfileStack";
import BillingStack from "./BillingStack";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { BillingFilledIcon, BillingIcon, DashboardFilledIcon, DashboardIcon, ProfileFilledIcon, ProfileIcon, ReportsFilledIcon, ReportsIcon } from "../assets";

const Tab = createBottomTabNavigator();

const InAppTab = () => {
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let icon;

      if (route.name === "Dashboard") {
        icon = focused
          ? <DashboardFilledIcon width={15} height={15} />
          : <DashboardIcon width={23} height={22} />;
      }
      if (route.name === "Reports") {
        icon = focused
          ? <ReportsFilledIcon width={16} height={15} />
          : <ReportsIcon width={23} height={22} />;
      }
      if (route.name === "Profile") {
        icon = focused
          ? <ProfileFilledIcon width={14} height={15} />
          : <ProfileIcon width={20} height={22} />;
      }
      if (route.name === "Billing") {
        icon = focused
          ? <BillingFilledIcon width={13} height={15} />
          : <BillingIcon width={18} height={22} />;
      }

      return icon;
    }
  })

  const tabBarOptions = {
    style: { backgroundColor: Colors.Black(1) },
    labelStyle: { fontFamily: Fonts.MontserratRegular, fontSize: 11 },
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