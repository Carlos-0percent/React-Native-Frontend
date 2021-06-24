import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import assets from "../assets";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import Checkbox from "../components/Inputs/Checkbox";
import LongButton from "../components/Buttons/LongButton";
import { useDispatch } from "react-redux";
import { UserActions } from "../redux/slices/UserSagaSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import LoaderModal from "../components/Modals/LoaderModal";
import { EmailValidator, IsAndroid, IsIOS, IsTablet } from "../constants/Constants";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";

const floatingCustomLabel = {
    colorBlurred: Colors.Black(1),
    colorFocused: Colors.Black(1),
    fontSizeBlurred: fontSize(12),
    fontSizeFocused: fontSize(12),
}

const SignupScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [signupDisable, setSignupDisable] = useState(true);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [email, setEmail] = useState("");
    const [phoneCode, setPhoneCode] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailErr, setEmailErr] = useState(false);
    const [emailErrText, setEmailErrText] = useState("");
    const [pwdErr, setPwdErr] = useState(false);
    const [pwdErrText, setPwdErrText] = useState("");
    const [confirmPwdErr, setConfirmPwdErr] = useState(false);
    const [confirmPwdErrText, setConfirmPwdErrText] = useState("");

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

    const createUser = () => {
        const user = {
            "email": email,
            "country_code": phoneCode,
            "phone_number": phone.replace(/-/g, ""),
            "password": password,
            "confirm_password": confirmPassword
        }

        new Promise((resolve, reject) => {
            setLoading(true);
            dispatch(UserActions.signupUser({ user, resolve, reject }));
        })
            .then(async res => {
                await AsyncStorage.setItem("token", res.token);
                setLoading(false);
                navigation.push("CompleteProfile");
            })
            .catch(err => {
                console.warn("Error while signup ---->", err);
                setLoading(false);
                if (err.message === "User with same email exists!") {
                    setEmailErr(true);
                    setEmailErrText(err.message);
                }
                if (err.message === "Please enter a valid password!") {
                    setPwdErr(true);
                    setPwdErrText("Password must contain atleast 1 uppercase letter, 1 number, 1 special character");
                }
                if (err.message === "Internal server error") {
                    Toast.show({
                        type: "error",
                        text1: "Unable to connect to server",
                        text2: "Please try after some time",
                        autoHide: true,
                        visibilityTime: 5000
                    })
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
        if (email && phoneCode && phone && password && confirmPassword && termsAccepted && !emailErr && !pwdErr && !confirmPwdErr) {
            if (signupDisable) {
                setSignupDisable(false);
            }
        } else {
            if (!signupDisable) {
                setSignupDisable(true);
            }
        }
    }, [email, phoneCode, phone, password, confirmPassword, termsAccepted, emailErr, pwdErr, confirmPwdErr])

    return (
        <View style={styles.container}>
            <Image source={assets.images.ZeroPercentLogo} style={styles.logoImage} />
            <View style={styles.longInputWrapper}>
                <FloatingLabelInput
                    label={"Email"}
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    inputStyles={styles.floatingInput}
                    customLabelStyles={floatingCustomLabel}
                    value={email}
                    onChangeText={handleEmail}
                />
                <Text style={styles.errorText}>{emailErr ? emailErrText : ""}</Text>
            </View>
            <View style={styles.miniInputsRow}>
                <View style={styles.phoneCodeInputWrapper}>
                    <FloatingLabelInput
                        label={"Code (+1)"}
                        containerStyles={styles.miniFloatingInputContainer}
                        labelStyles={styles.floatingLabel}
                        inputStyles={styles.floatingInput}
                        customLabelStyles={floatingCustomLabel}
                        value={phoneCode}
                        onChangeText={value => setPhoneCode(value)}
                        keyboardType="numeric"
                        mask="+9999"
                    />
                </View>
                <View style={styles.phoneInputWrapper}>
                    <FloatingLabelInput
                        label={"Phone Number"}
                        containerStyles={styles.miniFloatingInputContainer}
                        labelStyles={styles.floatingLabel}
                        inputStyles={styles.floatingInput}
                        customLabelStyles={floatingCustomLabel}
                        value={phone}
                        onChangeText={value => setPhone(value)}
                        keyboardType="numeric"
                        mask="999-999-9999"
                    />
                </View>
            </View>
            <View style={styles.longInputWrapper}>
                <FloatingLabelInput
                    label={"Password"}
                    isPassword
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    inputStyles={styles.floatingInput}
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
                    inputStyles={styles.floatingInput}
                    customLabelStyles={floatingCustomLabel}
                    value={confirmPassword}
                    onChangeText={handleConfirmPwd}
                />
                <Text style={styles.errorText}>{confirmPwdErr ? confirmPwdErrText : ""}</Text>
            </View>
            <View style={styles.termsWrapper}>
                <Checkbox checked={termsAccepted} checkboxPress={() => setTermsAccepted(!termsAccepted)} />
                <Text style={styles.iAcceptText}>{"I accept the"}</Text>
                <Text style={styles.termsText} onPress={() => navigation.push("TermsAndConditions")}>{"Terms & Conditions"}</Text>
            </View>
            <View style={styles.buttonWrapper}>
                <LongButton text="Create Account" buttonPress={createUser} disabled={signupDisable} />
            </View>
            <View style={styles.signInWrapper}>
                <Text style={styles.alreadyText}>{"Already have an account?"}</Text>
                <Text style={styles.signInText} onPress={() => navigation.push("Login")}>{"Sign In"}</Text>
            </View>
            {renderLoaderModal()}
        </View>
    );
}

export default SignupScreen;

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
        marginHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7),
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: IsTablet ? scaleToWidth(2.8) : scaleToWidth(4)
    },
    floatingLabel: {
        top: IsAndroid ? 16 : 8,
        left: 0,
        fontSize: fontSize(12),
        fontFamily: Fonts.MontserratRegular
    },
    floatingInput: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratMedium,
        paddingTop: 6,
        paddingBottom: IsAndroid ? 2 : 4
    },
    termsWrapper: {
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7),
        alignItems: "center",
        marginVertical: 20
    },
    iAcceptText: {
        marginLeft: 10,
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratThin,
        fontWeight: IsIOS ? "500" : "700"
    },
    termsText: {
        marginLeft: 4,
        fontSize: fontSize(11),
        color: Colors.Blue,
        fontFamily: Fonts.MontserratThin,
        fontWeight: IsIOS ? "500" : "700"
    },
    signInWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 40
    },
    alreadyText: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratRegular
    },
    signInText: {
        marginLeft: 4,
        fontSize: fontSize(14),
        color: Colors.Blue,
        fontFamily: Fonts.MontserratSBold
    },
    miniInputsRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7),
        justifyContent: "space-between"
    },
    phoneCodeInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: "20%"
    },
    phoneInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: "77%"
    },
    miniFloatingInputContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.Black(1),
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: IsTablet ? scaleToWidth(2.8) : scaleToWidth(4)
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
        marginHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7),
        color: Colors.Red,
        fontSize: fontSize(9),
        fontFamily: Fonts.MontserratRegular,
    },
    logoImage: {
        marginVertical: scaleToWidth(18),
        width: scaleToWidth(28),
        height: scaleToWidth(8),
    },
    buttonWrapper: {
        flexDirection: "row",
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7),
        paddingVertical: IsTablet ? scaleToWidth(1) : scaleToWidth(0),
    }
})