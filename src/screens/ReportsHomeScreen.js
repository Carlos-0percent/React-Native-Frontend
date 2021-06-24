import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import Colors from "../constants/Colors";
import { CreditActions } from "../redux/slices/CreditSagaSlice";
import CreditCarouselCard from "../components/CreditReports/CreditCarouselCard";
import CreditReportTable from "../components/CreditReports/CreditReportTable";
import LoaderModal from "../components/Modals/LoaderModal";
import { ScrollView } from "react-native-gesture-handler";
import LongButton from "../components/Buttons/LongButton";
import DropDownPicker from "react-native-dropdown-picker";
import { AccountsFilters, AccountTypeFilters, IsAndroid, IsTablet } from "../constants/Constants";
import Fonts from "../constants/Fonts";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";

const ReportsHomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const reportsDataFull = useSelector(state => state.credit.reports);
    const activeIndexPayData = useSelector(state => state.credit.accountPayHistory);
    const activeIndex = useSelector(state => state.credit.accountIndex);
    const carouselRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [reportsData, setReportsData] = useState([]);
    const [accountsFilter, setAccountsFilter] = useState("all");
    const [accountTypeFilter, setAccountTypeFilter] = useState("all");
    const reload = useRef(true);
    const [filterOpenA, setFilterOpenA] = useState(false);
    const [filterOpenB, setFilterOpenB] = useState(false);

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
        }, [JSON.stringify(reportsDataFull)])
    )

    const setAccountReport = (index) => {
        new Promise((resolve, reject) => {
            dispatch(CreditActions.setAccountPayHistory({ resolve, reject, accountReport: _.map(reportsData)[index].data, accountIndex: index }));
        })
            .then(() => { })
            .catch(err => {
                console.warn("Error while selecting account report ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            if (_.size(reportsDataFull) === 0) {
                setLoading(true);
            } else {
                if (_.size(reportsDataFull) > 0) {
                    setReportsData(_.map(reportsDataFull));
                }
            }
        }, [JSON.stringify(reportsDataFull)])
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

    const updateSelection = (index) => {
        setAccountReport(index);
    }

    const filterAccounts = () => {
        setLoading(true);
        let data = [];
        if (accountsFilter === "all") {
            data = _.map(reportsDataFull);
        } else {
            switch (accountsFilter) {
                case AccountsFilters[1].value:
                    data = _.filter(reportsDataFull, { accountOpen: true })
                    break;
                case AccountsFilters[2].value:
                    data = _.filter(reportsDataFull, { accountOpen: false })
                    break;
                case AccountsFilters[3].value:
                    data = _.filter(reportsDataFull, (report) => {
                        const diff = Date.now() - report.data[0].lastActivityDate;
                        if (report.accountOpen && Math.floor(diff / 1000 / 60 / 60 / 24) > 365) {
                            return report;
                        }
                    })
                    break;
                case AccountsFilters[4].value:
                    data = _.filter(reportsDataFull, { isNegative: true })
                    break;
                default:
                    data = _.map(reportsDataFull);
                    break;
            }
        }

        switch (accountTypeFilter) {
            case AccountTypeFilters[0].value:
                setReportsData(_.map(data));
                break;
            case AccountTypeFilters[1].value:
                setReportsData(_.filter(data, { accountType: _.upperCase(AccountTypeFilters[1].value) }));
                break;
            case AccountTypeFilters[2].value:
                setReportsData(_.filter(data, { accountType: _.upperCase(AccountTypeFilters[2].value) }));
                break;
            case AccountTypeFilters[3].value:
                setReportsData(_.filter(data, (report) => {
                    if (report.accountType !== _.upperCase(AccountTypeFilters[1].value) && report.accountType !== _.upperCase(AccountTypeFilters[2].value) && report.accountType !== _.upperCase(AccountTypeFilters[4].value)) {
                        return report;
                    }
                }));
                break;
            case AccountTypeFilters[4].value:
                setReportsData(_.filter(data, { accountType: _.upperCase(AccountTypeFilters[4].value) }));
                break;
            default:
                setReportsData(_.map(data));
                break;
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (_.size(reportsDataFull) > 0) {
                filterAccounts();
            }
        }, [accountsFilter, accountTypeFilter])
    )

    useFocusEffect(
        useCallback(() => {
            if (_.size(reportsData) > 0) {
                setLoading(false);
                if (reload.current) {
                    setAccountReport(0);
                    reload.current = false;
                } else {
                    setAccountReport(carouselRef.current.currentIndex);
                }
            }
        }, [JSON.stringify(reportsData)])
    )

    useFocusEffect(
        useCallback(() => {
            if (loading) {
                setTimeout(() => {
                    setLoading(false);
                }, 5000);
            }
        }, [loading])
    )

    return (
        <View style={styles.container}>
            <View style={styles.blueView}>
                <View style={styles.dropdownViewsWrapper(filterOpenA || filterOpenB)}>
                    <View style={styles.dropdownWrapper}>
                        <DropDownPicker
                            items={_.map(AccountsFilters)}
                            defaultValue={accountsFilter}
                            containerStyle={styles.dropdownContainer}
                            arrowStyle={styles.dropdownArrow}
                            style={styles.dropdownStyle}
                            dropDownStyle={styles.dropdownDropMenuStyle}
                            itemStyle={styles.dropdownItem}
                            labelStyle={styles.dropdownLabel}
                            selectedLabelStyle={styles.dropdownSelectedLabel}
                            onChangeItem={item => {
                                setAccountsFilter(item.value);
                                reload.current = true;
                            }}
                            onOpen={() => setFilterOpenA(true)}
                            onClose={() => setFilterOpenA(false)}
                        />
                    </View>
                    <View style={styles.dropdownWrapper}>
                        <DropDownPicker
                            items={_.map(AccountTypeFilters)}
                            defaultValue={accountTypeFilter}
                            containerStyle={styles.dropdownContainer}
                            arrowStyle={styles.dropdownArrow}
                            style={styles.dropdownStyle}
                            dropDownStyle={styles.dropdownDropMenuStyle}
                            itemStyle={styles.dropdownItem}
                            labelStyle={styles.dropdownLabel}
                            selectedLabelStyle={styles.dropdownSelectedLabel}
                            onChangeItem={item => {
                                setAccountTypeFilter(item.value);
                                reload.current = true;
                            }}
                            onOpen={() => setFilterOpenB(true)}
                            onClose={() => setFilterOpenB(false)}
                        />
                    </View>
                </View>
                {
                    _.size(reportsData) > 0 ?
                        <View style={styles.sliderContainer}>
                            <Carousel
                                layout="stack"
                                layoutCardOffset={IsTablet ? 240 : 120}
                                ref={carouselRef}
                                data={_.map(reportsData)}
                                renderItem={renderCard}
                                sliderWidth={scaleToWidth(100)}
                                itemWidth={IsTablet ? scaleToWidth(45) : scaleToWidth(75)}
                                inactiveSlideShift={0}
                                onSnapToItem={updateSelection}
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
                        :
                        <View style={styles.noDataContainer}>
                            <Text style={styles.noDataText}>{"No records found"}</Text>
                        </View>
                }
            </View>
            <ScrollView contentContainerStyle={styles.tableWrapper} bounces={false} showsVerticalScrollIndicator={false}>
                <CreditReportTable data={_.size(reportsData) > 0 ? _.map(reportsData)[activeIndex].data : []} />
            </ScrollView>
            <View style={styles.buttonWrapper}>
                <LongButton text="Payment History" disabled={_.size(reportsData) <= 0 || _.size(activeIndexPayData) <= 0} buttonPress={() => navigation.push("PaymentHistory")} />
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
    blueView: {
        backgroundColor: Colors.DarkBlue(1),
        paddingTop: 40,
        position: "relative"
    },
    sliderContainer: {
        paddingTop: 40,
        paddingBottom: 20,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 998
    },
    noDataContainer: {
        paddingTop: 40,
        paddingBottom: 20,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 998,
        height: 200
    },
    noDataText: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratSBold,
        color: Colors.White(1)
    },
    sliderDot: {
        width: 5,
        height: 5,
        borderRadius: 5,
        marginHorizontal: 0,
        backgroundColor: Colors.White(0.92)
    },
    tableWrapper: {
        paddingHorizontal: IsTablet ? scaleToWidth(10) : scaleToWidth(5),
        paddingVertical: scaleToWidth(5)
    },
    dropdownViewsWrapper: (open) => ({
        flexDirection: "row",
        justifyContent: IsTablet ? "flex-end" : "space-around",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 8,
        zIndex: 999,
        position: IsAndroid ? "absolute" : "relative",
        height: IsAndroid && open ? 200 : "auto",
        width: "100%"
    }),
    dropdownWrapper: {
        width: IsTablet ? "32%" : "49%",
    },
    dropdownContainer: {
        height: IsTablet ? 44.3 : 31.1,
        paddingHorizontal: scaleToWidth(2)
    },
    dropdownArrow: {
        position: "absolute",
        top: IsTablet ? 2 : 0,
        right: 0.4,
        width: IsTablet ? 20 : 16,
        height: IsTablet ? 14 : 10,
    },
    dropdownItem: {
        justifyContent: "flex-start",
        paddingHorizontal: 4,
    },
    dropdownLabel: {
        fontSize: fontSize(12),
        fontFamily: Fonts.MontserratRegular
    },
    dropdownSelectedLabel: {
        fontFamily: Fonts.MontserratMedium
    },
    dropdownStyle: {
        borderTopLeftRadius: 9,
        borderTopRightRadius: 9,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        backgroundColor: Colors.White(1),
    },
    dropdownDropMenuStyle: {
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        backgroundColor: Colors.White(1),
        marginHorizontal: scaleToWidth(2)
    },
    buttonWrapper: {
        paddingVertical: IsTablet ? scaleToWidth(2) : scaleToWidth(7),
        paddingHorizontal: IsTablet ? scaleToWidth(25) : scaleToWidth(5)
    }
})