import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Headers/Header";
import LoaderModal from "../components/Modals/LoaderModal";
import Colors from "../constants/Colors";
import { IsIOS } from "../constants/Constants";
import { SettingsActions } from "../redux/slices/SettingsSagaSlice";

const TermsAndConditionsScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const uri = useSelector(state => state.settings.termsPolicyURI);
    const [loading, setLoading] = useState(false);

    const fetchTermsPolicy = () => {
        new Promise((resolve, reject) => {
            dispatch(SettingsActions.fetchTermsPolicy({ resolve, reject, token: userToken }))
        })
            .then(res => { })
            .catch(err => {
                console.warn("Error while fetching terms & conditions ---->", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchTermsPolicy();
        }, [uri])
    )

    useEffect(() => {
        if (uri) {
            if (loading) {
                setLoading(false);
            }
        } else {
            if (!loading) {
                setLoading(true);
            }
        }
    }, [uri])

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
            <Header title={"Terms & Conditions"} backIconPress={() => navigation.goBack()} />
            <Pdf source={{ uri }} style={styles.pdfContainer} />
            {renderLoaderModal()}
        </View>
    );
}

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    pdfContainer: {
        flex: 1,
        top: IsIOS ? 40 : 22.5,
        marginBottom: IsIOS ? 40 : 24,
    },
})