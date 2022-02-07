import React, { useState, useEffect } from 'react';
import { Text, View, ImagePickerIOS, StyleSheet, TouchableOpacity } from 'react-native';

// import { Text, View } from '../components/Themed';

import { useNavigation } from '@react-navigation/native';

// View and text have been overloaded by Dawson, may need to alter to work as I am used to

export default function Home() {
    const navigation = useNavigation();


    return (
        <View style={{ flex: 1, alignSelf: "stretch", justifyContent: "space-evenly" }}>
            {/* Header-ish */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Whack-A-Mole!</Text>
            </View>
            {/* Two "buttons." Full screen (minus the header) sides for host and client.*/}
            <View style={styles.sidesContainer}>
                <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate("Host")}>
                    <View style={ [styles.buttonContent, {backgroundColor: "lightblue"}]  }>
                        <Text style={styles.sidesText}>Host</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttons} onPress={() => navigation.navigate("Client")}>
                    <View style={ [styles.buttonContent, {backgroundColor: "lightgreen"}]  }>
                        <Text style={styles.sidesText}>Client</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "brown"
    },
    sidesContainer: {
        flex: 2,
        alignSelf: "stretch",
        flexDirection: "row",
    },
    headerText: {
        fontSize: 18,
    },
    sidesText: {
        fontSize: 18,
    },
    buttons: {
        flex: 1
    },
    buttonContent: {
        flex: 1, 
        alignItems: "center"
    },
});