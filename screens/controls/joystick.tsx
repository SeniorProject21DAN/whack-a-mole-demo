import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../components/globalStyles';
import { DeviceMotion } from 'expo-sensors';
import { Subscription } from 'expo-modules-core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import RNGamePad from 'react-native-game-pad';

// Will need to be able to continue to talk to the websocket server and maintain the calibration data established in a previous screen. 
// Work in progress, will not be completed

export default function JoystickScreen() {


    const navigation = useNavigation();

    return (
        <View style={globalStyles.screenContainer}>
            <View style={globalStyles.headerContainer}>
                {/* <Text style={globalStyles.headerText}>Top: Room Code</Text> */}
                <TouchableOpacity onPress={() => navigation.navigate("Client")}>
                    <MaterialIcons name="arrow-back" size={28} color='white' />
                </TouchableOpacity>
                <Text style={globalStyles.headerText}>Game Screen with a Joystick</Text>
            </View>
            <View style={globalStyles.controllerContainer}>
                <RNGamePad options={{
                    size: 400,
                    color: "blue",
                    lockX: true
                }} />
            </View>
        </View>
    )
}