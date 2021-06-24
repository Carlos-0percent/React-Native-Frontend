import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import { IsIOS } from "../constants/Constants";

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
        top: IsIOS ? 80 : 45,
        marginBottom: IsIOS ? 80 : 45
    }
})