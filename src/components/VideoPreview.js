import React from "react";
import { Image, StyleSheet, TouchableOpacity as NativeTouchableOpacity, View } from "react-native";
import { TouchableOpacity as GHTouchableOpacity } from "react-native-gesture-handler";
import { PlayCircleIcon } from "../assets";
import Colors from "../constants/Colors";
import { IsIOS } from "../constants/Constants";

const TouchableOpacity = IsIOS ? GHTouchableOpacity : NativeTouchableOpacity;

const VideoPreview = ({ uri, playPress, iconSize, containerPadding }) => {
    return (
        <View style={styles.container(containerPadding)}>
            {uri ?
                <View style={styles.blankView}>
                    <Image source={{ uri }} style={styles.previewImage} />
                </View>
                :
                <View style={styles.blankView} />}
            <View style={styles.playIcon}>
                <TouchableOpacity onPress={playPress}>
                    <PlayCircleIcon width={iconSize ? iconSize : 74} height={iconSize ? iconSize : 74} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default VideoPreview;

const styles = StyleSheet.create({
    container: (padding) => ({
        width: "100%",
        height: "100%",
        padding: padding === 0 || padding ? padding : 40,
        position: "relative",
        justifyContent: "center"
    }),
    blankView: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.Black(0.25)
    },
    previewImage: {
        width: "100%",
        height: "100%",
    },
    playIcon: {
        position: "absolute",
        alignSelf: "center",
        backgroundColor: Colors.White(0.5),
        borderRadius: 50
    }
})