import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';

import { useNavigation } from '@react-navigation/native';

export default function HostSetup() {
    const navigation = useNavigation();


    return (
        <View style={{alignSelf: "stretch", justifyContent: "space-evenly"}}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Top: Room Code</Text>
            </View>
            <View>
                <Text>Middle: Current Players</Text>
            </View>
            <View>
                <Text>Bottom: Calibrate</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        // flex: 1,
        backgroundColor: "brown"
    },
    sidesContainer: {
        // flex: 3,
        flexDirection: "row",
    },
    headerText: {

    },
    sidesText: {

    }
});