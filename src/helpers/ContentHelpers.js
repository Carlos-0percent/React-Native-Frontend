import _ from "lodash";
import { IsTablet, ScreenWidth } from "../constants/Constants";

export const hideDigits = (showCount, num) => {
    const numberArr = _.split(num, "");
    _.reverse(numberArr);
    const xNumberArr = _.map(numberArr, (digit, index) => {
        if (index > showCount - 1) {
            return "x";
        } else {
            return digit;
        }
    });
    _.reverse(xNumberArr);
    return _.join(xNumberArr, "");
}

export const scaleToWidth = (percent) => {
    return percent * ScreenWidth / 100;
}

export const fontSize = (value) => {
    if (IsTablet) {
        return value + 4;
    } else {
        return value;
    }
}