import React from "react";
import StripeCheckout from "react-native-stripe-checkout-webview";
import { STRIPE_PUBLIC_KEY } from "@env";
import { useSelector } from "react-redux";
import { StyleSheet, View } from "react-native";
import Colors from "../constants/Colors";
import { IsIOS } from "../constants/Constants";

const StripePurchaseScreen = ({ navigation }) => {
    const sessionId = useSelector(state => state.subscriptions.sessionId);

    return (
        <View style={styles.container}>
            <View style={styles.webContainer}>
                <StripeCheckout
                    stripePublicKey={STRIPE_PUBLIC_KEY}
                    checkoutSessionInput={{ sessionId }}
                    onSuccess={() => navigation.goBack()}
                    onCancel={() => navigation.goBack()}
                    onLoadingComplete={() => console.info("Loading Complete")}
                />
            </View>
        </View>
    );
}

export default StripePurchaseScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    webContainer: {
        flex: 1,
        justifyContent: "center",
        top: IsIOS ? 40 : 0,
        marginBottom: IsIOS ? 80 : 0
    }
})