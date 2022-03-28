import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { globalStyles } from '../components/globalStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import { useNavigation } from '@react-navigation/native';

// View and text have been overloaded by Dawson, may need to alter to work as I am used to

export default function Home() {
    const navigation = useNavigation();


    return (
        <View style={{ flex: 1, alignSelf: "stretch", justifyContent: "space-evenly" }}>
            {/* Header-ish */}
            <View style={[globalStyles.homeHeaderContainer]}>
                <View>
                    <TouchableOpacity style={[globalStyles.backButton, {alignSelf: "flex-end"}]}>
                        <MaterialIcons name='cast' size={28} color='white' />
                    </TouchableOpacity>
                    <Text style={[globalStyles.headerText, {padding: "15%"}]}>Motion Controller!</Text>
                </View>
            </View>
            {/* Two "buttons." Full screen (minus the header) sides for host and client.*/}
            <View style={globalStyles.sidesContainer}>
                {/* <TouchableOpacity style={globalStyles.buttons} onPress={() => navigation.navigate("Host")}>
                    <View style={ [globalStyles.buttonContent, {backgroundColor: "#5CB8B1"}]  }>
                        <Text style={globalStyles.headerText}>Host</Text>
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity style={globalStyles.buttons} onPress={() => navigation.navigate("Client")}>
                    <View style={[globalStyles.buttonContent, { backgroundColor: "#5CB8B1" }]}>
                        <Text style={globalStyles.headerText}>Get Started!</Text>
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
    buttons: {
        flex: 1
    },
    buttonContent: {
        flex: 1,
        alignItems: "center"
    },
});