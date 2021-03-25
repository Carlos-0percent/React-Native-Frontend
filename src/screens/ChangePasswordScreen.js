import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import SmallButton from "../components/Buttons/SmallButton";
import Header from "../components/Headers/Header";
import LoaderModal from "../components/Modals/LoaderModal";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { UserActions } from "../redux/slices/UserSagaSlice";

const floatingCustomLabel = {
    colorBlurred: Colors.Black(1),
    colorFocused: Colors.Black(1)
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
                if (err.message === "Please enter a valid current password!") {
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
            <View style={styles.pageContent}>
                <View style={styles.longInputWrapper}>
                    <FloatingLabelInput
                        label={"Old Password"}
                        isPassword
                        containerStyles={styles.floatingInputContainer}
                        labelStyles={styles.floatingLabel}
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
    pageContent: {
        top: Platform.OS === "ios" ? 80 : 45,
        paddingBottom: Platform.OS === "ios" ? 80 : 45,
        alignItems: "center"
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
    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 24,
        width: "80%"
    }
})