import React from "react";
import { StyleSheet, View } from "react-native";
import { VictoryPie } from "victory-native";
import Colors from "../../constants/Colors";

const chartView = {
    labels: {
        fill: Colors.Black(0)
    },
}

const ProgressCircular = ({ color, content, percent }) => {
    return (
        <View style={styles.container}>
            <VictoryPie
                data={[{ y: percent, x: "0%" }, { y: 100 - percent, x: "0%" }]}
                colorScale={[color, Colors.Black(0.11)]}
                width={250}
                height={250}
                innerRadius={80}
                style={chartView}
            />
            <View style={styles.percentWrapper}>{content}</View>
        </View>
    );
}

export default ProgressCircular;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        position: "relative"
    },
    percentWrapper: {
        position: "absolute",
        alignSelf: "center",
        alignItems: "center"
    }
})