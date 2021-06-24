import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import _ from "lodash";
import Header from "../components/Headers/Header";
import LoaderModal from "../components/Modals/LoaderModal";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { IsIOS, IsTablet } from "../constants/Constants";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { SubscriptionsActions } from "../redux/slices/SubscriptionsSagaSlice";

const PaymentsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const payHistory = useSelector(state => state.subscriptions.history);

    const fetchMyPaymentHistory = () => {
        new Promise((resolve, reject) => {
            dispatch(SubscriptionsActions.fetchMyPaymentHistory({ resolve, reject, token: userToken }))
        })
            .then(res => {
                // console.info(res) // for dev purpose only, to be removed
            })
            .catch(err => {
                console.warn("Error while fetching user's payments history ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchMyPaymentHistory();
        }, [JSON.stringify(payHistory)])
    )

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
            <Header title={"Payments"} backIconPress={() => navigation.goBack()} />
            <View style={styles.pageContainer}>
                <View style={styles.headRow}>
                    <View style={styles.rowCellOne}><Text style={styles.headRowText}>{"Date"}</Text></View>
                    <View style={styles.rowCellTwo}><Text style={styles.headRowText}>{"Plan details"}</Text></View>
                    <View style={styles.rowCellThree}><Text style={styles.headRowText}>{"Amount"}</Text></View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
                    {
                        _.map(payHistory, ({ date, description, cost }, index) => (
                            <View style={styles.dataRow} key={index}>
                                <View style={styles.rowCellOne}><Text style={styles.dataRowText}>{date}</Text></View>
                                <View style={styles.rowCellTwo}><Text style={styles.dataRowText}>{description}</Text></View>
                                <View style={styles.rowCellThree}><Text style={styles.dataRowText}>{`$${cost}`}</Text></View>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
            {renderLoaderModal()}
        </View>
    );
}

export default PaymentsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    pageContainer: {
        top: IsIOS ? 80 : 45,
        paddingBottom: IsIOS ? 80 : 45,
    },
    headRow: {
        backgroundColor: Colors.DarkBlue(1),
        flexDirection: "row"
    },
    dataRow: {
        flexDirection: "row"
    },
    rowCellOne: {
        width: "25%",
        paddingVertical: scaleToWidth(2.6),
        paddingHorizontal: 20
    },
    rowCellTwo: {
        width: "50%",
        paddingVertical: scaleToWidth(2.6),
    },
    rowCellThree: {
        width: "25%",
        paddingVertical: scaleToWidth(2.6),
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    headRowText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratRegular,
        color: Colors.White(1)
    },
    dataRowText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratMedium,
        lineHeight: IsTablet ? 18.7 : 13.7
    },
    scrollContainer: {
        paddingTop: 10,
        paddingBottom: scaleToWidth(10)
    }
})