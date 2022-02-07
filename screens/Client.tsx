import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SlideFromRightIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';

export default function Client() {
    const navigation = useNavigation();


    return (
        <View style={{flex: 1, alignSelf: "stretch", justifyContent: "space-evenly"}}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Top: Room Code</Text>
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

    }
});