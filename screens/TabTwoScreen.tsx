import React, { useState, useEffect } from 'react';
import { EventSubscription, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { DeviceMotion, Accelerometer } from 'expo-sensors';
const KalmanFilter = require('kalman-filter/lib/kalman-filter.js');

const State = require('kalman-filter/lib/state.js');

export default function TabTwoScreen({ route, navigation }: RootTabScreenProps<'TabTwo'>) {

	const kFilter = new KalmanFilter({
		observation: {
			sensorDimension: 3,
			name: 'sensor'
		},
		dynamic: {
			name: 'constant-acceleration',// observation.sensorDimension * 3 == state.dimension
			timeStep: 0.1,
			covariance: [3, 3, 3, 4, 4, 4, 5, 5, 5]// equivalent to diag([3, 3, 3, 4, 4, 4, 5, 5, 5])
		}
	})
	const observations = [[0, 2, 3], [0.1, 4, 7], [0.5, 9, 11], [0.2, 12, 15]];

	// batch kalman filter
	// console.log(kFilter.filterAll(observations));
	// console.log(kFilter.predict({
	// 	x: 1,
	// 	y: 2,
	// 	z: 3
	// }));

	// let previousCorrected: any = null;
	let previousCorrected = new State({
		mean: [[100], [100], [100], [10], [10], [10], [0], [0], [0]],
		covariance: [
			[1, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 1, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0.01, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0.01, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0.01, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0.0001, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0.0001, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0.0001]
		],
		index: 1
	});
	const results: any[] = [];
	// observations.forEach(observation => {
	// 	previousCorrected = kFilter.filter({ previousCorrected, observation });
	// 	results.push(previousCorrected.mean);
	// });

	// console.log(results);

	let accSub: EventSubscription | null = null;

	const [startTime, setStartTime] = useState(0);

	const [accData, setAccData] = useState({
		x: 0,
		y: 0,
		z: 0,
	});

	const [prevAccData, setPrevAccData] = useState({
		x: 0,
		y: 0,
		z: 0,
	});

	const [velData, setVelData] = useState({
		x: 0,
		y: 0,
		z: 0,
	});

	const [posData, setPosData] = useState({
		x: 0,
		y: 0,
		z: 0,
	});

	const [accRunning, setAccRunning] = useState(false);

	const timeRef = React.useRef(startTime);
	const accRef = React.useRef(accData);
	const prevAccRef = React.useRef(prevAccData);
	const velRef = React.useRef(velData);
	const posRef = React.useRef(posData);
	const runRef = React.useRef(accRunning);

	let NS2S = 1.0 / 1000000000.0;

	const _subscribe = () => {
		accSub = DeviceMotion.addListener(data => {
			if (data.acceleration && runRef.current) {
				setPrevAccData(accRef.current);
				prevAccRef.current = accRef.current;
				setAccData(data.acceleration);
				accRef.current = data.acceleration;

				let dt = ((Date.now() - timeRef.current) / 1000); //current time in seconds
				setStartTime(Date.now());
				timeRef.current = Date.now();
				console.log(dt);
				let gToMSS = 9.80665 //g to m/s^2

				const predictedState = kFilter.predict({
					previousCorrected
				});

				console.log(predictedState instanceof State);
			
				const correctedState = kFilter.correct({
					predicted: new State({
						covariance: predictedState.covariance,
						mean: predictedState.mean,
						index: predictedState.index
					}),
					observation: [[data.acceleration.x], [data.acceleration.y], [data.acceleration.z]]
				});

				console.log(correctedState);
			
				results.push(correctedState.mean);
			
				// update the previousCorrected for next loop iteration
				previousCorrected = correctedState

				let velocity = {
					x: velRef.current.x + (((data.acceleration.x * gToMSS) + (prevAccData.x * gToMSS)) / 2 * dt),
					y: velRef.current.y + (((data.acceleration.y * gToMSS) + (prevAccData.y * gToMSS)) / 2 * dt),
					z: velRef.current.z + (((data.acceleration.z * gToMSS) + (prevAccData.z * gToMSS)) / 2 * dt)
				}

				// if(data.acceleration.x < 0.1) {
				// 	velocity.x = 0;
				// }	
				// if(data.acceleration.y < 0.1) {
				// 	velocity.y = 0;
				// }
				if (data.acceleration.z < 0.1) {
					velocity.z = 0;
				}

				//Initial velocity (g/s) + acceleration (g/s^2) * time (s)
				// let velocity = {
				// 	x: velRef.current.x + (data.x * (Date.now() - startTime) * 1000 * 9.81),
				// 	y: velRef.current.y + (data.y * (Date.now() - startTime) * 1000 * 9.81),
				// 	z: velRef.current.z + (data.z * (Date.now() - startTime) * 1000 * 9.81) 
				// }

				setVelData(velocity)
				velRef.current = velocity;

				let position = {
					x: posRef.current.x + (velRef.current.x * dt),
					y: posRef.current.y + (velRef.current.y * dt),
					z: posRef.current.z + (velRef.current.z * dt)
				}

				setPosData(position);
				posRef.current = position;

				// if (writeRef.current) {
				// 	firebase.default.firestore().collection("MoleGames").doc("Bongo").set({
				// 		x: ((-data.rotation.alpha + leftRef.current) / (leftRef.current - rightRef.current)),
				// 		y: ((-data.rotation.beta + topRef.current) / Math.abs(bottomRef.current - topRef.current)),
				// 		whack: whackRef.current
				// 	});
				// 	if (whackRef.current) {
				// 		setWhack(false);
				// 	}
				// }
			}
		});
	};

	const _unsubscribe = () => {
		// subscription && subscription.remove();
		accSub?.remove();
	};

	const fixSpeed = () => {
		DeviceMotion.setUpdateInterval(100);
	}
	const toggleAcc = () => {
		setStartTime(Date.now());
		timeRef.current = Date.now();
		setAccRunning(!runRef.current);
		runRef.current = !runRef.current;
		// setAccData({ x: 0, y: 0, z: 0 });
		// accRef.current = { x: 0, y: 0, z: 0 };
		setVelData({ x: 0, y: 0, z: 0 });
		velRef.current = { x: 0, y: 0, z: 0 };
		setPosData({ x: 0, y: 0, z: 0 });
		posRef.current = { x: 0, y: 0, z: 0 };
	}

	useEffect(() => {
		_subscribe();
		DeviceMotion.setUpdateInterval(500);
		return () => _unsubscribe();
	}, []);

	const kalFilter = new KalmanFilter({
		observation: {
			sensorDimension: 2,
			name: 'sensor'
		},
		dynamic: {
			name: 'constant-acceleration', // Observation.sensorDimension * 3 == state.dimension
			timeStep: 0.1,
			covariance: [3, 3, 4, 4, 5, 5]// Equivalent to diag([3, 3, 4, 4, 5, 5])
		}
	});
	const prevCorrected = new State({
		mean: [[100], [100], [10], [10], [0], [0]],
		covariance: [
			[1, 0, 0, 0, 0, 0],
			[0, 1, 0, 0, 0, 0],
			[0, 0, 0.01, 0, 0, 0],
			[0, 0, 0, 0.01, 0, 0],
			[0, 0, 0, 0, 0.0001, 0],
			[0, 0, 0, 0, 0, 0.0001]
		]
	});
	const obs = [[102], [101]];
	const predicted = kalFilter.predict({prevCorrected});
	const corrected = kalFilter.correct({
		predicted,
		observation: obs
	});
	// console.log(corrected);
	// console.log(predicted instanceof State);
	// console.log(predicted.mean.length, 6);
	// console.log(corrected instanceof State);
	// console.log(corrected.mean.length, 6);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Tab One</Text>
			<View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
			{/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
			<View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				{/* <View style={{ display: 'flex', width: '100%', 'height': 100, flexDirection: 'row', }}>
					<TouchableOpacity style={{ flex: .5, backgroundColor: 'magenta' }} onPress={_setTopLeft}>
						<Text>Set Top Left</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{ flex: .5, backgroundColor: 'yellow' }} onPress={_setTopRight}>
						<Text>Set Top Right</Text>
					</TouchableOpacity>
				</View>

				<View style={{ display: 'flex', width: '100%', 'height': 100, flexDirection: 'row', }}>
					<TouchableOpacity style={{ flex: .5, backgroundColor: 'lime' }} onPress={_setBottomLeft}>
						<Text>Set Bottom Left</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{ flex: .5, backgroundColor: 'cyan' }} onPress={_setBottomRight}>
						<Text>Set Bottom Right</Text>
					</TouchableOpacity>
				</View> */}

				<View>
					<Text>Accelerometer:</Text>
					<Text style={accData.x < 0 ? { color: 'red' } : { color: 'green' }}>
						x: {(Math.round(accData.x * 100) / 100).toFixed(2)}
					</Text>
					<Text style={accData.y < 0 ? { color: 'red' } : { color: 'green' }}>
						y: {(Math.round(accData.y * 100) / 100).toFixed(2)}
					</Text>
					<Text style={accData.z < 0 ? { color: 'red' } : { color: 'green' }}>
						z: {(Math.round(accData.z * 100) / 100).toFixed(2)}
					</Text>
				</View>

				<View>
					<Text>Velocity:</Text>
					<Text style={velData.x < 0 ? { color: 'red' } : { color: 'green' }}>
						x: {(Math.round(velData.x * 100) / 100).toFixed(2)}
					</Text>
					<Text style={velData.y < 0 ? { color: 'red' } : { color: 'green' }}>
						y: {(Math.round(velData.y * 100) / 100).toFixed(2)}
					</Text>
					<Text style={velData.z < 0 ? { color: 'red' } : { color: 'green' }}>
						z: {(Math.round(velData.z * 100) / 100).toFixed(2)}
					</Text>
				</View>

				<View>
					<Text>Position:</Text>
					<Text style={posData.x < 0 ? { color: 'red' } : { color: 'green' }}>
						x: {(Math.round(posData.x * 100) / 100).toFixed(2)}
					</Text>
					<Text style={posData.y < 0 ? { color: 'red' } : { color: 'green' }}>
						y: {(Math.round(posData.y * 100) / 100).toFixed(2)}
					</Text>
					<Text style={posData.z < 0 ? { color: 'red' } : { color: 'green' }}>
						z: {(Math.round(posData.z * 100) / 100).toFixed(2)}
					</Text>
				</View>

				<View style={{ display: 'flex', width: '100%', 'height': 100, flexDirection: 'row', }}>
					{/* <TouchableOpacity style={{ flex: .5, backgroundColor: 'lightgray' }} onPress={toggleWrite}>
						<Text>Toggle Write</Text>
					</TouchableOpacity> */}

					<TouchableOpacity style={{ flex: .5, backgroundColor: 'gray' }} onPress={fixSpeed}>
						<Text>Fix Speed</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{ flex: .5, backgroundColor: 'lime' }} onPress={toggleAcc}>
						<Text>Toggle Accelerometer</Text>
					</TouchableOpacity>
				</View>

				{/* <View style={whack ? { backgroundColor: 'red', height: 10, width: 10 } :
					{ backgroundColor: 'white', height: 10, width: 10 }} />

				<View style={write ? { backgroundColor: 'blue', height: 10, width: 10 } :
					{ backgroundColor: 'white', height: 10, width: 10 }} />

				<TouchableOpacity style={{ width: '100%', height: 150, backgroundColor: 'red' }} onPress={() => setWhack(true)}>
					<Text style={{ lineHeight: 125, textAlign: 'center', color: 'white', fontSize: 50 }}>Whack</Text>
				</TouchableOpacity> */}
			</View>
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
