import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import _ from "lodash";
import FactorLevelIndicator from "../../components/CreditFactors/FactorLevelIndicator";
import ProgressCircular from "../../components/CreditFactors/ProgressCircular";
import Colors from "../../constants/Colors";
import { CreditFactorLevels } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import VideoPreview from "../../components/VideoPreview";
import { CreditFactorLabels } from "../../constants/StringLabels";
import { generateVideoThumb } from "../../helpers/VideoHelpers";

const PaymentHistoryScreen = ({ navigation }) => {
    const creditScoreFactor = useSelector(state => state.credit.factor);
    const [latePayCount, setLatePayCount] = useState(0);
    const [percent, setPercent] = useState(0);
    const [videoURI, setVideoURI] = useState("");
    const [videoThumb, setVideoThumb] = useState({});

    const calcPercent = (latePay, totalPay) => {
        let percentage = 100;
        if (latePay > 0) {
            percentage = ((totalPay - latePay) / totalPay) * 100;
        }
        return percentage;
    }

    useEffect(() => {
        if (_.size(creditScoreFactor) > 0) {
            const { data, video } = creditScoreFactor[0];
            setLatePayCount(data["latePaymentCount"]);
            setPercent(calcPercent(data["latePaymentCount"], data["totalPaymentsCount"]));
            setVideoURI(video);
            generateVideoThumb(video, (res) => setVideoThumb(res));
        }
    }, [JSON.stringify(creditScoreFactor)])

    const getProgressColor = () => {
        if (percent > 99) {
            return Colors.CreditFactorDarkGreen;
        } else if (percent > 98) {
            return Colors.CreditFactorLightGreen;
        } else if (percent > 97) {
            return Colors.CreditFactorYellow;
        } else if (percent === 97) {
            return Colors.CreditFactorOrange;
        } else if (percent < 97) {
            return Colors.CreditFactorRed;
        } else {
            return Colors.CreditFactorRed;
        }
    }

    const displayPercent = () => {
        let percentStr = percent.toFixed(1).toString();
        const percentArr = _.split(percentStr, ".");
        if (parseInt(percentArr[1]) === 0) {
            percentStr = percentArr[0];
        }
        return percentStr;
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
                <ProgressCircular
                    color={getProgressColor()}
                    content={
                        <>
                            <Text style={styles.percentText}>{`${displayPercent()}%`}</Text>
                            <Text style={styles.latePayText}>{`${latePayCount} late payment${latePayCount > 1 ? "s" : ""}`}</Text>
                        </>
                    }
                    percent={percent}
                />
                <FactorLevelIndicator level={CreditFactorLevels["Payment_history"]} />
                <View style={styles.contentWrapper}>
                    <View style={styles.contentParaWrapper}>
                        <Text style={styles.paraHeadText}>{`There ${latePayCount > 1 ? "are" : "is"} ${latePayCount} late or missed payment${latePayCount > 1 ? "s" : ""} on your report`}</Text>
                        <View style={styles.paraContentWrapper}>
                            <Text style={styles.paraContentText}>{CreditFactorLabels["Payment_History_Recommended"]}</Text>
                        </View>
                    </View>
                    <View style={styles.contentParaWrapper}>
                        <Text style={styles.paraHeadText}>{"What to know"}</Text>
                        <View style={styles.paraContentWrapper}>
                            {_.map(CreditFactorLabels["What_To_Know"]["1"], (str, index) => (
                                <Text style={styles.paraContentText}>
                                    <Text style={styles.paraContentIndexText}>{index + 1}</Text>
                                    <Text>{". "}</Text>
                                    {str}
                                </Text>
                            ))}
                        </View>
                    </View>
                    <View style={styles.contentParaWrapper}>
                        <Text style={styles.paraHeadText}>{"How this gets circulated"}</Text>
                        <View style={styles.paraContentWrapper}>
                            {_.map(CreditFactorLabels["How_Circulated"]["1"], (str) => (
                                <View style={styles.unorderListItemWrapper}>
                                    <View style={styles.dotView} />
                                    <Text style={styles.paraContentText}>
                                        {_.map(_.split(str, "<SB>"), (str, index) => {
                                            if ((index + 1) % 2 === 0) {
                                                return <Text style={styles.paraContentIndexText}>{str}</Text>;
                                            } else {
                                                return <Text>{str}</Text>;
                                            }
                                        })}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                <View style={styles.videoPreviewWrapper}>
                    <VideoPreview uri={videoThumb.path} playPress={() => navigation.push("VideoPlay", { videoURI })} />
                </View>
            </ScrollView>
        </View>
    );
}

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        paddingHorizontal: 20
    },
    percentText: {
        fontSize: 38,
        fontFamily: Fonts.MontserratMedium
    },
    latePayText: {
        fontSize: 12,
        fontFamily: Fonts.MontserratRegular
    },
    videoPreviewWrapper: {
        height: 240,
        width: "100%"
    },
    contentWrapper: {
        paddingVertical: 20
    },
    contentParaWrapper: {
        marginVertical: 12
    },
    paraHeadText: {
        fontSize: 12,
        fontFamily: Fonts.MontserratSBold
    },
    paraContentWrapper: {
        marginVertical: 4
    },
    paraContentText: {
        fontSize: 10,
        fontFamily: Fonts.MontserratRegular,
        lineHeight: 14,
        marginVertical: 2
    },
    paraContentIndexText: {
        fontSize: 10,
        fontFamily: Fonts.MontserratSBold,
    },
    unorderListItemWrapper: {
        flexDirection: "row",
    },
    dotView: {
        width: 4,
        height: 4,
        backgroundColor: Colors.Black(1),
        borderRadius: 50,
        marginRight: 4,
        marginTop: 8
    }
})