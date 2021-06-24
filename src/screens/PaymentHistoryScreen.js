import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import _ from "lodash";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import CreditPayHistoryTable from "../components/CreditReports/CreditPayHistoryTable";
import { useFocusEffect } from "@react-navigation/native";
import { IsIOS, IsTablet } from "../constants/Constants";
import { scaleToWidth } from "../helpers/ContentHelpers";

const PaymentHistoryScreen = ({ navigation }) => {
    const accountPayHistory = useSelector(state => state.credit.accountPayHistory);
    const [years, setYears] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const years = _.uniq(_.map(accountPayHistory, "year"));
            setYears(_.map(years));
        }, [JSON.stringify(accountPayHistory)])
    )

    return (
        <View style={styles.container}>
            <Header title="Payment History" backIconPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
                {
                    _.map(years, (year, index) => {
                        const payYearHistory = _.filter(accountPayHistory, { year });
                        if (index < 2) {
                            return (
                                <View style={styles.tableWrapper} key={index}>
                                    <CreditPayHistoryTable
                                        data={payYearHistory}
                                        year={year}
                                        tableKey={index}
                                    />
                                </View>
                            );
                        }
                    })
                }
            </ScrollView>
        </View>
    );
}

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    scrollContainer: {
        top: IsIOS ? 80 : 45,
        paddingBottom: IsIOS ? 80 : 45,
    },
    tableWrapper: {
        paddingHorizontal: IsTablet ? scaleToWidth(8.6) : scaleToWidth(3.6),
        paddingVertical: scaleToWidth(5)
    }
})