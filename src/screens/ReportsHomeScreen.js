import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import Colors from "../constants/Colors";
import { CreditActions } from "../redux/slices/CreditSagaSlice";
import CreditCarouselCard from "../components/CreditReports/CreditCarouselCard";
import CreditReportTable from "../components/CreditReports/CreditReportTable";
import LoaderModal from "../components/Modals/LoaderModal";

const ReportsHomeScreen = () => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const reportsData = useSelector(state => state.credit.reports);
    const [activeIndex, setActiveIndex] = useState(0);
    const carouselRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const fetchReports = () => {
        new Promise((resolve, reject) => {
            dispatch(CreditActions.fetchCreditReports({ token: userToken, resolve, reject }))
        })
            .then(res => {
                // console.info(res);
            })
            .catch(err => {
                console.warn("Error while fetching credit reports ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchReports();
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            if (_.size(reportsData) === 0) {
                setLoading(true);
            } else {
                setLoading(false);
            }
        }, [_.size(reportsData)])
    )

    const renderCard = ({ item, index }) => {
        let accountNumberStrArr = _.chunk(item.accountNumber, 4);
        accountNumberStrArr = _.map(accountNumberStrArr, (digits) => _.join(digits, ""));
        const accountNumber = _.join(accountNumberStrArr, "-")
        let accountType = "";
        if (item.loanType.code === "CREDIT_CARD") {
            accountType = _.capitalize(item.loanType.description);
        } else {
            accountType = "Account";
        }
        return (
            <CreditCarouselCard
                accountName={item.accountName}
                accountType={accountType}
                accountNumber={accountNumber}
                cardKey={index}
            />
        );
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

    return (
        <View style={styles.container}>
            <View style={styles.sliderContainer}>
                <Carousel
                    layout="stack"
                    layoutCardOffset={120}
                    ref={carouselRef}
                    data={_.map(reportsData)}
                    renderItem={renderCard}
                    sliderWidth={Dimensions.get("screen").width}
                    itemWidth={Math.round(Dimensions.get("screen").width * 0.75)}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    useScrollView={true}
                    loop={true}
                    loopClonesPerSide={_.size(reportsData)}
                />
                <Pagination
                    dotsLength={_.size(reportsData)}
                    activeDotIndex={activeIndex}
                    carouselRef={carouselRef}
                    dotStyle={styles.sliderDot}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={1}
                    tappableDots={true}
                />
            </View>
            <View style={styles.tableWrapper}>
                <CreditReportTable data={_.size(reportsData) > 0 ? _.map(reportsData)[activeIndex].data : []} />
            </View>
            {renderLoaderModal()}
        </View>
    );
}

export default ReportsHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    sliderContainer: {
        backgroundColor: Colors.DarkBlue(1),
        paddingTop: 40,
        paddingBottom: 20,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    sliderDot: {
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 0,
        backgroundColor: Colors.White(0.92)
    },
    tableWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 40
    }
})