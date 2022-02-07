import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';

import { useNavigation } from '@react-navigation/native';
import { SlideFromRightIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import { MaterialIcons } from '@expo/vector-icons';

const LENGTH = 5; // Length of the Room ID

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
        <View style={{flex: 1, alignSelf: "stretch", justifyContent: "space-evenly"}}>
            <View style={styles.headerContainer}>
                <View style={styles.backButton}>
                    <MaterialIcons name="delete" size={28} color='green'/>
                </View>
                <Text style={styles.headerText}>Room Code: <var>roomID</var></Text>
            </View>
            <View style={styles.connectedPlayersContainer}>
                <Text>Middle: Current Players</Text>
            </View>
            <View style={styles.calibrationContainer}>
                <Text>Bottom: Calibrate</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        backgroundColor: "brown", 
        alignItems: "center", 
        justifyContent: "center",
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
        alignItems: "center",
    },
    backButton:{
        borderRadius: 75,
        margin: 4,
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 20
    },
    sidesText: {

    }
});