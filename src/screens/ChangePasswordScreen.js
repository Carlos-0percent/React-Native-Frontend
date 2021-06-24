import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import SmallButton from "../components/Buttons/SmallButton";
import Header from "../components/Headers/Header";
import LoaderModal from "../components/Modals/LoaderModal";
import Colors from "../constants/Colors";
import { IsAndroid, IsIOS, IsTablet } from "../constants/Constants";
import Fonts from "../constants/Fonts";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";
import { UserActions } from "../redux/slices/UserSagaSlice";

const floatingCustomLabel = {
    colorBlurred: Colors.Black(1),
    colorFocused: Colors.Black(1),
    fontSizeBlurred: fontSize(12),
    fontSizeFocused: fontSize(12),
}

const ChangePasswordScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [oldPwdErr, setOldPwdErr] = useState(false);
    const [oldPwdErrText, setOldPwdErrText] = useState("");
    const [pwdErr, setPwdErr] = useState(false);
    const [pwdErrText, setPwdErrText] = useState("");
    const [confirmPwdErr, setConfirmPwdErr] = useState(false);
    const [confirmPwdErrText, setConfirmPwdErrText] = useState("");
    const [saveDisabled, setSaveDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleOldPwd = (pwd) => {
        setOldPassword(pwd);
        if (pwd.toString().length >= 8 || pwd === "") {
            if (oldPwdErr) {
                setOldPwdErr(false);
            }
        } else {
            setOldPwdErr(true);
            setOldPwdErrText("Minimum 8 characters");
        }
        if (password) {
            handlePwd(password);
        }
        return true;
    }

    const handlePwd = (pwd) => {
        setPassword(pwd);
        if (pwd.toString().length >= 8 || pwd === "") {
            if (pwdErr) {
                setPwdErr(false);
            }
            if (oldPassword === pwd && pwd !== "") {
                setPwdErr(true);
                setPwdErrText("Cannot be same to existing password");
            } else {
                if (pwdErr) {
                    setPwdErr(false);
                }
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

    const saveNewPassword = () => {
        const user = {
            "current_password": oldPassword,
            "new_password": password,
            "confirm_password": confirmPassword
        }

        setLoading(true);

        new Promise((resolve, reject) => {
            dispatch(UserActions.changePassword({ resolve, reject, token: userToken, user }));
        })
            .then(res => {
                if (res) {
                    Toast.show({
                        type: "success",
                        text1: "Password changed successfully!",
                        text2: "You can use your new password now ....",
                        autoHide: true,
                        visibilityTime: 2000
                    })
                    setPassword("");
                    setOldPassword("");
                    setConfirmPassword("");
                }
                setLoading(false);
            })
            .catch(err => {
                console.warn("Error while changing password ---->", err);
                setLoading(false);
                if (err.message === "Please enter a valid current password!" || err.message === "Wrong Password!") {
                    setOldPwdErr(true);
                    setOldPwdErrText("Wrong Password!");
                }
                if (err.message === "Please enter a valid new password!") {
                    setPwdErr(true);
                    setPwdErrText("Password must contain atleast 1 uppercase letter, 1 number, 1 special character");
                }
            })
    }

    useEffect(() => {
        if (!oldPassword || !password || !confirmPassword || oldPwdErr || pwdErr || confirmPwdErr) {
            if (!saveDisabled) {
                setSaveDisabled(true);
            }
        } else {
            if (saveDisabled) {
                setSaveDisabled(false);
            }
        }
    }, [oldPassword, password, confirmPassword, oldPwdErr, pwdErr, confirmPwdErr])

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
            <Header title="Change Password" backIconPress={() => navigation.goBack()} />
            <View style={IsTablet ? styles.tabletContainer : styles.pageContainer}>
                <View style={styles.longInputWrapper}>
                    <FloatingLabelInput
                        label={"Current Password"}
                        isPassword
                        containerStyles={styles.floatingInputContainer}
                        labelStyles={styles.floatingLabel}
                        inputStyles={styles.floatingInput}
                        customLabelStyles={floatingCustomLabel}
                        value={oldPassword}
                        onChangeText={handleOldPwd}
                    />
                    <Text style={styles.errorText}>{oldPwdErr ? oldPwdErrText : ""}</Text>
                </View>
                <View style={styles.longInputWrapper}>
                    <FloatingLabelInput
                        label={"New Password"}
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
                        label={"Confirm New Password"}
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
                <View style={styles.buttonWrapper}>
                    <SmallButton text="Save" disabled={saveDisabled} buttonPress={saveNewPassword} />
                </View>
            </View>
            {renderLoaderModal()}
        </View>
    );
}

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    tabletContainer: {
        flex: 1,
        position: "relative",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    pageContainer: {
        top: IsIOS ? 80 : 45,
        paddingBottom: IsIOS ? 80 : 45,
        alignItems: "center"
    },
    floatingInputContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.Black(1),
        marginHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7),
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: IsTablet ? scaleToWidth(2.8) : scaleToWidth(4.4)
    },
    floatingLabel: {
        top: IsTablet ? 2 : IsAndroid ? 14 : 8,
        left: 0,
        fontSize: fontSize(12),
        fontFamily: Fonts.MontserratRegular
    },
    floatingInput: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratMedium,
        paddingTop: 6,
        paddingBottom: 2
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
        fontSize: 9,
        fontFamily: Fonts.MontserratRegular,
    },
    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: scaleToWidth(6),
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(12)
    }
})