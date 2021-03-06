import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useDispatch } from "react-redux";
import LongButton from "../components/Buttons/LongButton";
import Header from "../components/Headers/Header";
import LoaderModal from "../components/Modals/LoaderModal";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { UserActions } from "../redux/slices/UserSagaSlice";
import Toast from "react-native-toast-message";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";
import { IsTablet } from "../constants/Constants";

const floatingCustomLabel = {
    colorBlurred: Colors.Black(1),
    colorFocused: Colors.Black(1),
    fontSizeBlurred: fontSize(12),
    fontSizeFocused: fontSize(12),
}

const ForgotPasswordScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [sendDisable, setSendDisable] = useState(true);
    const [emailErr, setEmailErr] = useState(false);
    const [emailErrText, setEmailErrText] = useState("");

    const handleEmail = (email) => {
        setEmail(email);
        const regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
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

    const sendOTP = () => {
        const user = {
            "email": email
        }

        new Promise((resolve, reject) => {
            setLoading(true);
            dispatch(UserActions.sendEmailOTP({ user, resolve, reject }));
        })
            .then(res => {
                console.info(res); // to be removed, for dev purpose only
                setLoading(false);
                Toast.show({
                    type: "success",
                    text1: "PIN sent successfully!",
                    text2: "Check your inbox",
                    autoHide: true,
                    visibilityTime: 2000
                })
                navigation.push("SetNewPassword", { email });
            })
            .catch(err => {
                console.warn("Error while sending OTP on email ---->", err);
                setLoading(false);
                if (err.message === "User with this email does not exist!") {
                    setEmailErr(true);
                    setEmailErrText("User doesn't exist");
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
        if (email && !emailErr) {
            if (sendDisable) {
                setSendDisable(false);
            }
        } else {
            if (!sendDisable) {
                setSendDisable(true);
            }
        }
    }, [email, emailErr])

    return (
        <View style={styles.container}>
            <Header title="Forgot Password" backIconPress={() => navigation.push("Login")} />
            <View style={styles.hintTextWrapper}>
                <Text style={styles.hintText}>{"Please enter your registered email address and we will send you a PIN to verify this email"}</Text>
            </View>
            <View style={styles.longInputWrapper}>
                <FloatingLabelInput
                    label={""}
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    inputStyles={styles.floatingInput}
                    customLabelStyles={floatingCustomLabel}
                    value={email}
                    onChangeText={handleEmail}
                />
                <Text style={styles.errorText}>{emailErr ? emailErrText : ""}</Text>
            </View>
            <View style={styles.buttonWrapper}>
                <LongButton text="Send" disabled={sendDisable} buttonPress={sendOTP} />
            </View>
            {renderLoaderModal()}
        </View>
    );
}

export default ForgotPasswordScreen;

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
        marginHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7),
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: 18
    },
    floatingLabel: {
        top: 10,
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
    hintTextWrapper: {
        width: "100%",
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7)
    },
    hintText: {
        width: "80%",
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratLight,
        lineHeight: IsTablet ? 22.5 : 17.5
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
    buttonWrapper: {
        flexDirection: "row",
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7),
        paddingVertical: IsTablet ? scaleToWidth(1) : scaleToWidth(0),
    }
})