import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import _ from "lodash";
import OTPTextInput from "react-native-otp-textinput";
import { useDispatch, useSelector } from "react-redux";
import LongButton from "../components/Buttons/LongButton";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { UserActions } from "../redux/slices/UserSagaSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderModal from "../components/Modals/LoaderModal";
import Toast from "react-native-toast-message";
import { CreditActions } from "../redux/slices/CreditSagaSlice";
import { hideDigits } from "../helpers/ContentHelpers";

const VerifyOTPScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const [loading, setLoading] = useState(false);
    const userPhone = useSelector(state => state.user.data.phone_number);
    const [verifyButtonDisable, setVerifyButtonDisable] = useState(true);
    const [resendDisable, setResendDisable] = useState(true);
    const [otp, setOTP] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [timer, setTimer] = useState(30);
    const timerRef = useRef(timer);

    const sendOTP = () => {
        new Promise((resolve, reject) => {
            dispatch(UserActions.sendOTP({ token: userToken, resolve, reject }));
        })
            .then(res => {
                Toast.show({
                    type: "success",
                    text1: "PIN sent successfully!",
                    text2: "Check your messages",
                    autoHide: true,
                    visibilityTime: 2000
                })
                if (res) {
                    console.info(res); // to be removed, for dev purpose only
                }
            })
            .catch(err => {
                console.warn("Error while sending OTP ---->", err);
            })
    }

    const verifyOTP = () => {
        const user = {
            "otp": otp
        }
        new Promise((resolve, reject) => {
            setLoading(true);
            dispatch(UserActions.verifyOTP({ user, token: userToken, resolve, reject }));
        })
            .then(res => {
                if (res) {
                    new Promise((resolve, reject) => {
                        dispatch(UserActions.fetchUser({ token: userToken, resolve, reject }));
                    })
                        .then(res => {
                            setLoading(false);
                            if (res.email) {
                                Toast.show({
                                    type: "success",
                                    text1: "Registration completed!",
                                    text2: "Logging you in wait ...",
                                    autoHide: true,
                                    visibilityTime: 5000
                                })
                                setTimeout(() => {
                                    new Promise((resolve, reject) => {
                                        dispatch(UserActions.fetchUser({ token: userToken, resolve, reject }));
                                        dispatch(CreditActions.fetchCreditScore({ token: userToken, resolve, reject }));
                                    })
                                }, 3000);
                                setTimeout(() => {
                                    navigation.push("InAppTab");
                                }, 5000);
                            }
                        })
                        .catch(err => {
                            setLoading(false);
                            console.warn("Error while fetching user details ---->", err);
                        })
                }
            })
            .catch(err => {
                console.warn("Error while verifying OTP ---->", err);
                setLoading(false);
            })
    }

    useEffect(() => {
        numberShow();
    }, [userPhone])

    useEffect(() => {
        sendOTP();
    }, [])

    useEffect(() => {
        if (otp.length === 4) {
            if (verifyButtonDisable) {
                setVerifyButtonDisable(false);
            }
        } else {
            if (!verifyButtonDisable) {
                setVerifyButtonDisable(true);
            }
        }
    }, [otp])

    useEffect(() => {
        let timerInterval = null;
        if (resendDisable && timerRef.current === 30) {
            timerInterval = setInterval(() => {
                if (timerRef.current > 0) {
                    timerRef.current = timerRef.current - 1;
                    setTimer(timerRef.current);
                }
                if (timerRef.current === 0) {
                    setResendDisable(false);
                }
            }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [resendDisable])

    const resendCode = () => {
        if (!resendDisable) {
            sendOTP();
            setResendDisable(true);
            timerRef.current = 30;
            setTimer(timerRef.current);
        }
        return true;
    }

    const numberShow = () => {
        setPhoneNum(hideDigits(3, userPhone));
        return true;
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

    const backAction = async () => {
        await AsyncStorage.removeItem("token");
        dispatch(UserActions.logoutUser());
        navigation.push("Login");
    }

    return (
        <View style={styles.container}>
            <Header title="Verify Your Account" backIconPress={backAction} />
            <View style={styles.hintTextWrapper}>
                <Text style={styles.hintText}>{"We have sent PIN to verify your\nphone number\nending with " + phoneNum}</Text>
            </View>
            <View style={styles.otpInputWrapper}>
                <OTPTextInput
                    autoFocus
                    tintColor={Colors.Black(1)}
                    offTintColor={Colors.Black(1)}
                    textInputStyle={styles.otpInput}
                    keyboardType="numeric"
                    secureTextEntry={true}
                    handleTextChange={value => setOTP(value)}
                />
            </View>
            <LongButton text="Verify & Proceed" disabled={verifyButtonDisable} buttonPress={verifyOTP} />
            <Text style={resendDisable ? styles.resendCodeDisabled : styles.resendCode} onPress={resendCode}>{"Resend the code"}</Text>
            <Text style={styles.timerText}>{timer.toString().length === 1 ? `00:0${timer}` : `00:${timer}`}</Text>
            {renderLoaderModal()}
        </View>
    );
}

export default VerifyOTPScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    otpInput: {
        borderBottomWidth: 1,
        fontFamily: Fonts.MontserratRegular,
        fontSize: 14
    },
    hintTextWrapper: {
        width: "100%",
        paddingHorizontal: 30,
        flexDirection: "row",
        justifyContent: "center"
    },
    hintText: {
        width: "80%",
        fontSize: 14,
        fontFamily: Fonts.MontserratMedium,
        textAlign: "center",
        lineHeight: 17.5
    },
    resendCode: {
        fontSize: 14,
        color: Colors.Blue,
        fontFamily: Fonts.MontserratSBold,
        marginTop: 10
    },
    resendCodeDisabled: {
        fontSize: 14,
        color: Colors.BlueFaded,
        fontFamily: Fonts.MontserratSBold,
        marginTop: 10
    },
    timerText: {
        fontSize: 11,
        fontFamily: Fonts.MontserratRegular,
        marginVertical: 4
    },
    otpInputWrapper: {
        marginVertical: 20
    }
})