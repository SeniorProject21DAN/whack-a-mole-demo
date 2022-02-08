import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';

import { useNavigation } from '@react-navigation/native';
import { SlideFromRightIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import { MaterialIcons } from '@expo/vector-icons';
import { globalStyles } from '../components/globalStyles'

const LENGTH = 5; // Length of the Room ID
const BUTTON_MARGIN = 8;

export default function HostSetup() {
    const navigation = useNavigation();

    const generateID = () => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < LENGTH; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    var ws = React.useRef(new WebSocket('ws:153.106.227.243:8080')).current;   //This needs to altered to the IP of the server when attempting to get this to run. Double check each time. 

    var roomID = generateID();
    console.log(roomID);

    React.useEffect(() => {
        const serverMessagesList = [];
        ws.onopen = () => {
            // console.log("Connection Attempt.");
            ws.send("s:h:" + roomID);
            // setServerState('Connected to the server')
            // setDisableButton(false);
        };
        ws.onclose = (e) => {
            // setServerState('Disconnected. Check internet or server.')
            // setDisableButton(true);
        };
        ws.onerror = (e) => {
            // setServerState(e.message);
        };
        ws.onmessage = (e) => {
            console.log(e);
            // serverMessagesList.push(e.data);
            // setServerMessages([...serverMessagesList])
        };
    }, [])
    const submitMessage = () => {
        // ws.send();
        // setMessageText('')
        // setInputFieldEmpty(true)
    }

    const send = () => {
        // console.log("placeholder");
        ws.send("m:buzz");
    }


    return (
        <View style={globalStyles.screenContainer}>
            <View style={globalStyles.headerContainer}>
                <TouchableOpacity style={globalStyles.backButton}>
                    <MaterialIcons name="delete" size={28} color='white' />
                </TouchableOpacity>
                <Text style={globalStyles.headerText}>Room Code: {roomID}</Text>
            </View>
            <View style={globalStyles.connectedPlayersContainer}>
                <Text>Middle: Current Players</Text>
            </View>

            <View style={globalStyles.calibrationContainer}>
                <Text style={{ alignSelf: "center" }}>Bottom: Calibrate</Text>
                <View style={globalStyles.calibrateRows}>
                    <TouchableOpacity style={[globalStyles.calibrationButtons, { marginBottom: BUTTON_MARGIN, borderTopLeftRadius: 35, marginRight: BUTTON_MARGIN }]}>
                        <Text>Top Left</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[globalStyles.calibrationButtons, { marginBottom: BUTTON_MARGIN, borderTopRightRadius: 35, marginLeft: BUTTON_MARGIN }]}>
                        <Text>Top Right</Text>
                    </TouchableOpacity>
                </View>
                <View style={globalStyles.calibrateRows}>
                    <TouchableOpacity style={[globalStyles.calibrationButtons, { marginTop: BUTTON_MARGIN, borderBottomLeftRadius: 35, marginRight: BUTTON_MARGIN }]}>
                        <Text>Bottom Left</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[globalStyles.calibrationButtons, { marginTop: BUTTON_MARGIN, borderBottomRightRadius: 35, marginLeft: BUTTON_MARGIN }]}>
                        <Text>Bottom Right</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "space-evenly"
    },
    headerContainer: {
        flex: 1,
        backgroundColor: "brown",
        alignItems: "center",
        // justifyContent: "center",
        flexDirection: "row",

    },
    connectedPlayersContainer: {
        flex: 3,
        backgroundColor: "lightgreen",
        alignItems: "center",
    },
    calibrationContainer: {
        flex: 3,
        backgroundColor: "lightblue",
        // alignItems: "flex-start",
        // flexWrap: "wrap",
        flexDirection: "column",
        justifyContent: "space-evenly"
    },
    calibrateRows: {
        flex: 1,
        backgroundColor: "lightblue",
        flexDirection: "row",
    },
    calibrationButtons: {
        flex: 1,
        backgroundColor: "purple",
        // borderRadius: 15,
        alignSelf: "stretch",
        margin: 20,
        alignItems: "center"
    },
    backButton: {
        borderRadius: 75,
        margin: 20,
        // backgroundColor: "black",
        alignSelf: "center"
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
        justifyContent: "center",

    },
    sidesText: {

    }
});