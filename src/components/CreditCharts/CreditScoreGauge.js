import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { VictoryPie } from "victory-native";
import _ from "lodash";
import { CreditScoreLevel } from "../../constants/Constants";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

const chartView = {
    labels: {
        fill: Colors.Black(0)
    },
}

const CreditScoreGauge = ({ creditScore, creditScoreType }) => {
    const [data, setData] = useState(_.reverse(_.map(CreditScoreLevel, score => ({ y: score.scoreRange, x: "0%" }))));

    const createGraphData = () => {
        if (creditScoreType) {
            const creditLevel = _.find(CreditScoreLevel, { type: creditScoreType });
            const graphData = [];
            const levelScore = creditLevel.maxScore - creditScore + 1;
            let blankScore = 0;
            const zeroObject = { y: 0, x: "0%" };

            if (creditScoreType === CreditScoreLevel[0].type) {
                blankScore = creditLevel.maxScore - creditScore + CreditScoreLevel[1].scoreRange + CreditScoreLevel[2].scoreRange + CreditScoreLevel[3].scoreRange + CreditScoreLevel[4].scoreRange;
                graphData.push({ y: levelScore, x: "0%" });
                graphData.push(zeroObject);
                graphData.push(zeroObject);
                graphData.push(zeroObject);
                graphData.push(zeroObject);
            } else if (creditScoreType === CreditScoreLevel[1].type) {
                blankScore = creditLevel.maxScore - creditScore + CreditScoreLevel[2].scoreRange + CreditScoreLevel[3].scoreRange + CreditScoreLevel[4].scoreRange;
                graphData.push({ y: CreditScoreLevel[0].scoreRange, x: "0%" });
                graphData.push({ y: levelScore, x: "0%" });
                graphData.push(zeroObject);
                graphData.push(zeroObject);
                graphData.push(zeroObject);
            } else if (creditScoreType === CreditScoreLevel[2].type) {
                blankScore = creditLevel.maxScore - creditScore + CreditScoreLevel[3].scoreRange + CreditScoreLevel[4].scoreRange;
                graphData.push({ y: CreditScoreLevel[0].scoreRange, x: "0%" });
                graphData.push({ y: CreditScoreLevel[1].scoreRange, x: "0%" });
                graphData.push({ y: levelScore, x: "0%" });
                graphData.push(zeroObject);
                graphData.push(zeroObject);
            } else if (creditScoreType === CreditScoreLevel[3].type) {
                blankScore = creditLevel.maxScore - creditScore + CreditScoreLevel[4].scoreRange;
                graphData.push({ y: CreditScoreLevel[0].scoreRange, x: "0%" });
                graphData.push({ y: CreditScoreLevel[1].scoreRange, x: "0%" });
                graphData.push({ y: CreditScoreLevel[2].scoreRange, x: "0%" });
                graphData.push({ y: levelScore, x: "0%" });
                graphData.push(zeroObject);
            } else if (creditScoreType === CreditScoreLevel[4].type) {
                blankScore = creditLevel.maxScore - creditScore;
                graphData.push({ y: CreditScoreLevel[0].scoreRange, x: "0%" });
                graphData.push({ y: CreditScoreLevel[1].scoreRange, x: "0%" });
                graphData.push({ y: CreditScoreLevel[2].scoreRange, x: "0%" });
                graphData.push({ y: CreditScoreLevel[3].scoreRange, x: "0%" });
                graphData.push({ y: levelScore, x: "0%" });
            }
            graphData.push({ y: blankScore, x: "0%" });

            setData(_.reverse(_.map(graphData)));
        }
    }

    useEffect(() => {
        createGraphData();
    }, [creditScore, creditScoreType])

    const getScoreTypeColor = () => {
        if (creditScoreType === CreditScoreLevel[0].type) {
            return Colors.CreditRed;
        } else if (creditScoreType === CreditScoreLevel[1].type) {
            return Colors.CreditPink;
        } else if (creditScoreType === CreditScoreLevel[2].type) {
            return Colors.CreditPurple;
        } else if (creditScoreType === CreditScoreLevel[3].type) {
            return Colors.CreditBlue;
        } else if (creditScoreType === CreditScoreLevel[4].type) {
            return Colors.CreditGreen;
        } else {
            return Colors.CreditGreen;
        }
    }

    return (
        <View style={styles.container}>
            <VictoryPie
                data={data}
                colorScale={[Colors.Black(0.25), Colors.CreditGreen, Colors.CreditBlue, Colors.CreditPurple, Colors.CreditPink, Colors.CreditRed]}
                width={Dimensions.get("screen").width}
                height={320}
                innerRadius={120}
                startAngle={90}
                endAngle={-90}
                style={chartView}
            />
            <View style={styles.scoreTextWrapper}>
                <Text style={styles.scoreText}>{creditScore}</Text>
                <Text style={styles.creditText}>{"Credit score"}</Text>
                <Text style={styles.scoreType(getScoreTypeColor())}>{_.capitalize(creditScoreType)}</Text>
            </View>
        </View>
    )
}

export default CreditScoreGauge;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        top: 140
    },
    scoreTextWrapper: {
        position: "absolute",
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "center",
        top: 76
    },
    scoreText: {
        fontSize: 38,
        fontFamily: Fonts.MontserratBold
    },
    creditText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratRegular
    },
    scoreType: (color) => ({
        fontSize: 18,
        fontFamily: Fonts.LatoBold,
        color
    })
})