import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import MediaControls, { PLAYER_STATES } from "react-native-media-controls";
import Video from "react-native-video";
import _ from "lodash";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import { IsIOS } from "../constants/Constants";

const VideoPlayScreen = ({ navigation }) => {
    const [uri, setURI] = useState("");
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
    const [screenType, setScreenType] = useState("content");

    useEffect(() => {
        if (navigation && navigation.dangerouslyGetState() && _.size(navigation.dangerouslyGetState().routes) > 0 && navigation.dangerouslyGetState().routes[_.size(navigation.dangerouslyGetState().routes) - 1].params) {
            setURI(navigation.dangerouslyGetState().routes[_.size(navigation.dangerouslyGetState().routes) - 1].params["videoURI"]);
        }
    }, [JSON.stringify(navigation)])

    const onSeek = (seek) => {
        videoPlayer.current.seek(seek);
    };

    const onPaused = (playerState) => {
        setPaused(!paused);
        setPlayerState(playerState);
    };

    const onReplay = () => {
        setPlayerState(PLAYER_STATES.PLAYING);
        videoPlayer.current.seek(0);
    };

    const onProgress = (data) => {
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            setCurrentTime(data.currentTime);
        }
    }

    const onLoad = (data) => {
        setDuration(data.duration);
        setIsLoading(false);
    }

    const onLoadStart = (data) => {
        setIsLoading(true);
    }

    const onEnd = () => {
        setPlayerState(PLAYER_STATES.ENDED);
    }

    const onFullScreen = () => {
        setIsFullScreen(isFullScreen);
        if (screenType === "content") {
            setScreenType("cover");
        }
        else {
            setScreenType("content");
        }
    };

    const renderToolbar = () => (
        <View />
    );

    const onSeeking = (currentTime) => {
        setCurrentTime(currentTime)
    }

    return (
        <View style={styles.container}>
            {playerState !== PLAYER_STATES.PLAYING ? <Header title="Playing Video" backIconPress={() => navigation.goBack()} /> : <></>}
            <Video
                onEnd={onEnd}
                onLoad={onLoad}
                onLoadStart={onLoadStart}
                onProgress={onProgress}
                paused={paused}
                ref={videoPlayer}
                resizeMode={IsIOS ? screenType : "cover"}
                onFullScreen={isFullScreen}
                source={{ uri }}
                style={styles.mediaPlayer}
                volume={10}
            />
            <MediaControls
                duration={duration}
                isLoading={isLoading}
                mainColor={Colors.White(0.25)}
                onFullScreen={onFullScreen}
                onPaused={onPaused}
                onReplay={onReplay}
                onSeek={onSeek}
                onSeeking={onSeeking}
                playerState={playerState}
                progress={currentTime}
                toolbar={renderToolbar()}
            />
        </View>
    );
}

export default VideoPlayScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1)
    },
    mediaPlayer: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: Colors.White(1),
        justifyContent: "center"
    },
})