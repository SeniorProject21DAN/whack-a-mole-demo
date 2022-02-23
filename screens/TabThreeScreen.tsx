import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { DeviceMotion, Accelerometer } from 'expo-sensors';
import { Subscription } from 'expo-modules-core';
// import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';

const KalmanFilter = require('kalman-filter/lib/kalman-filter.js');
const State = require('kalman-filter/lib/state.js');

import { LogBox } from 'react-native';
import { LocationObject } from 'expo-location';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

export default function TabThreeScreen({ route, navigation }: RootTabScreenProps<'TabThree'>) {

	const [location, setLocation] = useState({});
	const [errorMsg, setErrorMsg] = useState("");

	let locSub: any;
	let accSub: Subscription | null = null;

	const _subscribe = async () => {
		accSub = DeviceMotion.addListener(async (data) => {
			console.log(await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }));
		});
		//locSub = await Location.watchPositionAsync({timeInterval: 100, accuracy: 3, mayShowUserSettingsDialog: true}, updateLocation);
	}

	const updateLocation = (loc: LocationObject) => {
		console.log(loc.coords);
	}

	const _unsubscribe = () => {
		locSub();
		accSub?.remove();
	}
  
	useEffect(() => {
	  (async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') {
		  setErrorMsg('Permission to access location was denied');
		  return;
		}
  
		let location = await Location.getCurrentPositionAsync({});
		setLocation(location);
		console.log(location);

		_subscribe();

		DeviceMotion.setUpdateInterval(100);
		
		return () => _unsubscribe();
	  })();
	}, []);
  
	let text = 'Waiting..';
	if (errorMsg) {
	  text = errorMsg;
	} else if (location) {
	  text = JSON.stringify(location);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab Three</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
});
