import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Button, Vibration } from 'react-native';
import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../components/globalStyles';
import { DeviceMotion } from 'expo-sensors';
import { Subscription } from 'expo-modules-core';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const BUTTON_MARGIN = 8;


export default function Client() {
  const [roomID, onChangeText] = React.useState("");
  const [nickName, onNickname] = React.useState("");
  const [connection, onConnection] = React.useState("connect");

  const [word, setWord] = React.useState("???");
  const wordRef = React.useRef(word);

  const [currNickname, setCurrNickname] = React.useState("???");
  const nicknameRef = React.useRef(currNickname);

  const [ready, setReady] = React.useState(false);
  const readyRef = React.useRef(ready);

  const [started, setStarted] = React.useState(false);
  const startedRef = React.useRef(started);

  const [calibrate, setCalibrate] = React.useState(true);
  const calibrateRef = React.useRef(calibrate);

  const [currArtist, setCurrArtist] = React.useState("");
  const currArtistRef = React.useRef(currArtist);

  const [currEraser, setCurrEraser] = React.useState("");
  const currEraserRef = React.useRef(currEraser);

  const navigation = useNavigation();

  var ws = React.useRef(new WebSocket('wss://lit-eyrie-58570.herokuapp.com/')).current;   //This needs to altered to the IP of the server when attempting to get this to run. Double check each time. 

  const Connect = () => {
    if (ws.OPEN) {
      ws.send("s:c:" + roomID + ":" + nickName);
      setCurrNickname(nickName);
      nicknameRef.current = nickName;
      // _subscribe();
      // DeviceMotion.setUpdateInterval(100);
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
      //ws.send("m:coords:" + coordRef.current);    //Send messages
    });
  };

  const _Ready = () => {
    ws.send("m:ready=" + !readyRef.current);
    setReady(!readyRef.current);
    readyRef.current = !readyRef.current;
    //_subscribe();
    //_setCalibrate();
    //navigation.navigate("ButtonScreen" as any, ws);
  };

  const Back = () => {
    // _unsubscribe();
    ws.close();
    navigation.navigate("Home" as any)
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

  const _setCalibrate = () => {
    setCalibrate(!calibrateRef.current);
    calibrateRef.current = !calibrateRef.current;
  }

  const _whack = () => {
    setWhack(true);
    whackRef.current = true;
  }
  const _stopWhack = () => {
    setWhack(false);
    whackRef.current = false;
  }

  const correctGuess = () => {
    ws.send("m:answered");
    _unsubscribe();
  }

  React.useEffect(() => {
    DeviceMotion.setUpdateInterval(100);
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
      if (e.data === "Client Created!") {
        Vibration.vibrate();
        onConnection("Connected!");
      }
      if (e.data.split(":").length === 3) {
        let data = e.data.split(":");
        //console.log(data);
        if (data[2].startsWith("artist")) {
          setCurrArtist(data[2].split("=")[1]);
          currArtistRef.current = data[2].split("=")[1];
          console.log(currArtistRef.current);
          console.log(nicknameRef.current);
          if (data[2].split("=")[1] === nicknameRef.current) {
            _subscribe();
          }
          // else {
          //   _unsubscribe();
          // }
        }
        if (data[2].startsWith("eraser")) {
          setCurrEraser(data[2].split("=")[1]);
          currEraserRef.current = data[2].split("=")[1];
          console.log(currEraserRef.current);
          console.log(nicknameRef.current);
          if (data[2].split("=")[1] === nicknameRef.current) {
            _subscribe();
          }
          // else if(currArtistRef.current === nicknameRef.current) {
          //   _unsubscribe();
          // }
        }
        if (data[2].startsWith("word")) {
          setWord(data[2].split("=")[1]);
          wordRef.current = data[2].split("=")[1];
        }
        if (data[2] === "start") {
          setCalibrate(false);
          calibrateRef.current = false;
          setStarted(true);
          startedRef.current = true;
        }
      }
    };

    return () => _unsubscribe();
  }, [])

  return (
    <View style={globalStyles.screenContainer}>
      <View style={[globalStyles.headerContainer, { justifyContent: "space-evenly" }]}>
        {/* <Text style={globalStyles.headerText}>Top: Room Code</Text> */}
        <TouchableOpacity onPress={Back}>
          <MaterialIcons name="arrow-back" size={28} color='white' />
        </TouchableOpacity>

        <View style={globalStyles.headerSubContainer}>
          <TextInput style={globalStyles.textInput} placeholder='Room Code' onChangeText={onChangeText} editable={connection !== "Connected!"} />
          <TextInput style={globalStyles.textInput} placeholder='Nickname' onChangeText={onNickname} editable={connection !== "Connected!"} />

          <Button color="#5CB8B1" title={connection} onPress={Connect} />
        </View>
      </View>

      <View style={{ backgroundColor: "#5CB8B1", flex: 0.5 }}>
        <TouchableOpacity style={{
          flex: 1,
          flexDirection: "row",
          borderRadius: 20,
          backgroundColor: "#51FCC9",
          alignItems: "center",
          marginHorizontal: 50,
          marginVertical: 10,
          justifyContent: "center",
        }}
          onPress={_setCalibrate}>
          <Text style={{ color: 'white', fontSize: 20 }}>
            {calibrateRef.current && "Hide Calibration"}
            {!calibrateRef.current && "Show Calibration"}
          </Text>
        </TouchableOpacity>
      </View>

      {calibrateRef.current &&
        <View style={globalStyles.calibrationContainer}>

          {/* <Text style={{ alignSelf: "center" }}>Bottom: Calibrate</Text> */}
          <View style={globalStyles.calibrateRows}>
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
          </View>

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
          </View>

          {/* <TouchableOpacity style={[globalStyles.calibrationButtons, globalStyles.calibrationButtonExtra]} onPress={() => navigation.navigate("ButtonScreen", ws)}> */}
          {!startedRef.current &&
            <TouchableOpacity style={[globalStyles.calibrationButtons, globalStyles.calibrationButtonExtra]} onPress={_Ready}>
              <Text style={{ color: "white" }}>
                {!readyRef.current && "Ready!"}
                {readyRef.current && "Unready"}
              </Text>
            </TouchableOpacity>
          }

        </View>
      }
      {!calibrateRef.current &&
        <View style={globalStyles.calibrationContainer}>
          {(currArtistRef.current === nicknameRef.current || currEraserRef.current === nicknameRef.current) &&
            <View style={{
              flex: 1,
              backgroundColor: "#5CB8B1",
              flexDirection: "column",
            }}>
              <View style={{ display: 'flex', alignItems: 'center', backgroundColor: "#5CB8B1" }}>
                <Text style={{ color: "white", fontSize: 25 }}>
                  Current Word: {wordRef.current}
                </Text>
              </View>
              <TouchableOpacity style={[globalStyles.calibrationButtons,
              { marginTop: BUTTON_MARGIN, borderRadius: 20, display: 'flex', justifyContent: 'center', flex: 0.2 }]}
                onPress={correctGuess}>
                {/* <Text>Bottom Right</Text> */}
                <Text style={{ color: "white", fontSize: 25 }}>Someone Got It!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[globalStyles.calibrationButtons,
              { marginTop: BUTTON_MARGIN, borderRadius: 35, display: 'flex', justifyContent: 'center', flex: 0.8 }]}
                onPressIn={_whack} onPressOut={_stopWhack}>
                {/* <Text>Bottom Right</Text> */}
                {/* <MaterialIcons name='brush' size={50} color='white' /> */}
                {currEraserRef.current === nicknameRef.current &&
                  <MaterialCommunityIcons name='eraser' size={50} color='white' />
                }
                {currArtistRef.current === nicknameRef.current &&
                  <MaterialCommunityIcons name='brush' size={50} color='white' />
                }
              </TouchableOpacity>
            </View>
          }
          {
            currArtistRef.current !== nicknameRef.current &&
            currEraserRef.current !== nicknameRef.current && startedRef.current &&
            <View style={{ display: 'flex', alignItems: 'center', backgroundColor: "#5CB8B1" }}>
              <Text style={{ color: "white", fontSize: 25 }}>
                Current Artist: {currArtistRef.current}
                Current Eraser: {currEraserRef.current}
              </Text>
            </View>
          }
        </View>
      }
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