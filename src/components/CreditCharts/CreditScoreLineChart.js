import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import _ from "lodash";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const CreditScoreLineChart = ({ graphData }) => {
    const [labels, setLabels] = useState(["", "", "", ""]);
    const [data, setData] = useState([0, 0, 0, 0]);
    const [clickedScore, setClickedScore] = useState("")

    const createGraphData = () => {
        if (graphData && _.size(graphData) > 0) {
            setLabels(_.map(graphData, (data) => data.month + ", " + data.year));
            // setData(_.map(graphData, "score")); // to be used for actual users
            setData([620, 580, 720, 780]); // to be removed, for dev purpose only
        }
    }

    useEffect(() => {
        createGraphData();
    }, [graphData])

    const lineChartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                color: (opacity = 1) => Colors.BrownYellow,
                strokeWidth: 0.8
            },
            {
                data: [900, 900, 900, 900],
                color: (opacity = 0) => Colors.White(opacity),
                strokeWidth: 0,
            }
        ]
    }

    return (
        <View style={styles.container}>
            <Text style={styles.creditHisText}>{"Credit History"}</Text>
            <LineChart
                data={lineChartData}
                width={Dimensions.get("screen").width}
                height={220}
                chartConfig={{
                    backgroundColor: Colors.White(1),
                    backgroundGradientFrom: Colors.White(1),
                    backgroundGradientTo: Colors.White(1),
                    color: (opcaity = 0.5) => Colors.GoldYellow(opcaity),
                    fillShadowGradient: Colors.GoldYellow(1),
                    fillShadowGradientOpacity: 0.6,
                    style: {
                        borderRadius: 16
                    },
                    propsForLabels: { fill: Colors.Black(1), stroke: Colors.Black(1), ...styles.graphLabels },
                    propsForBackgroundLines: { stroke: Colors.Black(0.25), strokeWidth: 0.8 },
                    useShadowColorFromDataset: true
                }}
                withVerticalLines={false}
                fromZero
                segments={3}
                formatYLabel={(y) => Math.trunc(y)}
                style={styles.chartView}
                onDataPointClick={({ value }) => setClickedScore(value)}
            />
            {
                !!clickedScore ?
                    <View style={styles.tooltipButton}>
                        <TouchableWithoutFeedback onPressOut={() => setClickedScore("")}>
                            <Text style={styles.tooltipText}>{clickedScore}</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    : <></>
            }
            <View style={styles.blankView} />
        </View>
    );
}

export default CreditScoreLineChart;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        zIndex: 1000
    },
    blankView: {
        width: 32,
        height: "100%",
        position: "absolute",
        right: 0,
        backgroundColor: Colors.White(1)
    },
    creditHisText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratSBold,
        marginHorizontal: 20,
        marginVertical: 20
    },
    graphLabels: {
        fontSize: 11,
        fontFamily: Fonts.MontserratMedium,
        fontWeight: "100"
    },
    tooltipButton: {
        position: "absolute",
        alignSelf: "center",
        bottom: 60,
        backgroundColor: Colors.White(1),
        width: 33,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 7
    },
    tooltipText: {
        fontSize: 11,
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.GreyText
    },
    chartView: {
        right: 10
    }
})