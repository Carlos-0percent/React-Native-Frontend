import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import SmallButton from "../components/Buttons/SmallButton";
import Header from "../components/Headers/Header";
import SubscriptionCard from "../components/SubscriptionsBilling/SubscriptionCard";
import Colors from "../constants/Colors";
import { IsTablet } from "../constants/Constants";
import { scaleToWidth } from "../helpers/ContentHelpers";
import { SubscriptionsActions } from "../redux/slices/SubscriptionsSagaSlice";

const MyPlanScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const planData = useSelector(state => state.subscriptions.myPlan);
    const [noPurchase, setNoPurchase] = useState(true);

    const fetchMyPlan = () => {
        new Promise((resolve, reject) => {
            dispatch(SubscriptionsActions.fetchMyPlan({ resolve, reject, token: userToken }))
        })
            .then(res => {
                // console.info(res) // for dev purpose only, to be removed
                if (res) {
                    setNoPurchase(false);
                }
            })
            .catch(err => {
                console.warn("Error while fetching user's subscription plan ---->", err);
                if (err.message === "Subscription not found!") {
                    setNoPurchase(true);
                    Toast.show({
                        type: "error",
                        text1: "No Plan Purchase Found",
                        text2: "Click View Other Plans ...",
                        autoHide: false
                    })
                }
            })
    }

    const cancelMyPlan = () => {
        new Promise((resolve, reject) => {
            dispatch(SubscriptionsActions.cancelPlan({ resolve, reject, token: userToken }))
        })
            .then(res => {
                if (res && res.code === 200) {
                    Toast.show({
                        type: "success",
                        text1: "Plan cancelled successfully",
                        autoHide: true,
                        visibilityTime: 3000
                    })
                    setTimeout(() => {
                        navigation.goBack();
                    }, 500);
                }
            })
            .catch(err => {
                console.warn("Error while cancelling user's subscription plan ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchMyPlan();
        }, [JSON.stringify(planData)])
    )

    useFocusEffect(
        useCallback(() => {
            const blurSubcription = navigation.addListener("blur", () => {
                Toast.hide();
            })
            return blurSubcription;
        }, [])
    )

    return (
        <View style={styles.container}>
            <Header title="My Plan" backIconPress={() => navigation.goBack()} />
            <View style={styles.pageContent}>
                <SubscriptionCard
                    type={noPurchase ? "platinum" : planData.type}
                    cost={noPurchase ? 0 : planData.cost}
                    description={noPurchase ? [] : planData.description}
                />
            </View>
            <View style={styles.buttonsWrapper}>
                <View style={styles.buttonWrapper}>
                    <SmallButton text="Cancel Plan" disabled={noPurchase} buttonPress={cancelMyPlan} />
                </View>
                <View style={styles.buttonWrapper}>
                    <SmallButton text="View Other Plans" buttonPress={() => navigation.push("SubscriptionPlans")} />
                </View>
            </View>
        </View>
    );
}

export default MyPlanScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    pageContent: {
        paddingVertical: scaleToWidth(5),
        paddingHorizontal: scaleToWidth(10),
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: scaleToWidth(2),
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7)
    },
    buttonsWrapper: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: IsTablet ? scaleToWidth(13) : scaleToWidth(22),
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7)
    }
})