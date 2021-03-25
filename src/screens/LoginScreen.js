import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import assets from "../assets";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import Checkbox from "../components/Inputs/Checkbox";
import LongButton from "../components/Buttons/LongButton";
import { useDispatch } from "react-redux";
import { UserActions } from "../redux/slices/UserSagaSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderModal from "../components/Modals/LoaderModal";
import { EmailValidator } from "../constants/Constants";

const floatingCustomLabel = {
    colorBlurred: Colors.Black(1),
    colorFocused: Colors.Black(1)
}

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [loginDisable, setLoginDisable] = useState(true);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailErr, setEmailErr] = useState(false);
    const [emailErrText, setEmailErrText] = useState("");
    const [pwdErr, setPwdErr] = useState(false);
    const [pwdErrText, setPwdErrText] = useState("");

    const handleEmail = (email) => {
        setEmail(email);
        const regex = new RegExp(EmailValidator);
        if (regex.test(email) || email === "") {
            if (emailErr) {
                setEmailErr(false);
            }
        } else {
            setEmailErr(true);
            setEmailErrText("Invalid email");
        }
        return true;
    }

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
        return true;
    }

    const login = () => {
        const user = {
            "email": email,
            "password": password
        }

        new Promise((resolve, reject) => {
            setLoading(true);
            dispatch(UserActions.loginUser({ user, resolve, reject }));
        })
            .then(async res => {
                await AsyncStorage.setItem("token", res.token);
                if (res.status === 1) {
                    setLoading(false);
                    navigation.push("CompleteProfile");
                }
                if (res.status === 2) {
                    new Promise((resolve, reject) => {
                        dispatch(UserActions.fetchUser({ token: res.token, resolve, reject }));
                    })
                        .then(res => {
                            setLoading(false);
                            if (res.email) {
                                navigation.push("VerifyOTP");
                            }
                        })
                        .catch(err => {
                            console.warn("Error while fetching user details ---->", err);
                            setLoading(false);
                        })
                }
                if (res.status === 3) {
                    new Promise((resolve, reject) => {
                        dispatch(UserActions.fetchUser({ token: res.token, resolve, reject }));
                    })
                        .then(res => {
                            setLoading(false);
                            if (res.email) {
                                navigation.push("InAppTab");
                            }
                        })
                        .catch(err => {
                            console.warn("Error while fetching user details ---->", err);
                            setLoading(false);
                        })
                }
            })
            .catch(err => {
                console.warn("Error while login ---->", err);
                setLoading(false);
                if (err.message === "Please enter a valid email!" || err.message === "User with this email not found!") {
                    setEmailErr(true);
                    setEmailErrText("User doesn't exist");
                }
                if (err.message === "Please enter a valid password!" || err.message === "You have entered an invalid password!") {
                    setPwdErr(true);
                    setPwdErrText("Incorrect password");
                }
            })
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

    useEffect(() => {
        if (email && password && termsAccepted && !emailErr && !pwdErr) {
            if (loginDisable) {
                setLoginDisable(false);
            }
        } else {
            if (!loginDisable) {
                setLoginDisable(true);
            }
        }
    }, [email, password, emailErr, pwdErr, termsAccepted])

    return (
        <View style={styles.container}>
            <Image source={assets.images.ZeroPercentLogo} style={styles.logoImage} />
            <View style={styles.longInputWrapper}>
                <FloatingLabelInput
                    label={"Email"}
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    customLabelStyles={floatingCustomLabel}
                    value={email}
                    onChangeText={handleEmail}
                />
                <Text style={styles.errorText}>{emailErr ? emailErrText : ""}</Text>
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
            <View style={styles.termsWrapper}>
                <Checkbox checked={termsAccepted} checkboxPress={() => setTermsAccepted(!termsAccepted)} />
                <Text style={styles.iAcceptText}>{"I accept the"}</Text>
                <Text style={styles.termsText}>{"Terms & Conditions"}</Text>
            </View>
            <LongButton text="Sign In" disabled={loginDisable} buttonPress={login} />
            <View style={styles.forgotPassWrapper}>
                <Text style={styles.forgotPassText} onPress={() => navigation.push("ForgotPassword")}>{"Forgot password?"}</Text>
            </View>
            <View style={styles.signUpWrapper}>
                <Text style={styles.signUpText} onPress={() => navigation.push("Signup")}>{"Sign Up"}</Text>
            </View>
            {renderLoaderModal()}
        </View>
    );
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "column",
        backgroundColor: Colors.White(1),
        paddingVertical: 20,
        position: "relative"
    },
    floatingInputContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.Black(1),
        marginHorizontal: 30,
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: 18
    },
    floatingLabel: {
        top: 10,
        left: 0,
        fontSize: 12,
        fontFamily: Fonts.MontserratRegular
    },
    termsWrapper: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 30,
        alignItems: "center",
        marginVertical: 20
    },
    iAcceptText: {
        marginLeft: 10,
        fontSize: 11,
        fontFamily: Fonts.MontserratThin,
        fontWeight: Platform.OS === "ios" ? "500" : "700"
    },
    termsText: {
        marginLeft: 4,
        fontSize: 11,
        color: Colors.Blue,
        fontFamily: Fonts.MontserratThin,
        fontWeight: Platform.OS === "ios" ? "500" : "700"
    },
    signUpWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 40
    },
    alreadyText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratRegular
    },
    signUpText: {
        marginLeft: 4,
        fontSize: 14,
        color: Colors.Blue,
        fontFamily: Fonts.MontserratSBold
    },
    forgotPassWrapper: {
        width: "100%",
        paddingHorizontal: 30,
        marginVertical: 16,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    forgotPassText: {
        fontSize: 14,
        color: Colors.Blue,
        fontFamily: Fonts.MontserratSBold
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
    logoImage: {
        marginVertical: 80
    }
})