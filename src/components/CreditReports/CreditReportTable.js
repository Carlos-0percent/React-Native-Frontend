import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import _ from "lodash";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import { IsTablet, Month } from "../../constants/Constants";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";

const CreditReportTable = ({ data }) => {
    const [providers, setProviders] = useState([]);
    const [dates, setDates] = useState([]);
    const [payStatusArr, setPayStatusArr] = useState([]);
    const [datesWorstDel, setDatesWorstDel] = useState([]);
    const [balanceAmtArr, setBalanceAmtArr] = useState([]);
    const [creditLimitAmtArr, setCreditLimitAmtArr] = useState([]);

    useEffect(() => {
        if (_.size(data) > 0) {
            setProviders(_.map(data, "provider"));
            const dates = _.map(_.map(data, "lastActivityDate"), (timestamp) => {
                const date = new Date(timestamp);
                return `${Month[date.getMonth()].value}/${date.getFullYear()}`;
            })
            setDates(dates);
            const payStatusArr = _.map(_.map(data, "accountStatus"), (status) => _.capitalize(_.replace(status, /_/g, " ")));
            setPayStatusArr(payStatusArr);
            const datesWorstDel = _.map(_.map(data, "majorDelinquencyFirstReportedDate"), (timestamp) => {
                const date = timestamp ? new Date(timestamp) : "";
                return date ? `${Month[date.getMonth()].value}/${date.getFullYear()}` : date;
            })
            setDatesWorstDel(datesWorstDel);
            const balanceAmtArr = _.map(_.map(data, "balanceAmount"), (data) => `$${data.amount}`);
            setBalanceAmtArr(balanceAmtArr);
            const creditLimitAmtArr = _.map(_.map(data, "creditLimitAmount"), (data) => `$${data.amount}`);
            setCreditLimitAmtArr(creditLimitAmtArr);
        } else {
            setDates([]);
            setPayStatusArr([]);
            setDatesWorstDel([]);
            setBalanceAmtArr([]);
            setCreditLimitAmtArr([]);
        }
    }, [JSON.stringify(data)])

    return (
        <View style={styles.container}>
            <View style={styles.headRow}>
                <View style={styles.centeredCell} />
                <View style={styles.centeredCell}><Text style={styles.cellColHeadText}>{providers[0] ? providers[0] : ""}</Text></View>
                <View style={styles.centeredCell}><Text style={styles.cellColHeadText}>{providers[1] ? providers[1] : ""}</Text></View>
                <View style={styles.centeredCell}><Text style={styles.cellColHeadText}>{providers[2] ? providers[2] : ""}</Text></View>
            </View>
            <View style={styles.dataRow}>
                <View style={styles.leftMostCell}><Text style={styles.cellRowHeadText}>{"Last Updated"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{dates[0] ? dates[0] : ""}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{dates[1] ? dates[1] : ""}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{dates[2] ? dates[2] : ""}</Text></View>
            </View>
            <View style={styles.dataRow}>
                <View style={styles.leftMostCell}><Text style={styles.cellRowHeadText}>{"Payment Status"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{payStatusArr[0] ? payStatusArr[0] : ""}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{payStatusArr[1] ? payStatusArr[1] : ""}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{payStatusArr[2] ? payStatusArr[2] : ""}</Text></View>
            </View>
            <View style={styles.dataRow}>
                <View style={styles.leftMostCell}><Text style={styles.cellRowHeadText}>{"Worst Delinquency"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{datesWorstDel[0] ? datesWorstDel[0] : "None reported"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{datesWorstDel[1] ? datesWorstDel[1] : "None reported"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{datesWorstDel[2] ? datesWorstDel[2] : "None reported"}</Text></View>
            </View>
            <View style={styles.dataRow}>
                <View style={styles.leftMostCell}><Text style={styles.cellRowHeadText}>{"Balance"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{balanceAmtArr[0] ? balanceAmtArr[0] : "$0"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{balanceAmtArr[1] ? balanceAmtArr[1] : "$0"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{balanceAmtArr[2] ? balanceAmtArr[2] : "$0"}</Text></View>
            </View>
            <View style={styles.dataRow}>
                <View style={[styles.leftMostCell, styles.bottomLeftCell]}><Text style={styles.cellRowHeadText}>{"Credit Limit"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{creditLimitAmtArr[0] ? creditLimitAmtArr[0] : "$0"}</Text></View>
                <View style={styles.dataCell}><Text style={styles.dataCellText}>{creditLimitAmtArr[1] ? creditLimitAmtArr[1] : "$0"}</Text></View>
                <View style={[styles.dataCell, styles.bottomRightCell]}><Text style={styles.dataCellText}>{creditLimitAmtArr[2] ? creditLimitAmtArr[2] : "$0"}</Text></View>
            </View>
        </View>
    );
}

export default CreditReportTable;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 9,
        backgroundColor: Colors.DarkBlue(1),
        padding: 1
    },
    headRow: {
        backgroundColor: Colors.DarkBlue(1),
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 0.8,
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9
    },
    dataRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 0.8
    },
    centeredCell: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "24.6%",
        paddingVertical: IsTablet ? scaleToWidth(2) : scaleToWidth(2.4)
    },
    cellColHeadText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratSBold,
        color: Colors.White(1)
    },
    cellRowHeadText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratMedium,
        color: Colors.White(1)
    },
    leftMostCell: {
        flexDirection: "row",
        alignItems: "center",
        width: "24.6%",
        padding: IsTablet ? scaleToWidth(2) : scaleToWidth(2.4),
        backgroundColor: Colors.DarkBlue(1),
    },
    dataCell: {
        flexDirection: "row",
        alignItems: "center",
        width: "24.6%",
        padding: IsTablet ? scaleToWidth(2) : scaleToWidth(2.4),
        backgroundColor: Colors.White(1),
    },
    dataCellText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratMedium,
        color: Colors.Black(1)
    },
    bottomLeftCell: {
        borderBottomLeftRadius: 9
    },
    bottomRightCell: {
        borderBottomRightRadius: 9
    },
})