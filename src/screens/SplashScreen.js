import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import assets from "../assets";
import Colors from "../constants/Colors";
import { scaleToWidth } from "../helpers/ContentHelpers";
import { QuestionnaireActions } from "../redux/slices/QuestionnaireSagaSlice";
import { UserActions } from "../redux/slices/UserSagaSlice";

const SplashScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const navigateStart = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            new Promise((resolve, reject) => {
                dispatch(QuestionnaireActions.resetQuestionnaire());
                dispatch(UserActions.setToken({ token }));
                dispatch(UserActions.fetchUser({ token, resolve, reject }));
            })
                .then(res => {
                    if (res.status === 1) {
                        navigateTo("CompleteProfile");
                    }
                    if (res.status === 2) {
                        navigateTo("VerifyOTP");
                    }
                    if (res.status === 3) {
                        navigateTo("InAppTab");
                    }
                })
                .catch(err => {
                    navigateTo("Signup");
                    console.warn("Error while fetching user details ---->", err);
                })
        } else {
            navigateTo("Signup");
        }
    }

    const navigateTo = (route) => {
        setTimeout(() => {
            navigation.push(route);
        }, 5000);
    }

    useEffect(() => {
        navigateStart();
    }, [])

    return (
        <View style={styles.container}>
            <Image source={assets.images.ZeroPercentLogo} style={styles.logoImage} />
        </View>
    );
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.White(1)
    },
    logoImage: {
        width: scaleToWidth(28),
        height: scaleToWidth(8),
    },
})