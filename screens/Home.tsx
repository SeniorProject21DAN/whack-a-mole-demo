import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';

import { useNavigation } from '@react-navigation/native';

// View and text have been overloaded by Dawson, may need to alter to work as I am used to

export default function Home() {
    const navigation = useNavigation();


    return (
        <View>
            {/* Header-ish */}
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Whack-A-Mole!</Text>
            </View>
            {/* Two "buttons." Full screen (minus the header) sides for host and client.*/}
            <View style={styles.sidesContainer}>
                <View>
                    <TouchableOpacity>
                        <Text style={styles.sidesText}>Host</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity>
                        <Text style={styles.sidesText}>Client</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1
    },
    sidesContainer: {
        flex: 3,
        flexDirection: "row",
    },
    headerText: {

    },
    sidesText: {

    }
});