import _ from "lodash";

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