import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import _ from "lodash";
import FactorLevelIndicator from "../../components/CreditFactors/FactorLevelIndicator";
import ProgressFlatBar from "../../components/CreditFactors/ProgressFlatBar";
import Colors from "../../constants/Colors";
import { CreditFactorLevels } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import VideoPreview from "../../components/VideoPreview";
import { CreditFactorLabels } from "../../constants/StringLabels";
import { generateVideoThumb } from "../../helpers/VideoHelpers";

const NewInquiriesScreen = ({ navigation }) => {
    const creditScoreFactor = useSelector(state => state.credit.factor);
    const [inquiriesCount, setInquiriesCount] = useState(0);
    const [percent, setPercent] = useState(0);
    const [videoURI, setVideoURI] = useState("");
    const [videoThumb, setVideoThumb] = useState({});

    const calcPercent = (count) => {
        let percentage = 0;
        if (count <= 0) {
            percentage = 100;
        } else if (count >= 9) {
            percentage = 5;
        } else {
            percentage = ((9 - count) / 9) * 100;
        }
        return percentage;
    }

    useEffect(() => {
        if (_.size(creditScoreFactor) > 0) {
            const { data, video } = creditScoreFactor[4];
            setInquiriesCount(data["totalInquires"]);
            setPercent(calcPercent(data["totalInquires"]));
            setVideoURI(video);
            generateVideoThumb(video, (res) => setVideoThumb(res));
        }
    }, [JSON.stringify(creditScoreFactor)])

    const getProgressColor = () => {
        if (inquiriesCount <= 1) {
            return Colors.CreditFactorDarkGreen;
        } else if (inquiriesCount <= 3) {
            return Colors.CreditFactorLightGreen;
        } else if (inquiriesCount <= 5) {
            return Colors.CreditFactorYellow;
        } else if (inquiriesCount <= 7) {
            return Colors.CreditFactorOrange;
        } else if (inquiriesCount >= 9) {
            return Colors.CreditFactorRed;
        } else {
            return Colors.CreditFactorRed;
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
                <ProgressFlatBar
                    color={getProgressColor()}
                    content={
                        <Text style={styles.inquiriesCountText}>{inquiriesCount}</Text>
                    }
                    percent={percent}
                />
                <FactorLevelIndicator level={CreditFactorLevels["New_inquires"]} />
                <View style={styles.contentWrapper}>
                    <View style={styles.contentParaWrapper}>
                        <Text style={styles.paraHeadText}>{"Your credit card balances are in a healthy range"}</Text>
                        <View style={styles.paraContentWrapper}>
                            <Text style={styles.paraContentText}>{CreditFactorLabels["Credit_Usage_Recommended"]}</Text>
                        </View>
                    </View>
                    <View style={styles.contentParaWrapper}>
                        <Text style={styles.paraHeadText}>{"What to know"}</Text>
                        <View style={styles.paraContentWrapper}>
                            {_.map(CreditFactorLabels["What_To_Know"]["2"], (str, index) => (
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
                            {_.map(CreditFactorLabels["How_Circulated"]["2"], (str) => (
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

export default NewInquiriesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        paddingHorizontal: 20
    },
    inquiriesCountText: {
        fontSize: 38,
        fontFamily: Fonts.MontserratMedium
    },
    videoPreviewWrapper: {
        height: 268,
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