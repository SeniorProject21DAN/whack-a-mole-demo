import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/globalStyles';
import { DeviceMotion } from 'expo-sensors';
import { Subscription } from 'expo-modules-core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// Will need to be able to continue to talk to the websocket server and maintain the calibration data established in a previous screen. 

export default function ButtonScreen(version = "doubleButtonHor") {
    const navigation = useNavigation();
    let buttonFormat;

    version = "doubleButtonDia";

    if (version === "doubleButtonHor") {
        buttonFormat = (
            <View style={globalStyles.controllerContainer}>
                <TouchableOpacity style={style.buttons}>
                    <Text style={style.buttonContent}>A</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.buttons}>
                    <Text style={style.buttonContent}>B</Text>
                </TouchableOpacity>
            </View>
        );
    } else if (version === "doubleButtonDia") {
        buttonFormat = (
            <View style={globalStyles.controllerContainer}>

                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity style={[style.buttons, { marginTop: "50%"}]}>
                        <Text style={style.buttonContent}>A</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[style.buttons, { marginTop: 0, marginLeft: "50%"}]}>
                        <Text style={style.buttonContent}>B</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else if (version === "quadButtonHor") {
        buttonFormat = (
            <View style={globalStyles.controllerContainer}>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity style={style.buttons}>
                        <Text style={style.buttonContent}>X</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.buttons}>
                        <Text style={style.buttonContent}>A</Text>
                    </TouchableOpacity>
                </View>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity style={style.buttons}>
                        <Text style={style.buttonContent}>Y</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.buttons}>
                        <Text style={style.buttonContent}>B</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    } else if (version === "quadButtonDia") {
        buttonFormat = (
            <View style={globalStyles.controllerContainer}>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity style={style.buttons}>
                        <Text style={style.buttonContent}>X</Text>
                    </TouchableOpacity>
                </View>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity style={style.buttons}>
                        <Text style={style.buttonContent}>Y</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.buttons}>
                        <Text style={style.buttonContent}>A</Text>
                    </TouchableOpacity>
                </View>
                <View style={globalStyles.controllerContainerCol}>
                    <TouchableOpacity style={style.buttons}>
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
                <TouchableOpacity onPress={() => navigation.navigate("Client")}>
                    <MaterialIcons name="arrow-back" size={28} color='white' />
                </TouchableOpacity>
                <Text style={globalStyles.headerText}>Game Screen with Buttons</Text>
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
        padding: "20%",
        alignSelf: "center",
        marginTop: "50%",
        // margin: "1%",
        // margin: 50,
        // shadowOffset: {width: 1, height: 1},
        // shadowColor: '#333',
        // shadowOpacity: 0.3,
        // shadowRadius: 2,
        // opacity: 0.75
    },
    buttonContent: {
        fontSize: 20,
        fontWeight: "bold",
    }
})