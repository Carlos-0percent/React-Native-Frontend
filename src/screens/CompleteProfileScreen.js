import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Platform, StyleSheet, Text, TouchableOpacity as NativeTouchableOpacity, View } from "react-native";
import _ from "lodash";
import DatePicker from "react-native-date-picker";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { ScrollView, TouchableOpacity as GHTouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { CameraIcon, CrossRedCircleIcon, DropdownArrowIcon, PlusBlueCircleIcon } from "../assets";
import LongButton from "../components/Buttons/LongButton";
import CustomModal from "../components/Modals/CustomModal";
import Header from "../components/Headers/Header";
import Colors from "../constants/Colors";
import { OccupationConstant } from "../constants/Constants";
import Fonts from "../constants/Fonts";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../redux/slices/UserSagaSlice";
import { launchImageLibrary } from "react-native-image-picker";
import LoaderModal from "../components/Modals/LoaderModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TouchableOpacity = Platform.OS === "ios" ? GHTouchableOpacity : NativeTouchableOpacity;

const floatingCustomLabel = {
    colorBlurred: Colors.Black(1),
    colorFocused: Colors.Black(1)
}

const CompleteProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userToken = useSelector(state => state.user.token);
    const [loading, setLoading] = useState(false);
    const [submitDisable, setSubmitDisable] = useState(true);
    const [datePickerModalVisible, setDatePickerModalVisible] = useState(false);
    const [occupationOptionsModalVisible, setOccupationOptionsModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [dob, setDOB] = useState("");
    const [dobSend, setDOBSend] = useState("");
    const [selectedOccupation, setSelectedOccupation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [name, setName] = useState("");
    const [ssnNum, setSSNNum] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [state, setState] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [profilePhotoURI, setProfilePhotoURI] = useState("");
    const [profilePhotoB64, setProfilePhotoB64] = useState("");
    const [profilePhotoSelected, setProfilePhotoSelected] = useState(false);

    const pickImage = () => {
        launchImageLibrary({
            mediaType: "photo",
            quality: 0.6,
            includeBase64: true
        }, res => {
            if (res.uri) {
                setProfilePhotoURI(res.uri);
                setProfilePhotoSelected(true);
            }
            if (res.base64) {
                setProfilePhotoB64(res.base64);
            }
        })
    }

    const removeImage = () => {
        setProfilePhotoURI("");
        setProfilePhotoSelected(false);
        setProfilePhotoB64("");
    }

    const handleDOB = () => {
        let newDate = new Date(date);
        let day = newDate.getDate();
        let month = newDate.getMonth() + 1;
        month = month.toString().length === 1 ? 0 + month.toString() : month;
        day = day.toString().length === 1 ? 0 + day.toString() : day;
        let year = newDate.getFullYear().toString().slice(2);
        setDOB(`${month}/${day}/${year}`);
        setDOBSend(`${day}/${month}/${newDate.getFullYear()}`);
        setDatePickerModalVisible(false);
    }

    const handleOccupation = () => {
        setOccupation(selectedOccupation);
        setOccupationOptionsModalVisible(false);
    }

    const renderDatePickerModal = () => {
        return (
            <CustomModal
                visible={datePickerModalVisible}
                contentView={
                    <TouchableWithoutFeedback style={styles.modalContentWrapper} activeOpacity={1}>
                        <DatePicker date={date} maximumDate={new Date()} onDateChange={setDate} mode="date" />
                        <View style={styles.modalButtonWrapper}>
                            <LongButton text="Select" buttonPress={handleDOB} />
                        </View>
                    </TouchableWithoutFeedback>
                }
                closeModal={() => setDatePickerModalVisible(false)}
                animation="slide"
            />
        );
    }

    const renderOccupationOptionsModal = () => {
        return (
            <CustomModal
                visible={occupationOptionsModalVisible}
                contentView={
                    <TouchableWithoutFeedback style={styles.modalContentWrapper} activeOpacity={1}>
                        <TouchableOpacity style={styles.selectOption} activeOpacity={1} underlayColor={Colors.White(1)} onPress={() => setSelectedOccupation(OccupationConstant[0].value)}>
                            <Text style={selectedOccupation === OccupationConstant[0].value ? styles.dropdownOptionSelected : styles.dropdownOption}>{OccupationConstant[0].name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.selectOption} activeOpacity={1} onPress={() => setSelectedOccupation(OccupationConstant[1].value)}>
                            <Text style={selectedOccupation === OccupationConstant[1].value ? styles.dropdownOptionSelected : styles.dropdownOption}>{OccupationConstant[1].name}</Text>
                        </TouchableOpacity>
                        <View style={styles.modalButtonWrapper}>
                            <LongButton text="Select" buttonPress={handleOccupation} />
                        </View>
                    </TouchableWithoutFeedback>
                }
                closeModal={() => setOccupationOptionsModalVisible(false)}
                animation="slide"
            />
        );
    }

    const submit = () => {
        const user = {
            "legal_name": name,
            "dob": dobSend,
            "occupation": occupation,
            "ssn_number": ssnNum.replace(/-/g, ""),
            "address_line_1": address1,
            "address_line_2": address2,
            "state": state,
            "city": city,
            "zipcode": zipCode,
            "profile_image": profilePhotoB64
        }

        new Promise((resolve, reject) => {
            setLoading(true);
            dispatch(UserActions.profileComplete({ user, token: userToken, resolve, reject }));
        })
            .then(res => {
                if (res) {
                    new Promise((resolve, reject) => {
                        dispatch(UserActions.fetchUser({ token: userToken, resolve, reject }));
                    })
                        .then(res => {
                            setLoading(false);
                            if (res.email) {
                                navigation.push("VerifyOTP");
                            }
                        })
                        .catch(err => {
                            setLoading(false);
                            console.warn("Error while fetching user details ---->", err);
                        })
                }
            })
            .catch(err => {
                setLoading(false);
                console.warn("Error while profile completion ---->", err)
            })
    }

    const renderLoaderModal = () => {
        return (
            <LoaderModal
                visible={loading}
                contentView={
                    <ActivityIndicator size="large" color={Colors.BrownYellow} />
                }
                animation="slide"
            />
        );
    }

    useEffect(() => {
        if (name && dob && occupation && ssnNum && address1 && state && city && zipCode && profilePhotoB64) {
            if (submitDisable) {
                setSubmitDisable(false);
            }
        } else {
            if (!submitDisable) {
                setSubmitDisable(true)
            }
        }
    }, [name, dob, occupation, ssnNum, address1, state, city, zipCode, profilePhotoB64])

    const backAction = async () => {
        await AsyncStorage.removeItem("token");
        dispatch(UserActions.logoutUser());
        navigation.push("Login");
    }

    return (
        <View style={styles.container}>
            <Header title="Complete Your Profile" backIconPress={backAction} />
            <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false} showsVerticalScrollIndicator={false} bounces={false} showsVerticalScrollIndicator={false}>
                <View style={styles.imageViewWrapper}>
                    {!profilePhotoSelected
                        ?
                        <TouchableWithoutFeedback onPress={pickImage} style={styles.addImageWrapper}>
                            <View style={styles.addImageIconTextWrapper}>
                                <CameraIcon width={24} height={24} style={styles.cameraIcon} />
                                <Text style={styles.addImageText}>{"Add"}</Text>
                                <Text style={styles.addImageText}>{"Image"}</Text>
                            </View>
                            <PlusBlueCircleIcon width={48} height={48} style={styles.plusIcon} />
                        </TouchableWithoutFeedback>
                        :
                        <View style={styles.addImageWrapper}>
                            <Image source={{ uri: profilePhotoURI }} style={styles.profileImage} />
                            <View style={styles.crossIconButtonWrapper}>
                                <TouchableWithoutFeedback onPress={removeImage}>
                                    <CrossRedCircleIcon width={48} height={48} />
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    }
                </View>
                <FloatingLabelInput
                    label={"Legal Name"}
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    customLabelStyles={floatingCustomLabel}
                    value={name}
                    onChangeText={value => setName(value)}
                />
                <TouchableWithoutFeedback style={styles.longInputWrapper} onPress={() => setDatePickerModalVisible(true)}>
                    <FloatingLabelInput
                        label={"Date of Birth (MM/DD/YY)"}
                        containerStyles={styles.floatingInputContainer}
                        labelStyles={styles.floatingLabel}
                        customLabelStyles={floatingCustomLabel}
                        value={dob}
                    />
                    <DropdownArrowIcon width={7} height={5} style={styles.dropdownIcon} />
                    <View style={styles.dropdownHiddenButtonWrapper}>
                        <TouchableWithoutFeedback style={styles.dropdownHiddenButton} onPress={() => setDatePickerModalVisible(true)}>
                            <Text>{"Hidden Button"}</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback style={styles.longInputWrapper} onPress={() => setOccupationOptionsModalVisible(true)}>
                    <FloatingLabelInput
                        label={"Occupation"}
                        containerStyles={styles.floatingInputContainer}
                        labelStyles={styles.floatingLabel}
                        customLabelStyles={floatingCustomLabel}
                        value={_.filter(OccupationConstant, { value: occupation }).length > 0 ? _.filter(OccupationConstant, { value: occupation })[0].name : ""}
                    />
                    <DropdownArrowIcon width={7} height={5} style={styles.dropdownIcon} />
                    <View style={styles.dropdownHiddenButtonWrapper}>
                        <TouchableWithoutFeedback style={styles.dropdownHiddenButton} onPress={() => setOccupationOptionsModalVisible(true)}>
                            <Text>{"Hidden Button"}</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
                <FloatingLabelInput
                    label={"SSN Number (9-digits)"}
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    customLabelStyles={floatingCustomLabel}
                    keyboardType="numeric"
                    value={ssnNum}
                    onChangeText={value => setSSNNum(value)}
                    mask="999-99-9999"
                />
                <FloatingLabelInput
                    label={"Address Line 1"}
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    customLabelStyles={floatingCustomLabel}
                    value={address1}
                    onChangeText={value => setAddress1(value)}
                />
                <FloatingLabelInput
                    label={"Address Line 2"}
                    containerStyles={styles.floatingInputContainer}
                    labelStyles={styles.floatingLabel}
                    customLabelStyles={floatingCustomLabel}
                    value={address2}
                    onChangeText={value => setAddress2(value)}
                />
                <View style={styles.miniInputsRow}>
                    <View style={styles.miniInputWrapper}>
                        <FloatingLabelInput
                            label={"State"}
                            containerStyles={styles.miniFloatingInputContainer}
                            labelStyles={styles.floatingLabel}
                            customLabelStyles={floatingCustomLabel}
                            value={state}
                            onChangeText={value => setState(value)}
                        />
                    </View>
                    <View style={styles.miniInputWrapper}>
                        <FloatingLabelInput
                            label={"City"}
                            containerStyles={styles.miniFloatingInputContainer}
                            labelStyles={styles.floatingLabel}
                            customLabelStyles={floatingCustomLabel}
                            value={city}
                            onChangeText={value => setCity(value)}
                        />
                    </View>
                </View>
                <View style={styles.miniInputsRow}>
                    <View style={styles.miniInputWrapper}>
                        <FloatingLabelInput
                            label={"Zip Code"}
                            containerStyles={styles.miniFloatingInputContainer}
                            labelStyles={styles.floatingLabel}
                            customLabelStyles={floatingCustomLabel}
                            keyboardType="numeric"
                            value={zipCode}
                            onChangeText={value => setZipCode(value)}
                            mask="999999"
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.submitButtonWrapper}>
                <LongButton text="Submit" disabled={submitDisable} buttonPress={submit} />
            </View>
            {renderDatePickerModal()}
            {renderOccupationOptionsModal()}
            {renderLoaderModal()}
        </View>
    );
}

export default CompleteProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White(1),
        position: "relative"
    },
    scrollContainer: {
        top: Platform.OS === "ios" ? 80 : 45,
    },
    imageViewWrapper: {
        paddingVertical: 30,
        flexDirection: "row",
        justifyContent: "center"
    },
    addImageWrapper: {
        width: Platform.OS === "ios" ? 84 : 104,
        height: Platform.OS === "ios" ? 84 : 104,
        borderRadius: 50,
        backgroundColor: Platform.OS === "ios" ? Colors.Gray : Colors.White(1),
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    addImageIconTextWrapper: {
        width: Platform.OS === "ios" ? "100%" : "80%",
        height: Platform.OS === "ios" ? "100%" : "80%",
        backgroundColor: Colors.Gray,
        borderRadius: 50,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    cameraIcon: {
        width: 24,
        height: 24,
        marginVertical: 2
    },
    addImageText: {
        fontSize: 11,
        fontFamily: Fonts.MontserratRegular
    },
    plusIcon: {
        position: "absolute",
        top: Platform.OS === "ios" ? 58 : 68,
    },
    crossIconButtonWrapper: {
        position: "absolute",
        top: Platform.OS === "ios" ? 58 : 68
    },
    floatingInputContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.Black(1),
        marginHorizontal: 30,
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: 14,
        zIndex: 0
    },
    floatingLabel: {
        top: 10,
        left: 0,
        fontSize: 12,
        fontFamily: Fonts.MontserratRegular,
    },
    longInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },
    miniInputsRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 30,
        justifyContent: "space-between"
    },
    miniInputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: "46%"
    },
    miniFloatingInputContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.Black(1),
        paddingTop: 0,
        paddingBottom: 0,
        marginVertical: 14,
    },
    dropdownIcon: {
        position: "absolute",
        bottom: 20,
        right: 0,
        marginRight: 30,
    },
    dropdownHiddenButtonWrapper: {
        position: "absolute",
        width: "100%",
        height: "60%",
        paddingHorizontal: 30,
        opacity: 0
    },
    dropdownHiddenButton: {
        height: "100%"
    },
    modalContentWrapper: {
        backgroundColor: Colors.White(1),
        width: "80%",
        borderWidth: 0.5,
        borderColor: Colors.Black(1),
        borderRadius: 7,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 10,
        shadowColor: Colors.Black(0.11),
        shadowOffset: {
            width: 11,
            height: 11
        },
        shadowRadius: 33,
        shadowOpacity: 1,
        elevation: 5
    },
    dropdownOption: {
        fontFamily: Fonts.MontserratRegular,
        fontSize: 14,
        borderWidth: 0.5,
        width: "80%",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 16,
        borderRadius: 7
    },
    dropdownOptionSelected: {
        fontFamily: Fonts.MontserratSBold,
        fontSize: 14,
        borderWidth: 1,
        width: "80%",
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 16,
        borderRadius: 7
    },
    selectOption: {
        flexDirection: "row",
        width: "100%"
    },
    profileImage: {
        width: Platform.OS === "ios" ? "100%" : "80%",
        height: Platform.OS === "ios" ? "100%" : "80%",
        borderRadius: 50
    },
    submitButtonWrapper: {
        width: "100%",
        paddingVertical: 30
    },
    modalButtonWrapper: {
        flexDirection: "row"
    }
})