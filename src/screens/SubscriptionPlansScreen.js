import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import _ from "lodash";
import Carousel from "react-native-snap-carousel";
import SmallButton from "../components/Buttons/SmallButton";
import Header from "../components/Headers/Header";
import SubscriptionCard from "../components/SubscriptionsBilling/SubscriptionCard";
import Colors from "../constants/Colors";
import Toast from "react-native-toast-message";
import { IsIOS, IsTablet, SubscriptionPlans } from "../constants/Constants";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { SubscriptionsActions } from "../redux/slices/SubscriptionsSagaSlice";
import Fonts from "../constants/Fonts";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";

const SubscriptionPlansScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const plansData = useSelector(state => state.subscriptions.plans)
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);

    const fetchPlans = () => {
        new Promise((resolve, reject) => {
            dispatch(SubscriptionsActions.fetchPlans({ resolve, reject, token: userToken }))
        })
            .then(res => {
                // console.info(res) // for dev purpose only, to be removed
            })
            .catch(err => {
                console.warn("Error while fetching subscription plans ---->", err);
            })
    }

    const purchasePlan = () => {
        const plan = {
            "sub_plan_id": plansData[activeIndex].id,
            "success_url": "https://0percent.com/success?sc_checkout=success",
            "cancel_url": "https://0percent.com/cancel?sc_checkout=cancel"
        }
        new Promise((resolve, reject) => {
            dispatch(SubscriptionsActions.purchasePlanStart({ resolve, reject, token: userToken, plan }))
        })
            .then(res => {
                if (res) {
                    navigation.push("StripePurchase");
                }
            })
            .catch(err => {
                console.warn("Error while creating payment session ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchPlans();
        }, [JSON.stringify(plansData)])
    )

    const renderCard = ({ item, index }) => {
        return (
            <SubscriptionCard
                type={item.type}
                cost={item.cost}
                description={item.description}
                cardKey={index}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Header title="Subscription Plans" backIconPress={() => navigation.goBack()} />
            <View style={styles.subTitleWrapper}>
                <Text style={styles.subTitleText}>{"Select a plan as per your need"}</Text>
            </View>
            <View style={styles.pageContent}>
                <Carousel
                    layout="stack"
                    layoutCardOffset={140}
                    ref={carouselRef}
                    data={_.map(plansData)}
                    renderItem={renderCard}
                    sliderWidth={scaleToWidth(100)}
                    itemWidth={Math.round(scaleToWidth(75))}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    useScrollView={true}
                    loop={true}
                    loopClonesPerSide={_.size(plansData)}
                />
            </View>
            <View style={styles.buttonWrapper}>
                <SmallButton text="Buy" buttonPress={purchasePlan} />
            </View>
        </View>
    );
}

export default SubscriptionPlansScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    subTitleWrapper: {
        paddingVertical: scaleToWidth(2.5),
        paddingHorizontal: 30,
        top: IsIOS ? 80 : 45,
    },
    subTitleText: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratRegular
    },
    pageContent: {
        paddingVertical: scaleToWidth(5),
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: IsTablet ? scaleToWidth(15) : scaleToWidth(25),
        paddingHorizontal: IsTablet ? scaleToWidth(26) : scaleToWidth(7)
    }
})