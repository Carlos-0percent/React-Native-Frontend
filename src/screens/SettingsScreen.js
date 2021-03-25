import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { DocIcon, ExitIcon, HelpIcon, LockIcon, NotificationSettingsIcon, SwitchOffIcon, SwitchOnIcon, VaultIcon } from "../assets";
import BorderedSmallButton from "../components/Buttons/BorderedSmallButton";
import SettingsButton from "../components/Buttons/SettingsButton";
import SmallButton from "../components/Buttons/SmallButton";
import Header from "../components/Headers/Header";
import CustomModal from "../components/Modals/CustomModal";
import LoaderModal from "../components/Modals/LoaderModal";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { UserActions } from "../redux/slices/UserSagaSlice";

const SettingsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const userData = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [notificationsOn, setNotificationsOn] = useState(1);

    useFocusEffect(
        useCallback(() => {
            if (userData) {
                setNotificationsOn(userData.notification);
            }
        }, [JSON.stringify(userData)])
    )

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        dispatch(UserActions.logoutUser());
        setLogoutModalVisible(false);
        navigation.push("Login");
    }

    const renderLogoutModal = () => {
        return (
            <CustomModal
                visible={logoutModalVisible}
                contentView={
                    <View style={styles.modalContentWrapper}>
                        <Text style={styles.logoutConfirmButtonText}>{"Are you sure you want to logout?"}</Text>
                        <View style={styles.logoutConfirmButtonWrapper}>
                            <SmallButton text="No" buttonPress={() => setLogoutModalVisible(false)} />
                            <BorderedSmallButton text="Yes" buttonPress={logout} />
                        </View>
                    </View>
                }
                animation="slide"
            />
        )
    }

    const switchNotifications = (notification) => {
        const user = {
            "notification": notification
        }

        new Promise((resolve, reject) => {
            dispatch(UserActions.notificationsToggle({ resolve, reject, user, token: userToken }))
        })
            .then(res => {
                if (res) {
                    setTimeout(() => {
                        new Promise((resolve, reject) => {
                            dispatch(UserActions.fetchUser({ resolve, reject, token: userToken }))
                        })
                            .then(res => {
                                setLoading(false);
                                if (res.notification) {
                                    Toast.show({
                                        type: "success",
                                        text1: "Notifications turned on",
                                        autoHide: true,
                                        visibilityTime: 1000
                                    })
                                } else {
                                    Toast.show({
                                        type: "info",
                                        text1: "Notifications turned off",
                                        autoHide: true,
                                        visibilityTime: 1000
                                    })
                                }
                            })
                            .catch(err => {
                                setLoading(false);
                                console.warn("Error while fetching user details ---->", err);
                            })
                    }, 2000);
                }
            })
            .catch(err => {
                console.warn("Error while toggling notifications ---->", err);
            })
    }

    const notificationsToggle = (toggle) => {
        const value = toggle ? 1 : 0;
        setLoading(true);
        switchNotifications(value);
    }

    const renderLoaderModal = () => {
        return (
            <LoaderModal
                visible={loading}
                contentView={
                    <ActivityIndicator size="large" color={Colors.BrownYellow} />
                }
                animation="slide"
            />
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Settings" backIconPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
                <SettingsButton
                    text={"Change Password"}
                    Icon={LockIcon}
                    iconStyle={{ width: 12, height: 16 }}
                    buttonPress={() => navigation.push("ChangePassword")}
                />
                <SettingsButton
                    text={"Terms & Conditions"}
                    Icon={DocIcon}
                    iconStyle={{ width: 13, height: 16 }}
                    buttonPress={() => navigation.push("TermsAndConditions")}
                />
                <SettingsButton
                    text={"Privacy Policy"}
                    Icon={VaultIcon}
                    iconStyle={{ width: 16, height: 18 }}
                    buttonPress={() => navigation.push("PrivacyPolicy")}
                />
                <SettingsButton
                    text={"Help"}
                    Icon={HelpIcon}
                    iconStyle={{ width: 18, height: 18 }}
                    buttonPress={() => navigation.push("Help")}
                />
                <View style={styles.notifToggleWrapper}>
                    <SettingsButton
                        text={"Notifications"}
                        Icon={NotificationSettingsIcon}
                        iconStyle={{ width: 16, height: 18 }}
                        disabled={true}
                    />
                    <TouchableOpacity onPress={() => notificationsToggle(!notificationsOn)}>
                        {notificationsOn
                            ? <SwitchOnIcon width={45} height={35} style={styles.switchOnIcon} />
                            : <SwitchOffIcon width={45} height={35} style={styles.switchOffIcon} />}
                    </TouchableOpacity>
                </View>
                <SettingsButton
                    text={"Sign out"}
                    Icon={ExitIcon}
                    iconStyle={{ width: 17, height: 16 }}
                    buttonPress={() => setLogoutModalVisible(true)}
                />
            </ScrollView>
            {renderLogoutModal()}
            {renderLoaderModal()}
        </View>
    );
}

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    scrollContainer: {
        top: Platform.OS === "ios" ? 80 : 45,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 80 : 45,
    },
    notifToggleWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: 26,
    },
    modalContentWrapper: {
        backgroundColor: Colors.White(1),
        width: "80%",
        borderWidth: 0.5,
        borderColor: Colors.Black(1),
        borderRadius: 7,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        shadowColor: Colors.Black(0.11),
        shadowOffset: {
            width: 11,
            height: 11
        },
        shadowRadius: 33,
        shadowOpacity: 1,
        elevation: 5
    },
    logoutConfirmButtonText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratMedium,
        marginVertical: 10
    },
    logoutConfirmButtonWrapper: {
        flexDirection: "row",
        width: "80%",
        justifyContent: "space-around",
        paddingVertical: 10
    },
    switchOnIcon: {
        marginLeft: 5,
        marginTop: 5,
    },
    switchOffIcon: {
        marginRight: 5,
        marginBottom: 5,
        transform: [
            { rotateZ: "180deg" }
        ]
    }
})