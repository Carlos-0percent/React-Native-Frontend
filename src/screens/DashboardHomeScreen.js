import React, { useCallback, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import _ from "lodash";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import MediumButton from "../components/Buttons/MediumButton";
import CustomModal from "../components/Modals/CustomModal";
import RadioInput from "../components/Inputs/RadioInput";
import StepIndicator from "../components/StepIndicator";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { useDispatch, useSelector } from "react-redux";
import { QuestionnaireActions } from "../redux/slices/QuestionnaireSagaSlice";
import LoaderModal from "../components/Modals/LoaderModal";
import { UserActions } from "../redux/slices/UserSagaSlice";
import DashboardHeader from "../components/Headers/DashboardHeader";
import CreditScoreGauge from "../components/CreditCharts/CreditScoreGauge";
import { CreditActions } from "../redux/slices/CreditSagaSlice";
import CreditScoreLineChart from "../components/CreditCharts/CreditScoreLineChart";
import CreditFactorButton from "../components/Buttons/CreditFactorButton";
import { ForwardArrowGoldIcon, MessagingIcon } from "../assets";
import { CreditScoreLevel, EmailValidator } from "../constants/Constants";
import Toast from "react-native-toast-message";
import { CALENDLY_URL, ZERO_REPAIR_URL } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import VideoPreview from "../components/VideoPreview";
import { generateVideoThumb } from "../helpers/VideoHelpers";

const floatingCustomLabel = {
    colorBlurred: Colors.Black(1),
    colorFocused: Colors.Black(1)
}

const DashboardHomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const quesCompleted = useSelector(state => state.user.data.questionnaire_submitted);
    const userData = useSelector(state => state.user.data);
    const creditScoreData = useSelector(state => state.credit.data);
    const creditScoreHistory = useSelector(state => state.credit.history);
    const creditInfo = useSelector(state => state.credit.info);
    const questions = useSelector(state => state.questionnaire.data);
    const [loading, setLoading] = useState(false);
    const [quesModalVisible, setQuesModalVisible] = useState(true);
    const [quesOn, setQuesOn] = useState(1);
    const [ques4Ans, setQues4Ans] = useState();
    const [ques5Ans, setQues5Ans] = useState();
    const [ques1Ans1, setQues1Ans1] = useState(userData.legal_name ? userData.legal_name : "");
    const [ques1Ans2, setQues1Ans2] = useState(userData.email ? userData.email : "");
    const [ques2Ans, setQues2Ans] = useState("");
    const [ques3Ans1, setQues3Ans1] = useState("");
    const [ques3Ans2, setQues3Ans2] = useState("");
    const [ques4AnsText, setQues4AnsText] = useState("");
    const [ques5AnsText, setQues5AnsText] = useState("");
    const [ques6Ans, setQues6Ans] = useState("");
    const [emailErr, setEmailErr] = useState(false);
    const [emailErrText, setEmailErrText] = useState("");
    const [creditScoreHeadVisible, setCreditScoreHeadVisible] = useState(false);
    const [videoThumb, setVideoThumb] = useState({});

    const fetchQues = () => {
        new Promise((resolve, reject) => {
            dispatch(QuestionnaireActions.fetchQuestionnaire({ token: userToken, resolve, reject }));
        })
            .then(res => {
                if (res && userData.status === 3) {
                    setQuesModalVisible(true);
                }
            })
            .catch(err => {
                console.warn("Error while fetching questionnaire ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            if (quesCompleted === 0) {
                fetchQues();
            } else {
                setQuesModalVisible(false);
            }
        }, [JSON.stringify(questions)])
    )

    const fetchCreditScore = () => {
        new Promise((resolve, reject) => {
            dispatch(CreditActions.fetchCreditScore({ token: userToken, resolve, reject }))
        })
            .then(res => {
                // console.info(res) // to be removed, for dev purpose only
            })
            .catch(err => {
                console.warn("Error while fetching credit score ---->", err);
            })
    }

    const fetchCreditScoreHistory = () => {
        new Promise((resolve, reject) => {
            dispatch(CreditActions.fetchCreditScoreHistory({ token: userToken, resolve, reject }))
        })
            .then(res => {
                // console.info(res) // to be removed, for dev purpose only
            })
            .catch(err => {
                console.warn("Error while fetching credit score history ---->", err);
            })
    }

    const fetchCreditScoreFactor = () => {
        new Promise((resolve, reject) => {
            dispatch(CreditActions.fetchCreditScoreFactor({ token: userToken, resolve, reject }))
        })
            .then(res => {
                // console.info(res) // to be removed, for dev purpose only
            })
            .catch(err => {
                console.warn("Error while fetching credit score factor ---->", err);
            })
    }

    const fetchCreditInfoContent = () => {
        new Promise((resolve, reject) => {
            dispatch(CreditActions.fetchCreditInfoContent({ token: userToken, resolve, reject }))
        })
            .then(res => {
                // console.info(res) // to be removed, for dev purpose only
                generateVideoThumb(res.video, (res) => setVideoThumb(res));
            })
            .catch(err => {
                console.warn("Error while fetching credit score factor ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            if (userData.status === 3) {
                fetchCreditScore();
                fetchCreditScoreHistory();
                fetchCreditScoreFactor();
                fetchCreditInfoContent();
            }
        }, [JSON.stringify(userData)])
    )

    useFocusEffect(
        useCallback(() => {
            if (userData.status === 3) {
                if (!creditScoreData.score || _.size(creditScoreHistory) === 0 || !creditInfo.content) {
                    setLoading(true);
                } else {
                    setLoading(false);
                }
            }
        }, [JSON.stringify(creditScoreData), _.size(creditScoreHistory), JSON.stringify(creditInfo)])
    )

    const submitQues = () => {
        if (quesOn === 6) {
            Toast.show({
                type: "info",
                text1: "Analysing your answers!",
                text2: "Please wait ...",
                autoHide: false
            })

            const answers = [
                { question: 1, answer: ques1Ans1 },
                { question: 2, answer: ques1Ans2 },
                { question: 3, answer: ques4AnsText },
                { question: 4, answer: ques2Ans },
                { question: 5, answer: ques3Ans1 },
                { question: 6, answer: ques3Ans2 },
                { question: 7, answer: ques5AnsText },
                { question: 8, answer: ques6Ans },
            ]

            new Promise((resolve, reject) => {
                setLoading(true);
                dispatch(QuestionnaireActions.submitAnswers({ answers: { answers }, token: userToken, resolve, reject }));
            })
                .then(res => {
                    if (res) {
                        setQuesModalVisible(false);
                        new Promise((resolve, reject) => {
                            dispatch(UserActions.fetchUser({ token: userToken, resolve, reject }));
                        })
                            .then(res => {
                                setLoading(false);
                                Toast.hide();
                                const creditScoreType = creditScoreData.type;
                                if (creditScoreType === CreditScoreLevel[0].type) {
                                    navigation.push("Browse", { uri: ZERO_REPAIR_URL, title: "0percentrepair.com" });
                                }
                                if (creditScoreType === CreditScoreLevel[4].type) {
                                    navigation.push("Browse", { uri: CALENDLY_URL, title: "Book Appointment" });
                                }
                            })
                            .catch(err => {
                                setLoading(false);
                                console.warn("Error while fetching user details ---->", err);
                            })
                    }
                })
                .catch(err => {
                    console.warn("Error while submitting answers ---->", err);
                    setLoading(false);
                })
        } else {
            setQuesOn(quesOn + 1);
        }
    }

    const handleQues4 = (ans, ind) => {
        setQues4Ans(ind);
        setQues4AnsText(ans);
    }

    const handleQues5 = (ans, ind) => {
        setQues5Ans(ind);
        setQues5AnsText(ans);
    }

    const handleQues1Ans2 = (email) => {
        setQues1Ans2(email);
        const regex = new RegExp(EmailValidator);
        if (regex.test(email) || email === "") {
            if (emailErr) {
                setEmailErr(false);
            }
        } else {
            setEmailErr(true);
            setEmailErrText("Invalid email");
        }
        return true;
    }

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

    const renderQuestionModal = () => {
        return (
            <CustomModal
                visible={quesModalVisible}
                contentView={
                    <>
                        <View style={styles.stepIndicatorWrapper}>
                            <StepIndicator steps={6} stepOn={quesOn} />
                        </View>
                        <TouchableWithoutFeedback style={styles.modalContentWrapper} activeOpacity={1}>
                            {
                                quesOn === 1 && <>
                                    <Text style={styles.quesText}>{_.size(questions) > 0 ? questions[0].title : ""}</Text>
                                    <FloatingLabelInput
                                        staticLabel={true}
                                        hint={"Answer here"}
                                        hintTextColor={Colors.Black(1)}
                                        containerStyles={styles.floatingInputContainer}
                                        labelStyles={styles.floatingLabel}
                                        customLabelStyles={floatingCustomLabel}
                                        value={ques1Ans1}
                                        onChangeText={value => setQues1Ans1(value)}
                                    />
                                    <Text style={styles.quesText}>{_.size(questions) > 0 ? questions[1].title : ""}</Text>
                                    <View style={styles.longInputWrapper}>
                                        <FloatingLabelInput
                                            staticLabel={true}
                                            hint={"Answer here"}
                                            hintTextColor={Colors.Black(1)}
                                            containerStyles={styles.floatingInputContainer}
                                            labelStyles={styles.floatingLabel}
                                            customLabelStyles={floatingCustomLabel}
                                            value={ques1Ans2}
                                            onChangeText={handleQues1Ans2}
                                        />
                                        <Text style={styles.errorText}>{emailErr ? emailErrText : ""}</Text>
                                    </View>
                                    <View style={styles.quesModalButton}>
                                        <MediumButton text={"Next"} disabled={!ques1Ans1 || !ques1Ans2 || emailErr} buttonPress={submitQues} />
                                    </View>
                                </>
                            }
                            {
                                quesOn === 2 && <>
                                    <Text style={styles.quesText}>{_.size(questions) > 0 ? questions[3].title : ""}</Text>
                                    <FloatingLabelInput
                                        staticLabel={true}
                                        hint={"Answer here"}
                                        hintTextColor={Colors.Black(1)}
                                        containerStyles={styles.floatingInputContainer}
                                        labelStyles={styles.floatingLabel}
                                        customLabelStyles={floatingCustomLabel}
                                        value={ques2Ans}
                                        onChangeText={value => setQues2Ans(value)}
                                    />
                                    <View style={styles.quesModalButton}>
                                        <MediumButton text={"Next"} disabled={!ques2Ans} buttonPress={submitQues} />
                                    </View>
                                </>
                            }
                            {
                                quesOn === 3 && <>
                                    <Text style={styles.quesText}>{_.size(questions) > 0 ? questions[4].title : ""}</Text>
                                    <FloatingLabelInput
                                        staticLabel={true}
                                        hint={"Answer here"}
                                        hintTextColor={Colors.Black(1)}
                                        containerStyles={styles.floatingInputContainer}
                                        labelStyles={styles.floatingLabel}
                                        customLabelStyles={floatingCustomLabel}
                                        value={ques3Ans1}
                                        onChangeText={value => setQues3Ans1(value)}
                                    />
                                    <Text style={styles.quesText}>{_.size(questions) > 0 ? questions[5].title : ""}</Text>
                                    <FloatingLabelInput
                                        staticLabel={true}
                                        hint={"Answer here"}
                                        hintTextColor={Colors.Black(1)}
                                        containerStyles={styles.floatingInputContainer}
                                        labelStyles={styles.floatingLabel}
                                        customLabelStyles={floatingCustomLabel}
                                        value={ques3Ans2}
                                        onChangeText={value => setQues3Ans2(value)}
                                    />
                                    <View style={styles.quesModalButton}>
                                        <MediumButton text={"Next"} disabled={!ques3Ans1 || !ques3Ans2} buttonPress={submitQues} />
                                    </View>
                                </>
                            }
                            {
                                quesOn === 4 && <>
                                    <Text style={styles.quesText}>{_.size(questions) > 0 ? questions[2].title : ""}</Text>
                                    <View style={styles.radioInputListWrapper}>
                                        {
                                            _.size(questions) > 0
                                                ?
                                                _.map(_.split(questions[2].answer_options, ", "), (ans, index) => (
                                                    <View style={styles.radioInputWrapper} key={`ques-4-${index + 1}`}>
                                                        <RadioInput checked={ques4Ans === index + 1} radioPress={() => handleQues4(ans, index + 1)} />
                                                        <Text style={styles.radioInputText}>{ans}</Text>
                                                    </View>
                                                ))
                                                :
                                                <></>
                                        }
                                    </View>
                                    <View style={styles.quesModalButton}>
                                        <MediumButton text={"Next"} disabled={!ques4AnsText} buttonPress={submitQues} />
                                    </View>
                                </>
                            }
                            {
                                quesOn === 5 && <>
                                    <Text style={styles.quesText}>{_.size(questions) > 0 ? questions[6].title : ""}</Text>
                                    <View style={styles.radioInputListWrapper}>
                                        {
                                            _.size(questions) > 0
                                                ?
                                                _.map(_.split(questions[6].answer_options, ", "), (ans, index) => (
                                                    <View style={styles.radioInputWrapper} key={`ques-5-${index + 1}`}>
                                                        <RadioInput checked={ques5Ans === index + 1} radioPress={() => handleQues5(ans, index + 1)} />
                                                        <Text style={styles.radioInputText}>{ans}</Text>
                                                    </View>
                                                ))
                                                :
                                                <></>
                                        }
                                    </View>
                                    <View style={styles.quesModalButton}>
                                        <MediumButton text={"Next"} disabled={!ques5AnsText} buttonPress={submitQues} />
                                    </View>
                                </>
                            }
                            {
                                quesOn === 6 && <>
                                    <Text style={styles.quesText}>{_.size(questions) > 0 ? questions[7].title : ""}</Text>
                                    <FloatingLabelInput
                                        staticLabel={true}
                                        hint={"Answer here"}
                                        hintTextColor={Colors.Black(1)}
                                        containerStyles={styles.floatingInputContainer}
                                        labelStyles={styles.floatingLabel}
                                        customLabelStyles={floatingCustomLabel}
                                        value={ques6Ans}
                                        onChangeText={value => setQues6Ans(value)}
                                    />
                                    <View style={styles.quesModalButton}>
                                        <MediumButton text={"Submit"} disabled={!ques6Ans} buttonPress={submitQues} />
                                    </View>
                                </>
                            }
                        </TouchableWithoutFeedback>
                    </>
                }
                animation="fade"
            />
        );
    }

    const moveToDetailView = (tab) => {
        Toast.show({
            type: "info",
            text1: "Loading data!",
            text2: "Please wait ...",
            autoHide: true,
            visibilityTime: 5000
        })
        navigation.navigate("CreditFactors", { tabOn: tab });
    }

    const handleOnScroll = (e) => {
        if (e.nativeEvent.contentOffset && e.nativeEvent.contentOffset.y >= 120 && !creditScoreHeadVisible) {
            setCreditScoreHeadVisible(true);
        }
        if (e.nativeEvent.contentOffset && e.nativeEvent.contentOffset.y < 120 && creditScoreHeadVisible) {
            setCreditScoreHeadVisible(false);
        }
    }

    const getScoreTypeColor = () => {
        const creditScoreType = creditScoreData.type;
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
            <DashboardHeader user={_.split(userData.legal_name, " ")[0]} settingsPress={() => navigation.push("Settings")} />
            {creditScoreHeadVisible ?
                <View style={styles.creditScroreHeadWrapper}>
                    <Text style={styles.creditScroreHeadText}>{"Your credit score is"}</Text>
                    <View style={styles.creditScroreHeadScoreTextWrapper(getScoreTypeColor())}>
                        <Text style={styles.creditScroreHeadScoreText}>{creditScoreData.score}</Text>
                    </View>
                </View>
                : <></>}
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false} onScrollEndDrag={handleOnScroll}>
                <CreditScoreGauge creditScore={creditScoreData.score} creditScoreType={creditScoreData.type} />
                <CreditScoreLineChart graphData={creditScoreHistory} />
                <Text style={styles.creditFactText}>{"Credit Factor"}</Text>
                <CreditFactorButton title="Payment History" percent="35%" buttonPress={() => moveToDetailView(0)} />
                <CreditFactorButton title="Credit Utilization History" percent="30%" buttonPress={() => moveToDetailView(1)} />
                <CreditFactorButton title="Age of credit" percent="15%" buttonPress={() => moveToDetailView(2)} />
                <CreditFactorButton title="Total Account Mix" percent="10%" buttonPress={() => moveToDetailView(3)} />
                <CreditFactorButton title="New Inquiries" percent="10%" buttonPress={() => moveToDetailView(4)} />
                <View style={styles.creditFactorLowerButtonsWrapper}>
                    <View style={styles.creditFactorLowerButton}>
                        <TouchableWithoutFeedback onPress={() => navigation.push("Sub850Challange")}>
                            <Text style={styles.creditFactorLowerButtonTitleText}>{"Subscribe for 850 Credit Challenge"}</Text>
                            <View style={styles.knowMoreTextWrapper}>
                                <Text style={styles.knowMoreText}>{"Know more"}</Text>
                                <ForwardArrowGoldIcon width={5} height={7} />
                            </View>
                            <Text style={styles.creditFactorLowerButtonContentText} numberOfLines={6}>{creditInfo.content ? creditInfo.content : ""}</Text>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.creditFactorLowerButton}>
                        <Text style={styles.creditFactorLowerButtonTitleText}>{"Get your funding plan"}</Text>
                        <View style={styles.videoPreviewWrapper}>
                            <VideoPreview
                                uri={videoThumb.path}
                                iconSize={24}
                                containerPadding={0}
                                playPress={() => navigation.push("VideoPlay", { videoURI: creditInfo.video })} />
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.zenButton}>
                <TouchableWithoutFeedback onPress={() => console.info("Zen Desk Open")}>
                    <MessagingIcon width={71} height={73} />
                </TouchableWithoutFeedback>
            </View>
            {renderQuestionModal()}
            {renderLoaderModal()}
        </View>
    );
}

export default DashboardHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    modalContentWrapper: {
        backgroundColor: Colors.White(1),
        width: "80%",
        borderWidth: 0.5,
        borderColor: Colors.Black(1),
        borderRadius: 7,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 30,
        shadowColor: Colors.Black(0.11),
        shadowOffset: {
            width: 11,
            height: 11
        },
        shadowRadius: 33,
        shadowOpacity: 1,
        elevation: 5
    },
    floatingInputContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.Black(1),
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: 8,
        zIndex: 0
    },
    floatingLabel: {
        top: 10,
        left: 0,
        fontSize: 12,
        fontFamily: Fonts.MontserratRegular,
    },
    longInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    errorText: {
        position: "absolute",
        right: 0,
        top: 40,
        color: Colors.Red,
        fontSize: 9,
        fontFamily: Fonts.MontserratRegular,
    },
    quesText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratMedium,
        marginTop: 30,
        lineHeight: 18.6
    },
    radioInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4
    },
    radioInputText: {
        marginLeft: 6,
        fontSize: 14,
        fontFamily: Fonts.MontserratMedium
    },
    quesModalButton: {
        flexDirection: "row",
        marginVertical: 20,
        justifyContent: "center",
        width: "100%"
    },
    stepIndicatorWrapper: {
        position: "absolute",
        alignSelf: "center",
        bottom: 140,
    },
    creditFactText: {
        fontSize: 14,
        fontFamily: Fonts.MontserratSBold,
        marginHorizontal: 20,
        marginVertical: 12
    },
    zenButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        shadowColor: Colors.Black(0.25),
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 5
    },
    scrollContainer: {
        flexDirection: "column",
        bottom: 78
    },
    creditScroreHeadWrapper: {
        position: "absolute",
        top: Platform.OS === "ios" ? 80 : 45,
        backgroundColor: Colors.White(1),
        zIndex: 9999,
        width: "100%",
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    creditScroreHeadText: {
        fontSize: 12,
        fontFamily: Fonts.MontserratRegular,
        marginRight: 8
    },
    creditScroreHeadScoreTextWrapper: (backgroundColor) => ({
        backgroundColor,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 7,
        justifyContent: "center",
        alignItems: "center"
    }),
    creditScroreHeadScoreText: {
        fontSize: 12,
        fontFamily: Fonts.MontserratRegular,
        color: Colors.White(1)
    },
    creditFactorLowerButtonsWrapper: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 4,
        justifyContent: "space-between",
    },
    creditFactorLowerButton: {
        borderWidth: 0.5,
        borderRadius: 7,
        width: "49%",
        paddingHorizontal: 16,
        paddingVertical: 10
    },
    creditFactorLowerButtonTitleText: {
        fontSize: 12,
        fontFamily: Fonts.MontserratSBold
    },
    knowMoreTextWrapper: {
        marginVertical: 4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: 80
    },
    knowMoreText: {
        fontSize: 12,
        fontFamily: Fonts.MontserratSBold,
        color: Colors.GoldYellowDark
    },
    creditFactorLowerButtonContentText: {
        fontSize: 9,
        fontFamily: Fonts.MontserratLight
    },
    videoPreviewWrapper: {
        height: 77,
        width: "100%",
        marginTop: 16
    },
    radioInputListWrapper: {
        marginVertical: 30
    }
})