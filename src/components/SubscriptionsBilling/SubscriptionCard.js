import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import _ from "lodash";
import Fonts from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import LinearGradient from "react-native-linear-gradient";
import { IsTablet, SubscriptionPlans } from "../../constants/Constants";
import { fontSize, scaleToWidth } from "../../helpers/ContentHelpers";

const SubscriptionCard = ({ type, cost, description, cardKey }) => {
    const [cardGradients, setCardGradients] = useState([Colors.PlansGold, Colors.PlansLightGold]);
    const [cardCostGradients, setCardCostGradients] = useState([Colors.PlansGold, Colors.PlansLightGold]);
    const [cardBgColor, setCardBgColor] = useState("");
    const [cardTitle, setCardTitle] = useState("");
    const [cardCost, setCardCost] = useState(0);

    useEffect(() => {
        const cardGradientsFill = [];
        const cardCostGradientsFill = [];

        switch (type) {
            case SubscriptionPlans[1].type:
                cardGradientsFill.push(Colors.Black(0.75));
                cardGradientsFill.push(Colors.Black(0.55));
                setCardGradients(_.map(cardGradientsFill));
                cardCostGradientsFill.push(Colors.Black(0.35));
                cardCostGradientsFill.push(Colors.Black(0.05));
                setCardCostGradients(_.map(cardCostGradientsFill));
                setCardBgColor(Colors.White(1));
                setCardTitle(SubscriptionPlans[1].name);
                setCardCost(_.round(cost / 12, 2));
                break;
            case SubscriptionPlans[0].type:
                cardGradientsFill.push(Colors.PlansGold);
                cardGradientsFill.push(Colors.PlansLightGold);
                setCardGradients(_.map(cardGradientsFill));
                cardCostGradientsFill.push(Colors.PlansGold);
                cardCostGradientsFill.push(Colors.PlansLightGold);
                setCardCostGradients(_.map(cardCostGradientsFill));
                setCardBgColor(Colors.White(1));
                setCardTitle(SubscriptionPlans[0].name);
                setCardCost(cost);
                break;
            default:
                cardGradientsFill.push(Colors.PlansGold);
                cardGradientsFill.push(Colors.PlansLightGold);
                setCardGradients(_.map(cardGradientsFill));
                cardCostGradientsFill.push(Colors.PlansGold);
                cardCostGradientsFill.push(Colors.PlansLightGold);
                setCardCostGradients(_.map(cardCostGradientsFill));
                setCardBgColor(Colors.White(1));
                setCardTitle(SubscriptionPlans[0].name);
                setCardCost(cost);
                break;
        }
    }, [type, cost])

    return (
        <View style={styles.container} key={cardKey}>
            <LinearGradient colors={_.map(cardGradients)} style={styles.cardWrapper(cardBgColor)}>
                <View style={styles.titleWrapper}>
                    <Text style={styles.titleText}>{cardTitle}</Text>
                </View>
                <View style={styles.contentWrapper}>
                    {
                        _.map(description, (text, index) => (
                            <View style={styles.listItemView} key={index}>
                                <View style={styles.dotView} />
                                <Text style={styles.contentText}>{text}</Text>
                            </View>
                        ))
                    }
                </View>
                <LinearGradient colors={_.map(cardCostGradients)} style={styles.costWrapper}>
                    <Text style={styles.costText}>{`$${cardCost}/month`}</Text>
                </LinearGradient>
            </LinearGradient>
        </View>
    );
}

export default SubscriptionCard;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    },
    cardWrapper: (backgroundColor) => ({
        width: IsTablet ? "60%" : "80%",
        backgroundColor
    }),
    titleWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: scaleToWidth(5)
    },
    titleText: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratBold,
        color: Colors.White(1)
    },
    contentWrapper: {
        paddingHorizontal: scaleToWidth(5),
        paddingBottom: 120,
    },
    contentText: {
        fontSize: fontSize(12),
        fontFamily: Fonts.MontserratRegular,
        color: Colors.White(1),
    },
    costWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: scaleToWidth(4),
    },
    costText: {
        fontSize: fontSize(14),
        fontFamily: Fonts.MontserratRegular,
        color: Colors.White(1)
    },
    listItemView: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: scaleToWidth(0.4)
    },
    dotView: {
        width: 4,
        height: 4,
        backgroundColor: Colors.White(1),
        borderRadius: 50,
        marginRight: 8,
    }
})