import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity, TextInput, Button } from 'react-native';
import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { SlideFromRightIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import { globalStyles } from '../components/globalStyles';
import { DeviceMotion } from 'expo-sensors';
import { Subscription } from 'expo-modules-core';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const BUTTON_MARGIN = 8;


export default function Client() {
  const [roomID, onChangeText] = React.useState("");
  const [nickName, onNickname] = React.useState("");

  const [word, setWord] = React.useState("???");
  const wordRef = React.useRef(word);

  const [currNickname, setCurrNickname] = React.useState("???");
  const nicknameRef = React.useRef(currNickname);

  const [started, setStarted] = React.useState(true);
  const startedRef = React.useRef(started);

  const navigation = useNavigation();
  // var roomID = "";
  var ws = React.useRef(new WebSocket('ws://153.106.90.99:8080')).current;   //This needs to altered to the IP of the server when attempting to get this to run. Double check each time. 

  const Connect = () => {
    if (ws.OPEN) {
      console.log(roomID);
      ws.send("s:c:" + roomID + ":" + nickName);
      _subscribe();
      DeviceMotion.setUpdateInterval(100);
      nicknameRef.current = nickName;
      setCurrNickname(nickName);
    }
  }

  let rotSub: Subscription | null = null;

  const screenWidth = 1;
  const screenHeight = 1;

  const [topLeft, setTopLeft] = useState([-2, 1]); //x: 0, y: 1
  const [topRight, setTopRight] = useState([-1, 1]);
  const [bottomLeft, setBottomLeft] = useState([-2, 0]);
  const [bottomRight, setBottomRight] = useState([-1, 0]);

  const [top, _setTop] = useState(1);
  const [bottom, _setBottom] = useState(0);
  const [left, _setLeft] = useState(0);
  const [right, _setRight] = useState(1);

  const [coord, _setCoord] = useState([0, 0])

  const topRef = React.useRef(top);
  const bottomRef = React.useRef(bottom);
  const leftRef = React.useRef(left);
  const rightRef = React.useRef(right);
  const coordRef = React.useRef(coord);

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

      setCoord([((-data.rotation.alpha + leftRef.current) / (leftRef.current - rightRef.current))
        * screenWidth, ((-data.rotation.beta + topRef.current) / Math.abs(bottomRef.current - topRef.current))
      * screenHeight]); //height of quad

      // if (whackRef.current) {
      //   setWhack(false);
      // }

      ws.send("m:" + coordRef.current + ":" + whackRef.current);    //Send messages
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
  const _whack = () => {
    setWhack(true);
  }
  const _stopWhack = () => {
    setWhack(false);
  }

  const _setWord = (newWord: string) => {
    setWord(newWord);
    wordRef.current = newWord;
  }

  const startGame = () => {
    ws.send("p:c:" + roomID + ":" + nicknameRef.current + ":host:start")
  }

  const _setStart = () => { 
    startedRef.current = true;
    setStarted(true);
  }

  React.useEffect(() => {
    const serverMessagesList = [];
    ws.onopen = () => {
      console.log("Connection Attempt.");
    };
    ws.onclose = (e) => {
      _unsubscribe();
      console.log(e);
    };
    ws.onerror = (e) => {
      console.log(e);
    };
    ws.onmessage = (e) => {
      console.log(e);
      if (e.data.indexOf(":") !== -1) {
        let message = e.data.split(":")[2];
        let type = message.split("=")[0];
        let data = message.split("=")[1]
        if (type === "artist") {
          if (data !== currNickname) {
            _setWord("???");
          }
        }
        else if (type === "word") {
          _setWord(data);
        }
        else if (type === "start") {
          _setStart();
        }
      }
    };

    return () => _unsubscribe();
  }, [])

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.headerContainer}>
        {/* <Text style={globalStyles.headerText}>Top: Room Code</Text> */}
        <TouchableOpacity onPress={() => navigation.navigate("Home" as any)}>
          <MaterialIcons name="arrow-back" size={28} color='white' />
        </TouchableOpacity>

        <View style={globalStyles.headerSubContainer}>
          <TextInput style={globalStyles.textInput} placeholder='Room Code' onChangeText={onChangeText} />
          <TextInput style={globalStyles.textInput} placeholder='Nickname' onChangeText={onNickname} />

          <Button color="darkgrey" title="connect" onPress={Connect} />
        </View>
      </View>
      <View style={{ backgroundColor: "#5CB8B1", display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
        <Text style={{ color: "white" }}>
          Current Word: {wordRef.current}
        </Text>
      </View>
      {!startedRef.current &&
        <View style={{ backgroundColor: "#5CB8B1" }}>
          <TouchableOpacity style={[
            { marginBottom: BUTTON_MARGIN, display: 'flex', justifyContent: 'center', flexDirection: 'row', backgroundColor: "#51FCC9" }]}
            onPress={startGame}>
            <Text style={{ color: 'white' }}>Start Game</Text>
          </TouchableOpacity>
        </View>
      }
      {startedRef.current &&
        <View style={{ backgroundColor: "#5CB8B1" }}>
          <TouchableOpacity style={[
            { marginBottom: BUTTON_MARGIN, display: 'flex', justifyContent: 'center', flexDirection: 'row', backgroundColor: "#51FCC9" }]}
            onPress={_setTopLeft}>
            <Text style={{ color: 'white' }}>Start Game</Text>
          </TouchableOpacity>
        </View>
      }
      <View style={globalStyles.calibrationContainer}>
        {/* <Text style={{ alignSelf: "center" }}>Bottom: Calibrate</Text> */}
        {//!startedRef.current &&
          [<View style={globalStyles.calibrateRows}>
            <TouchableOpacity style={[globalStyles.calibrationButtons,
            { marginBottom: BUTTON_MARGIN, borderTopLeftRadius: 35, marginRight: BUTTON_MARGIN }]}
              onPress={_setTopLeft}>
              {/* <Text>Top Left</Text> */}
              <MaterialIcons name='north-west' size={50} color='white' />
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.calibrationButtons,
            { marginBottom: BUTTON_MARGIN, borderTopRightRadius: 35, marginLeft: BUTTON_MARGIN }]}
              onPress={_setTopRight}>
              {/* <Text>Top Right</Text> */}
              <MaterialIcons name='north-east' size={50} color='white' />
            </TouchableOpacity>
          </View>,
          <View style={globalStyles.calibrateRows}>
            <TouchableOpacity style={[globalStyles.calibrationButtons,
            { marginTop: BUTTON_MARGIN, borderBottomLeftRadius: 35, marginRight: BUTTON_MARGIN }]}
              onPress={_setBottomLeft}>
              {/* <Text>Bottom Left</Text> */}
              <MaterialIcons name='south-west' size={50} color='white' />
            </TouchableOpacity>
            <TouchableOpacity style={[globalStyles.calibrationButtons,
            { marginTop: BUTTON_MARGIN, borderBottomRightRadius: 35, marginLeft: BUTTON_MARGIN }]}
              onPress={_setBottomRight}>
              {/* <Text>Bottom Right</Text> */}
              <MaterialIcons name='south-east' size={50} color='white' />
            </TouchableOpacity>
          </View>]
        }
        {startedRef.current &&
          <View style={[globalStyles.calibrateRows]}>
            <TouchableOpacity style={[globalStyles.calibrationButtons,
            { marginTop: BUTTON_MARGIN, borderRadius: 35, display: 'flex', justifyContent: 'center' }]}
              onPressIn={_whack} onPressOut={_stopWhack}>
              {/* <Text>Bottom Right</Text> */}
              <MaterialIcons name='brush' size={50} color='white' />
            </TouchableOpacity>
          </View>
        }
      </View>
    </View>
  )
}

// No longer used, can be deleted in the future
const styles = StyleSheet.create({
  calibrationContainer: {
    flex: 3,
    backgroundColor: "lightblue",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  headerText: {

  },
  sidesText: {

  },
  backButton: {

  },
  headerContainer: {
    flex: 1,
    backgroundColor: "brown",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  textInput: {
    flexDirection: "row",
    padding: 4,
    paddingHorizontal: "25%",
    backgroundColor: "white",
    alignSelf: "stretch",
    textAlign: "center",
    borderRadius: 5,
  },
  headerSubContainer: {
    flexDirection: "column",
    borderRadius: 5,
    padding: 2,
    backgroundColor: "brown",
    alignSelf: "stretch",
    justifyContent: "space-evenly",
    alignItems: "center"
  },
  iconStyle: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "purple",
  },
});