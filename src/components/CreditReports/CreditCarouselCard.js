import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../constants/Colors";
import { IsIOS, IsTablet } from "../../constants/Constants";
import Fonts from "../../constants/Fonts";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";

const CreditCarouselCard = ({ accountName, accountType, accountNumber, cardKey }) => {
    return (
        <View style={styles.container} key={cardKey}>
            <LinearGradient colors={[Colors.White(0.4), Colors.White(0)]} useAngle={true} angle={IsIOS ? 270 : 90} style={styles.cardWrapper}>
                <Text style={styles.accountNameText}>{accountName}</Text>
                <Text style={styles.accountTypeText}>{`${accountType} no.`}</Text>
                <Text style={styles.accountNumText}>{accountNumber}</Text>
            </LinearGradient>
        </View>
    );
}

export default CreditCarouselCard;

const styles = StyleSheet.create({
    container: {
        width: IsTablet ? scaleToWidth(45) : scaleToWidth(75),
        height: IsTablet ? scaleToWidth(35) : scaleToWidth(45),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    cardWrapper: {
        backgroundColor: Colors.DarkBlue(0.90),
        width: "100%",
        borderWidth: 0.5,
        borderColor: Colors.White(1),
        borderRadius: 21.6,
        padding: 20,
        shadowColor: Colors.White(0.65),
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    accountNameText: {
        fontSize: fontSize(19.7),
        fontFamily: Fonts.MontserratRegular,
        color: Colors.White(1)
    },
    accountTypeText: {
        fontSize: fontSize(10),
        fontFamily: Fonts.MontserratRegular,
        color: Colors.White(1),
        letterSpacing: 0.35,
        marginTop: 16,
        marginBottom: 8,
    },
    accountNumText: {
        fontSize: fontSize(19.5),
        fontFamily: Fonts.MontserratRegular,
        color: Colors.White(1),
        letterSpacing: 2.82,
    }
})