import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import _ from "lodash";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import { Month } from "../../constants/Constants";
import { fontSize } from "../../helpers/ContentHelpers";

const CreditPayHistoryTable = ({ data, year }) => {
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        if (_.size(data) > 0) {
            setProviders(_.map(data, "provider"));
        }
    }, [JSON.stringify(data)])

    const formatValue = (value) => {
        let text = _.replace(value, /_/g, " ");
        text = _.capitalize(text);
        return text;
    }

    return (
        <View style={styles.container}>
            <View style={styles.headRow}>
                <View style={styles.leftMostCell}><Text style={styles.yearText}>{year}</Text></View>
                <View style={[styles.centeredCell, styles.topLeftCell]}><Text style={styles.cellColHeadText}>{providers[0] ? providers[0] : ""}</Text></View>
                <View style={styles.centeredCell}><Text style={styles.cellColHeadText}>{providers[1] ? providers[1] : ""}</Text></View>
                <View style={[styles.centeredCell, styles.topRightCell]}><Text style={styles.cellColHeadText}>{providers[2] ? providers[2] : ""}</Text></View>
            </View>
            {
                _.size(data)> 0 ? _.map(Month, (month, index) => {
                    if (index + 1 === _.size(Month)) {
                        return (
                            <View style={styles.dataRow} key={index}>
                                <View style={styles.leftMostCell}><Text style={styles.cellRowHeadText}>{month.key}</Text></View>
                                <View style={[styles.bottomCell, styles.bottomLeftCell]}><Text style={styles.dataCellText}>{formatValue(data[0][_.lowerCase(month.name)].value)}</Text></View>
                                <View style={styles.bottomCell}><Text style={styles.dataCellText}>{formatValue(data[1][_.lowerCase(month.name)].value)}</Text></View>
                                <View style={[styles.bottomCell, styles.bottomRightCell]}><Text style={styles.dataCellText}>{formatValue(data[2][_.lowerCase(month.name)].value)}</Text></View>
                            </View>
                        );
                    } else {
                        return (
                            <View style={styles.dataRow} key={index}>
                                <View style={styles.leftMostCell}><Text style={styles.cellRowHeadText}>{month.key}</Text></View>
                                <View style={styles.dataCell}><Text style={styles.dataCellText}>{formatValue(data[0][_.lowerCase(month.name)].value)}</Text></View>
                                <View style={styles.dataCell}><Text style={styles.dataCellText}>{formatValue(data[1][_.lowerCase(month.name)].value)}</Text></View>
                                <View style={styles.dataCell}><Text style={styles.dataCellText}>{formatValue(data[2][_.lowerCase(month.name)].value)}</Text></View>
                            </View>
                        );
                    }
                }) : <></>
            }
        </View>
    );
}

export default CreditPayHistoryTable;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        padding: 1
    },
    headRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    dataRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    centeredCell: {
        backgroundColor: Colors.DarkBlue(1),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "28%",
        paddingVertical: 10,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderTopWidth: 0.5,
        borderColor: Colors.DarkBlue(1),
    },
    cellColHeadText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratSBold,
        color: Colors.White(1)
    },
    cellRowHeadText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratMedium,
    },
    leftMostCell: {
        flexDirection: "row",
        alignItems: "center",
        width: "16%",
        padding: 10
    },
    dataCell: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "28%",
        paddingVertical: 10,
        backgroundColor: Colors.White(1),
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
    },
    bottomCell: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "28%",
        paddingVertical: 10,
        backgroundColor: Colors.White(1),
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: Colors.DarkBlue(1),
    },
    dataCellText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratMedium,
    },
    bottomLeftCell: {
        borderBottomLeftRadius: 9
    },
    bottomRightCell: {
        borderBottomRightRadius: 9
    },
    topLeftCell: {
        borderTopLeftRadius: 9
    },
    topRightCell: {
        borderTopRightRadius: 9
    },
    yearText: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratSBold,
    }
})