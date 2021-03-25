import { useNavigationState } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import OTPTextInput from "react-native-otp-textinput";
import { useDispatch } from "react-redux";
import LongButton from "../components/Buttons/LongButton";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { UserActions } from "../redux/slices/UserSagaSlice";
import Toast from "react-native-toast-message";

const floatingCustomLabel = {
    colorBlurred: Colors.Black(1),
    colorFocused: Colors.Black(1)
}

const SetNewPasswordScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [verifyButtonDisable, setVerifyButtonDisable] = useState(true);
    const [resendDisable, setResendDisable] = useState(true);
    const [otp, setOTP] = useState("");
    const routesCount = useNavigationState(state => state.routes.length);
    const email = useNavigationState(state => state.routes && state.routes[routesCount - 1] && state.routes[routesCount - 1].params ? state.routes[routesCount - 1].params.email : "")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otpErr, setOtpErr] = useState(false);
    const [otpErrText, setOtpErrText] = useState("");
    const [pwdErr, setPwdErr] = useState(false);
    const [pwdErrText, setPwdErrText] = useState("");
    const [confirmPwdErr, setConfirmPwdErr] = useState(false);
    const [confirmPwdErrText, setConfirmPwdErrText] = useState("");
    const [timer, setTimer] = useState(30);
    const timerRef = useRef(timer);

    const handlePwd = (pwd) => {
        setPassword(pwd);
        if (pwd.toString().length >= 8 || pwd === "") {
            if (pwdErr) {
                setPwdErr(false);
            }
        } else {
            setPwdErr(true);
            setPwdErrText("Minimum 8 characters");
        }
        if (confirmPassword) {
            handleConfirmPwd(confirmPassword);
        }
        return true;
    }

    const handleConfirmPwd = (pwd) => {
        setConfirmPassword(pwd);
        if (pwd.toString() === password || pwd === "") {
            if (confirmPwdErr) {
                setConfirmPwdErr(false);
            }
        } else {
            setConfirmPwdErr(true);
            setConfirmPwdErrText("Password do not match");
        }
        return true;
    }

    const sendOTP = () => {
        const user = {
            "email": email
        }
        new Promise((resolve, reject) => {
            dispatch(UserActions.sendEmailOTP({ user, resolve, reject }));
        })
            .then(res => {
                Toast.show({
                    type: "success",
                    text1: "PIN sent successfully!",
                    text2: "Check your inbox",
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

    const saveNewPassword = () => {
        const user = {
            "email": email,
            "otp": otp,
            "password": password,
            "confirm_password": confirmPassword
        }
        new Promise((resolve, reject) => {
            dispatch(UserActions.resetPassword({ user, resolve, reject }));
        })
            .then(res => {
                if (res) {
                    navigation.push("Login");
                }
            })
            .catch(err => {
                console.warn("Error while saving new password ---->", err);
                if (err.message === "Please enter a valid password!") {
                    setPwdErr(true);
                    setPwdErrText("Password must contain atleast 1 uppercase letter, 1 number, 1 special character")
                }
                if (err.message === "Please enter a valid OTP!") {
                    setOtpErr(true);
                    setOtpErrText("Incorrect OTP");
                }
                if (err.message === "OTP has been expired, please resend it and try again!") {
                    setOtpErr(true);
                    setOtpErrText("OTP expired, try to resend");
                    timerRef.current = 0;
                    setTimer(timerRef.current);
                    setResendDisable(false);
                }
            })
    }

    useEffect(() => {
        if (otp.length === 4 && password && confirmPassword && !pwdErr && !confirmPwdErr && !otpErr) {
            if (verifyButtonDisable) {
                setVerifyButtonDisable(false);
            }
        } else {
            if (!verifyButtonDisable) {
                setVerifyButtonDisable(true);
            }
        }
    }, [otp, password, confirmPassword, pwdErr, confirmPwdErr, otpErr])

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

    const handleOTP = (otp) => {
        setOTP(otp);
        if (otpErr) {
            setOtpErr(false);
        }
    }

    const backAction = () => {
        navigation.push("ForgotPassword");
    }

    return (
        <View style={styles.container}>
            <Header title="Set New Password" backIconPress={backAction} />
            <View style={styles.hintTextWrapper}>
                <Text style={styles.hintText}>{"We have sent PIN to verify your\nemail id\n" + email}</Text>
            </View>
            <View style={styles.otpInputWrapper}>
                <OTPTextInput
                    autoFocus
                    tintColor={Colors.Black(1)}
                    offTintColor={Colors.Black(1)}
                    textInputStyle={styles.otpInput}
                    keyboardType="numeric"
                    secureTextEntry={true}
                    handleTextChange={handleOTP}
                />
                <Text style={styles.otpErrorText}>{otpErr ? otpErrText : ""}</Text>
            </View>
            <View style={styles.longInputWrapper}>
                <FloatingLabelInput
                    label={"Password"}
                    isPassword
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    customLabelStyles={floatingCustomLabel}
                    value={password}
                    onChangeText={handlePwd}
                />
                <Text style={styles.errorText}>{pwdErr ? pwdErrText : ""}</Text>
            </View>
            <View style={styles.longInputWrapper}>
                <FloatingLabelInput
                    label={"Confirm Password"}
                    isPassword
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    customLabelStyles={floatingCustomLabel}
                    value={confirmPassword}
                    onChangeText={handleConfirmPwd}
                />
                <Text style={styles.errorText}>{confirmPwdErr ? confirmPwdErrText : ""}</Text>
            </View>
            <LongButton text="Save" disabled={verifyButtonDisable} buttonPress={saveNewPassword} />
            <Text style={resendDisable ? styles.resendCodeDisabled : styles.resendCode} onPress={resendCode}>{"Resend the code"}</Text>
            <Text style={styles.timerText}>{timer.toString().length === 1 ? `00:0${timer}` : `00:${timer}`}</Text>
        </View>
    );
}

export default SetNewPasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    floatingInputContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.Black(1),
        marginHorizontal: 30,
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: 20
    },
    floatingLabel: {
        top: 10,
        left: 0,
        fontSize: 12,
        fontFamily: Fonts.MontserratRegular
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
    longInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    errorText: {
        position: "absolute",
        right: 0,
        bottom: 0,
        marginHorizontal: 30,
        color: Colors.Red,
        fontSize: 9,
        fontFamily: Fonts.MontserratRegular,
    },
    otpErrorText: {
        position: "absolute",
        alignSelf: "center",
        top: 60,
        marginHorizontal: 30,
        color: Colors.Red,
        fontSize: 9,
        fontFamily: Fonts.MontserratRegular,
    },
    otpInputWrapper: {
        marginVertical: 20, 
        position: "relative"
    }
})