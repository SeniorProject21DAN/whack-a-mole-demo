import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { DeviceMotion } from 'expo-sensors';

import * as firebase from "firebase";
import { Subscription } from 'expo-modules-core';
// import firestore from "firebase/firestore";

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const firebaseConfig = {
    apiKey: "AIzaSyALU4G_DAjzU8oEzNbMg6YIpDelv_BnWCM",
    authDomain: "whack-a-mole-motion.firebaseapp.com",
    projectId: "whack-a-mole-motion",
    storageBucket: "whack-a-mole-motion.appspot.com",
    messagingSenderId: "878118269458",
    appId: "1:878118269458:web:077ba628e86d65da101ecb",
    measurementId: "G-29HV2MWXB5"
  };

  if (!firebase.default.apps.length) {
    console.log('Connected with Firebase');
    firebase.default.initializeApp(firebaseConfig);
  }

  let ws = React.useRef(new WebSocket('ws:153.106.226.103:8080')).current;   //This needs to altered to the IP of the server when attempting to get this to run. Double check each time. 

  const [rotData, setRotData] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const subscription = useState(true);
  let rotSub: Subscription | null = null;

  const screenWidth = 150;
  const screenHeight = 100;

  const [topLeft, setTopLeft] = useState([-2, 1]); //x: 0, y: 1
  const [topRight, setTopRight] = useState([-1, 1]);
  const [bottomLeft, setBottomLeft] = useState([-2, 0]);
  const [bottomRight, setBottomRight] = useState([-1, 0]);

  const [top, _setTop] = useState(1);
  const [bottom, _setBottom] = useState(0);
  const [left, _setLeft] = useState(0);
  const [right, _setRight] = useState(1);

  const [coord, _setCoord] = useState([0, 0])

  const _slow = () => {
    DeviceMotion.setUpdateInterval(1000)
  };

  const _fast = () => {
    DeviceMotion.setUpdateInterval(50)
  };

  const topRef = React.useRef(top);
  const bottomRef = React.useRef(bottom);
  const leftRef = React.useRef(left);
  const rightRef = React.useRef(right);
  const coordRef = React.useRef(coord);

  const [write, setWrite] = React.useState(false);
  const writeRef = React.useRef(write);
  const toggleWrite = () => {
    writeRef.current = !write;
    setWrite(!write);
  }

  const [oldY, setOldY_] = React.useState(0);
  const oldYRef = React.useRef(oldY);
  const setOldY = (data: number) => {
    oldYRef.current = data;
    setOldY_(data);
  }

  const [whack, setWhack_] = React.useState(false);
  const whackRef = React.useRef(whack);
  const setWhack = (data: boolean) => {
    whackRef.current = data;
    setWhack_(data);
  }

  const setTop = (data: number) => {
    topRef.current = data;
    _setTop(data)
  }
  const setBottom = (data: number) => {
    bottomRef.current = data;
    _setBottom(data)
  }
  const setLeft = (data: number) => {
    leftRef.current = data;
    _setLeft(data)
  }
  const setRight = (data: number) => {
    rightRef.current = data;
    _setRight(data)
  }
  const setCoord = (data: number[]) => {
    coordRef.current = data;
    _setCoord(data);
  }

  const _subscribe = () => {
    rotSub = DeviceMotion.addListener(data => {
      setRotData(data.rotation);
      setCoord([((-data.rotation.alpha + leftRef.current) / (leftRef.current - rightRef.current))
        * screenWidth, ((-data.rotation.beta + topRef.current) / Math.abs(bottomRef.current - topRef.current))
      * screenHeight]); //height of quad

      // if (oldYRef.current - data.rotation.beta >= 1) {
      //   setWhack(true);
      // }
      // else {
      //   setWhack(false);
      // }
      setOldY(data.rotation.beta);

      if (writeRef.current) {
        firebase.default.firestore().collection("MoleGames").doc("Bongo").set({
          x: ((-data.rotation.alpha + leftRef.current) / (leftRef.current - rightRef.current)),
          y: ((-data.rotation.beta + topRef.current) / Math.abs(bottomRef.current - topRef.current)),
          whack: whackRef.current
        });
        if (whackRef.current) {
          setWhack(false);
        }
      }
    });
  };

  const _unsubscribe = () => {
    // subscription && subscription.remove();
    rotSub?.remove();
  };

  const _setTopLeft = () => {
    let cornerSub = DeviceMotion.addListener(rotData => {
      setTopLeft([rotData.rotation.alpha, rotData.rotation.beta]);
      setTop((rotData.rotation.beta + topRight[1]) / 2);
      setLeft((rotData.rotation.alpha + bottomLeft[0]) / 2);
      cornerSub?.remove();
    });
  }
  const _setTopRight = () => {
    let cornerSub = DeviceMotion.addListener(rotData => {
      setTopRight([rotData.rotation.alpha, rotData.rotation.beta]);
      setTop((topLeft[1] + rotData.rotation.beta) / 2);
      setRight((rotData.rotation.alpha + bottomRight[0]) / 2);
      cornerSub?.remove();
    });
  }
  const _setBottomLeft = () => {
    let cornerSub = DeviceMotion.addListener(rotData => {
      setBottomLeft([rotData.rotation.alpha, rotData.rotation.beta]);
      setBottom((rotData.rotation.beta + bottomRight[1]) / 2);
      setLeft((topLeft[0] + rotData.rotation.alpha) / 2);
      cornerSub?.remove();
    });
  }
  const _setBottomRight = () => {
    let cornerSub = DeviceMotion.addListener(rotData => {
      setBottomRight([rotData.rotation.alpha, rotData.rotation.beta]);
      setBottom((bottomLeft[1] + rotData.rotation.beta) / 2);
      setRight((topRight[0] + rotData.rotation.alpha) / 2);
      cornerSub?.remove();
    });
  }

  const fixSpeed = () => {
    DeviceMotion.setUpdateInterval(100);
  }

  useEffect(() => {
    _subscribe();
    DeviceMotion.setUpdateInterval(500);

    const serverMessagesList = [];
    ws.onopen = () => {
      ws.send("s:h:susus");
      console.log("???");
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
      console.log(e.data);
      if (e.data == "m:buzz") {
        //Vibration.vibrate();
      }
      // serverMessagesList.push(e.data);
      // setServerMessages([...serverMessagesList])
    };

    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {/* <EditScreenInfo path="/screens/TabOneScreen.tsx" /> */}
      <View>
        <View style={{ display: 'flex', width: '100%', 'height': 100, flexDirection: 'row', }}>
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
        </View>

        <View style={{ display: 'flex', width: '100%', 'height': 100, flexDirection: 'row', }}>
          <TouchableOpacity style={{ flex: .5, backgroundColor: 'lightgray' }} onPress={toggleWrite}>
            <Text>Toggle Write</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: .5, backgroundColor: 'gray' }} onPress={fixSpeed}>
            <Text>Fix Speed</Text>
          </TouchableOpacity>
        </View>

        <View style={whack ? { backgroundColor: 'red', height: 10, width: 10 } :
          { backgroundColor: 'white', height: 10, width: 10 }} />

        <View style={write ? { backgroundColor: 'blue', height: 10, width: 10 } :
          { backgroundColor: 'white', height: 10, width: 10 }} />

        <TouchableOpacity style={{ width: '100%', height: 150, backgroundColor: 'red' }} onPress={() => setWhack(true)}>
          <Text style={{ lineHeight: 125, textAlign: 'center', color: 'white', fontSize: 50 }}>Whack</Text>
        </TouchableOpacity>
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
