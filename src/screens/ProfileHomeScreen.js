import React, { useCallback } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import LongButton from "../components/Buttons/LongButton";
import TitleHeader from "../components/Headers/TitleHeader";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { hideDigits } from "../helpers/ContentHelpers";
import { useFocusEffect } from "@react-navigation/native";
import { UserActions } from "../redux/slices/UserSagaSlice";

const ProfileHomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const userData = useSelector(state => state.user.data);

    const fetchUserDetails = () => {
        new Promise((resolve, reject) => {
            dispatch(UserActions.fetchUser({ token: userToken, resolve, reject }));
        })
            .then(res => { })
            .catch(err => {
                console.warn("Error while fetching user details ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchUserDetails();
        }, [JSON.stringify(userData)])
    )

    return (
        <View style={styles.container}>
            <TitleHeader title="My Profile" />
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
                <View style={styles.imageViewWrapper}>
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: userData.image }} style={styles.image} />
                    </View>
                </View>
                <View style={styles.contentViewsWrapper}>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.titleText}>{"Legal Name"}</Text>
                        <Text style={styles.valueText}>{_.startCase(userData.legal_name)}</Text>
                    </View>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.titleText}>{"Email"}</Text>
                        <Text style={styles.valueText}>{userData.email}</Text>
                    </View>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.titleText}>{"Phone Number"}</Text>
                        <Text style={styles.valueText}>{`${userData.country_code} ${userData.phone_number}`}</Text>
                    </View>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.titleText}>{"Date of Birth"}</Text>
                        <Text style={styles.valueText}>{userData.dob}</Text>
                    </View>
                    <View style={styles.contentWrapperTwo}>
                        <Text style={styles.titleText}>{"Address"}</Text>
                        <View style={styles.addressValWrapper}>
                            <Text style={styles.valueText}>{`${userData.address_line_1} ${userData.address_line_2} ${userData.city},`}</Text>
                            <Text style={styles.valueText}>{`${userData.state} ${userData.zipcode}`}</Text>
                        </View>
                    </View>
                    <View style={styles.contentWrapperThree}>
                        <Text style={styles.titleText}>{"Occupation"}</Text>
                        <Text style={styles.valueText}>{_.capitalize(userData.occupation)}</Text>
                    </View>
                    <View style={styles.contentWrapper}>
                        <Text style={styles.titleText}>{"SSN Number"}</Text>
                        <Text style={styles.valueText}>{hideDigits(0, "000000000")}</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <LongButton text="Edit Profile" buttonPress={() => navigation.push("EditProfile")} />
            </View>
        </View>
    );
}

export default ProfileHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    scrollContainer: {
        top: Platform.OS === "ios" ? 80 : 45,
    },
    imageViewWrapper: {
        paddingVertical: 30,
        flexDirection: "row",
        justifyContent: "center"
    },
    imageWrapper: {
        width: 122.1,
        height: 122.1,
        borderRadius: 122.1 / 2,
        backgroundColor: Colors.Black(0.15)
    },
    image: {
        width: 122.1,
        height: 122.1,
        borderRadius: 122.1 / 2
    },
    contentViewsWrapper: {
        padding: 20
    },
    contentWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 11.5
    },
    contentWrapperTwo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    contentWrapperThree: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 33,
        paddingBottom: 11.5
    },
    titleText: {
        fontSize: 12,
        fontFamily: Fonts.MontserratRegular
    },
    valueText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratMedium
    },
    addressValWrapper: {
        top: 11,
        height: 40,
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    buttonWrapper: {
        paddingVertical: 20
    }
})