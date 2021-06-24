import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import _ from "lodash";
import Header from "../components/Headers/Header";
import LoaderModal from "../components/Modals/LoaderModal";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import { useFocusEffect } from "@react-navigation/native";
import { UserActions } from "../redux/slices/UserSagaSlice";
import { useDispatch, useSelector } from "react-redux";
import { IsIOS, IsTablet } from "../constants/Constants";
import { fontSize, scaleToWidth } from "../helpers/ContentHelpers";

const NotificationsScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const notificationsData = useSelector(state => state.user.notifications);

    const fetchNotifications = () => {
        new Promise((resolve, reject) => {
            dispatch(UserActions.fetchNotifications({ token: userToken, resolve, reject }))
        })
            .then(res => {
                // console.info(res);
            })
            .catch(err => {
                console.warn("Error while fetching notifications ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [JSON.stringify(notificationsData)])
    )

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

    useFocusEffect(
        useCallback(() => {
            if (_.size(notificationsData) > 0) {
                if (loading) {
                    setLoading(false);
                }
            } else {
                if (!loading) {
                    setLoading(true);
                }
            }
        }, [JSON.stringify(notificationsData)])
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
            <Header title={"Notifications"} backIconPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false}>
                {
                    _.map(notificationsData, (notification, index) => (
                        <View style={styles.notificationTileView} key={index}>
                            <Text style={styles.notificationText}><Text style={styles.notificationTitleText}>{notification.title}</Text> - {notification.description}</Text>
                            <View style={styles.notificationDateWrapper}>
                                <Text style={styles.notificationDateText}>{notification.date}</Text>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
            {renderLoaderModal()}
        </View>
    );
}

export default NotificationsScreen;

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
    notificationTileView: {
        paddingHorizontal: scaleToWidth(2),
        paddingVertical: scaleToWidth(2),
        borderWidth: 0.5,
        borderColor: Colors.Black(0.65),
        borderRadius: 7,
        marginHorizontal: IsTablet ? 30 : 20,
        marginVertical: 5.5
    },
    notificationText: {
        fontSize: fontSize(11),
        fontFamily: Fonts.MontserratRegular,
        lineHeight: IsTablet ? 18.8 : 13.8
    },
    notificationTitleText: {
        fontFamily: Fonts.MontserratMedium,
    },
    notificationDateWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    notificationDateText: {
        fontSize: fontSize(9),
        fontFamily: Fonts.MontserratRegular,
    }
})