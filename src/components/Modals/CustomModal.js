import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, TouchableWithoutFeedback as NativeTouchableWithoutFeedback, View } from "react-native";
import { TouchableWithoutFeedback as GHTouchableWithoutFeedback } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import { IsIOS } from "../../constants/Constants";

const TouchableWithoutFeedback = IsIOS ? GHTouchableWithoutFeedback : NativeTouchableWithoutFeedback;

const CustomModal = ({ visible, closeModal, contentView, animation }) => {
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setModalVisible(visible);
    }, [visible])

    return (
        <Modal visible={modalVisible} transparent animationType={animation}>
            <TouchableWithoutFeedback style={styles.container} onPress={closeModal}>
                <View style={styles.container}>
                    {contentView}
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

export default CustomModal;

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