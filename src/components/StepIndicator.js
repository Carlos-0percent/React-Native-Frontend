import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import _ from "lodash";
import Colors from "../constants/Colors";

const StepIndicator = ({ steps, stepOn }) => {
    const [stepsRange, setStepsRange] = useState([]);

    useEffect(() => {
        setStepsRange(_.range(1, steps + 1));
    }, [])

    return (
        <View style={styles.container}>
            {_.map(stepsRange, step => {
                if (step === stepOn) {
                    return <View style={styles.stepOn} key={step} />;
                } else {
                    return <View style={styles.step} key={step} />;
                }
            })}
        </View>
    );
}

export default StepIndicator;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    step: {
        height: 1,
        width: 32,
        backgroundColor: Colors.Black(1),
        marginHorizontal: 2
    },
    stepOn: {
        height: 5,
        width: 32,
        backgroundColor: Colors.Black(1),
        marginHorizontal: 2
    }
})