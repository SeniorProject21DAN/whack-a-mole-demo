import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/globalStyles';
import { DeviceMotion } from 'expo-sensors';
import { Subscription } from 'expo-modules-core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ButtonGroup } from 'react-native-elements';
// Will need to be able to continue to talk to the websocket server and maintain the calibration data established in a previous screen. 

export default function ButtonScreen({ route }) {
    const navigation = useNavigation();
    let buttonFormat;
    const [buttons, setButtons] = useState({
        A: false,
        B: false,
        X: false,
        Y: false,
    });

    route.params.send("m:buttons:A:" + buttons.A + ":B:" + buttons.B + ":X:" + buttons.X + ":Y:" + buttons.Y);

    let version = "doubleButtonDia";
    const buttonDown = (buttonType: string) => {
        switch (buttonType) {
            case "A":
                setButtons(previousState => {
                    return { ...previousState, A: true }
                });
                break;
            case "B":
                setButtons(previousState => {
                    return { ...previousState, B: true }
                });
                break;
            case "X":
                setButtons(previousState => {
                    return { ...previousState, X: true }
                });
                break;
            case "Y":
                setButtons(previousState => {
                    return { ...previousState, Y: true }
                });
                break;
        }
    }

    const buttonUp = (buttonType: string) => {
        switch (buttonType) {
            case "A":
                setButtons(previousState => {
                    return { ...previousState, A: false }
                });
                break;
            case "B":
                setButtons(previousState => {
                    return { ...previousState, B: false }
                });
                break;
            case "X":
                setButtons(previousState => {
                    return { ...previousState, X: false }
                });
                break;
            case "Y":
                setButtons(previousState => {
                    return { ...previousState, Y: false }
                });
                break;
        }
    }


    if (version === "doubleButtonHor") {
        buttonFormat = (
            <View style={globalStyles.controllerContainer}>
                <TouchableOpacity onPressIn={() => buttonDown("A")} onPressOut={() => buttonUp("A")} style={style.buttons}>
                    <Text style={style.buttonContent}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity onPressIn={() => buttonDown("B")} onPressOut={() => buttonUp("B")} style={style.buttons}>
                    <Text style={style.buttonContent}>B</Text>
                </TouchableOpacity>
            </View>
        );
    } else if (version === "doubleButtonDia") {
        buttonFormat = (
            <View style={globalStyles.controllerContainer}>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity onPressIn={() => buttonDown("A")} onPressOut={() => buttonUp("A")} style={[style.buttons, { marginTop: "50%" }]}>
                        {/* <Text style={style.buttonContent}>A</Text> */}
                        <MaterialIcons name="brush" size={48} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity onPressIn={() => buttonDown("B")} onPressOut={() => buttonUp("B")} style={[style.buttons, { marginTop: 0, marginLeft: "50%" }]}>
                        {/* <Text style={style.buttonContent}>B</Text> */}
                        <MaterialIcons name="auto-fix-normal" size={48} color='black' />
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else if (version === "quadButtonHor") {
        buttonFormat = (
            <View style={globalStyles.controllerContainer}>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity onPressIn={() => buttonDown("X")} onPressOut={() => buttonUp("X")} style={style.buttons}>
                        <Text style={style.buttonContent}>X</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPressIn={() => buttonDown("A")} onPressOut={() => buttonUp("A")} style={style.buttons}>
                        <Text style={style.buttonContent}>A</Text>
                    </TouchableOpacity>
                </View>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity onPressIn={() => buttonDown("Y")} onPressOut={() => buttonUp("Y")} style={style.buttons}>
                        <Text style={style.buttonContent}>Y</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPressIn={() => buttonDown("B")} onPressOut={() => buttonUp("B")} style={style.buttons}>
                        <Text style={style.buttonContent}>B</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else if (version === "quadButtonDia") {
        buttonFormat = (
            <View style={globalStyles.controllerContainer}>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity onPressIn={() => buttonDown("X")} onPressOut={() => buttonUp("X")} style={style.buttons}>
                        <Text style={style.buttonContent}>X</Text>
                    </TouchableOpacity>
                </View>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity onPressIn={() => buttonDown("Y")} onPressOut={() => buttonUp("Y")} style={style.buttons}>
                        <Text style={style.buttonContent}>Y</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPressIn={() => buttonDown("A")} onPressOut={() => buttonUp("A")} style={style.buttons}>
                        <Text style={style.buttonContent}>A</Text>
                    </TouchableOpacity>
                </View>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity onPressIn={() => buttonDown("B")} onPressOut={() => buttonUp("B")} style={style.buttons}>
                        <Text style={style.buttonContent}>B</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );

    } else {

    }

    return (
        <View style={globalStyles.screenContainer}>
            <View style={globalStyles.headerContainer}>
                {/* <Text style={globalStyles.headerText}>Top: Room Code</Text> */}
                <TouchableOpacity style={{padding: 20}} onPress={() => navigation.navigate("Client")}>
                    <MaterialIcons name="arrow-back" size={28} color='white' />
                </TouchableOpacity>
                <Text style={[globalStyles.headerText, {paddingHorizontal: "20%"}]}>Pictionary</Text>
            </View>
            {/* <View style={{ flexDirection: "row", flex: 5 }}> */}
            {buttonFormat}
            {/* </View> */}
        </View>
    )
}
const style = StyleSheet.create({
    buttons: {
        backgroundColor: "#51FCC9",
        borderRadius: 100,
        padding: "15%",
        alignSelf: "center",
        marginTop: "50%",
    },
    buttonContent: {
        fontSize: 20,
        fontWeight: "bold",
    }
})