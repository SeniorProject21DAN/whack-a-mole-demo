import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SlideFromRightIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import { globalStyles } from '../components/globalStyles'

const BUTTON_MARGIN = 8;


export default function Client() {
    const navigation = useNavigation();
    var roomID  = "";
    var ws = React.useRef(new WebSocket('ws:153.106.227.243:8080')).current;   //This needs to altered to the IP of the server when attempting to get this to run. Double check each time. 

    const Placeholder = () => {

    }

    const Connect = () => {
        if(ws.OPEN){
            ws.send("s:c:" + roomID);
        }
    }



    React.useEffect(() => {
        const serverMessagesList = [];
        ws.onopen = () => {
            // console.log("Connection Attempt.");
            // ws.send("s:h:" + roomID);
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

    return (
        <View style={globalStyles.screenContainer}>
            <View style={styles.headerContainer}>
                {/* <Text style={styles.headerText}>Top: Room Code</Text> */}
                <TouchableOpacity>
                    <MaterialIcons name="arrow-back" size={28} color='white'/>
                </TouchableOpacity>
                <TextInput style={styles.textInput} placeholder='Room Code' />
                <TextInput style={styles.textInput} placeholder='Nickname' />
                <Button color="darkgrey" title="connect" onPress={Connect}/>
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
    headerContainer: {
        flex: 1,
        backgroundColor: "brown", 
        alignItems: "center", 
        justifyContent: "space-evenly", 
        // marginTop: 10,

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

    },
    headerText: {

    },
    sidesText: {

    },
    textInput: {
        margin: 4,
        marginHorizontal: 20,
        backgroundColor: "white",
        color: "black", 
        alignSelf: "stretch",
        borderRadius: 10,
    }, 
    connectButton: {

    },
});