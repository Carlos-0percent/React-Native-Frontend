import React, { useEffect, useState } from "react";
import { Modal, StyleSheet } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";

const LoaderModal = ({ visible, contentView, animation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setModalVisible(visible);
    }, [visible])

    return (
        <Modal visible={modalVisible} transparent animationType={animation}>
            <TouchableWithoutFeedback style={styles.container}>
                {contentView}
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default LoaderModal;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.White(0.5),
        position: "relative"
    }
})