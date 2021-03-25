import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";

const BrowseScreen = ({ navigation }) => {
    const [uri] = useState(navigation.dangerouslyGetState().routes[1].params["uri"]);
    const [title] = useState(navigation.dangerouslyGetState().routes[1].params["title"]);
    return (
        <View style={styles.container}>
            <Header title={title} backIconPress={() => navigation.goBack()} />
            <WebView source={{ uri }} style={styles.webContainer} />
        </View>
    );
}

export default BrowseScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    webContainer: {
        top: Platform.OS === "ios" ? 80 : 45,
        marginBottom: Platform.OS === "ios" ? 80 : 45
    }
})