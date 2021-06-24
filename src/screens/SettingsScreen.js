import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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
import { IsIOS, IsTablet } from "../constants/Constants";
import Fonts from "../constants/Fonts";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";
import { UserActions } from "../redux/slices/UserSagaSlice";

const PageView = ({ content, contentContainerStyle, bounces, showsVerticalScrollIndicator }) => {
    if (IsTablet) {
        return (
            <View style={contentContainerStyle}>
                {content}
            </View>
        )
    } else {
        return (
            <ScrollView contentContainerStyle={contentContainerStyle} bounces={bounces} showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
                {content}
            </ScrollView>
        )
    }
}

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
                        <Text style={styles.logoutConfirmButtonText}>{"Are you sure you want to signout?"}</Text>
                        <View style={styles.logoutConfirmButtonsWrapper}>
                            <View style={styles.logoutCancelButtonWrapper}>
                                <SmallButton text="No" buttonPress={() => setLogoutModalVisible(false)} />
                            </View>
                            <View style={styles.logoutConfirmButtonWrapper}>
                                <BorderedSmallButton text="Yes" buttonPress={logout} />
                            </View>
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
            <PageView
                contentContainerStyle={IsTablet ? styles.pageContainer : styles.scrollContainer}
                bounces={false}
                showsVerticalScrollIndicator={false}
                content={
                    <>
                        <SettingsButton
                            text={"Change Password"}
                            Icon={LockIcon}
                            iconStyle={{ width: IsTablet ? 17 : 12, height: IsTablet ? 23 : 16 }}
                            buttonPress={() => navigation.push("ChangePassword")}
                        />
                        <SettingsButton
                            text={"Terms & Conditions"}
                            Icon={DocIcon}
                            iconStyle={{ width: IsTablet ? 19 : 13, height: IsTablet ? 23 : 16 }}
                            buttonPress={() => navigation.push("TermsAndConditions")}
                        />
                        <SettingsButton
                            text={"Privacy Policy"}
                            Icon={VaultIcon}
                            iconStyle={{ width: IsTablet ? 23 : 16, height: IsTablet ? 27 : 18 }}
                            buttonPress={() => navigation.push("PrivacyPolicy")}
                        />
                        <SettingsButton
                            text={"Help"}
                            Icon={HelpIcon}
                            iconStyle={{ width: IsTablet ? 27 : 18, height: IsTablet ? 27 : 18 }}
                            buttonPress={() => navigation.push("Help")}
                        />
                        <View style={styles.notifToggleWrapper}>
                            <SettingsButton
                                text={"Notifications"}
                                Icon={NotificationSettingsIcon}
                                iconStyle={{ width: IsTablet ? 23 : 16, height: IsTablet ? 27 : 18 }}
                                disabled={true}
                            />
                            <TouchableOpacity onPress={() => notificationsToggle(!notificationsOn)}>
                                {notificationsOn
                                    ? <SwitchOnIcon width={IsTablet ? 53 : 45} height={IsTablet ? 39 : 35} style={styles.switchOnIcon} />
                                    : <SwitchOffIcon width={IsTablet ? 53 : 45} height={IsTablet ? 39 : 35} style={styles.switchOffIcon} />}
                            </TouchableOpacity>
                        </View>
                        <SettingsButton
                            text={"Sign out"}
                            Icon={ExitIcon}
                            iconStyle={{ width: IsTablet ? 25 : 17, height: IsTablet ? 23 : 16 }}
                            buttonPress={() => setLogoutModalVisible(true)}
                        />
                    </>
                }
            />
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
    pageContainer: {
        flex: 1,
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(0)
    },
    scrollContainer: {
        top: IsIOS ? 80 : 45,
        paddingTop: 10,
        paddingBottom: IsIOS ? 80 : 45,
    },
    notifToggleWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: 26,
    },
    modalContentWrapper: {
        backgroundColor: Colors.White(1),
        width: IsTablet ? "50%" : "80%",
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
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratMedium,
        marginVertical: scaleToWidth(2)
    },
    logoutConfirmButtonsWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: scaleToWidth(2),
    },
    logoutConfirmButtonWrapper: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "45%",
    },
    logoutCancelButtonWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        width: "45%",
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