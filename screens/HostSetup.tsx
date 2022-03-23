import React, { useState, useEffect } from 'react';
import { ImagePickerIOS, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { useNavigation } from '@react-navigation/native';
import { SlideFromRightIOS } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import { globalStyles } from '../components/globalStyles';
import { DeviceMotion } from 'expo-sensors';
import { Subscription } from 'expo-modules-core';
import { FlatList } from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LENGTH = 5; // Length of the Room ID
const BUTTON_MARGIN = 8;

const generateID = () => {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
// var roomID = generateID();
// console.log(roomID);

export default function HostSetup() {
  const navigation = useNavigation();

  const [players, setPlayers] = useState([
    { text: "Host", key: "1" },
    { text: "Example1", key: "2" },
    { text: "Example2", key: "3" },
    { text: "Example3", key: "4" },
    { text: "Example4", key: "5" },
    { text: "Example5", key: "6" },
    { text: "Example6", key: "7" },
  ]);

  var ws = React.useRef(new WebSocket('ws://153.106.227.143:8080')).current;   //This needs to altered to the IP of the server when attempting to get this to run. Double check each time. 
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

      if (whackRef.current) {
        setWhack(false);
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

  React.useEffect(() => {
    const serverMessagesList = [];
    ws.onopen = () => {
      // console.log("Connection Attempt.");
      ws.send("s:h:" + roomID);
      console.log("Connected!");
      _subscribe();
      DeviceMotion.setUpdateInterval(100);
    };
    ws.onclose = (e) => {
      _unsubscribe();
    };
    ws.onerror = (e) => {
    };
    ws.onmessage = (e) => {
      // console.log(e);
      const messageArray = e.data.split(":");
      if (!players.includes(messageArray[0])) {
        newPlayerHandler(messageArray[0]);
      } else if (messageArray[1] == "CLOSED") {
        removePlayerHandler(messageArray[0]);
      }

    };

    return () => _unsubscribe();
  }, [])

  const send = () => {
    // console.log("placeholder");
    ws.send("m:buzz");
  }

  const newPlayerHandler = (name) => {
    setPlayers((newPlayer) => {
      return [
        { text: name, key: Math.random().toString() }, ...newPlayer]
    })
  }

  const removePlayerHandler = (name) => {
    setPlayers((removePlayer) => {
      return removePlayer.filter(players => players.text != name)
    })
  }

  return (
    <View style={globalStyles.screenContainer}>
      <View style={globalStyles.headerContainer}>
        <TouchableOpacity style={globalStyles.backButton} onPress={() => navigation.navigate("Home")}>
          <MaterialIcons name='arrow-back' size={28} color='white' />
        </TouchableOpacity>
        <Text style={globalStyles.headerText}>Room Code: {roomID}</Text>
        <TouchableOpacity style={globalStyles.backButton}>
          <MaterialIcons name='cast' size={28} color='white' />
        </TouchableOpacity>
      </View>
      <View style={globalStyles.connectedPlayersContainer}>
        {/* <Text>Middle: Current Players</Text> */}
        <FlatList numColumns={3} data={players} renderItem={({ item }) => (
          <View style={globalStyles.playersListItems}>
            <Text style={globalStyles.playersListText}>{item.text}</Text>
          </View>
        )} />
      </View>

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
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-evenly"
  },
  headerContainer: {
    flex: 1,
    backgroundColor: "brown",
    alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",

  },
  connectedPlayersContainer: {
    flex: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "lightgreen",
    alignItems: "center",

  },
  calibrationContainer: {
    flex: 3,
    backgroundColor: "lightblue",
    // alignItems: "flex-start",
    // flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  calibrateRows: {
    flex: 1,
    backgroundColor: "lightblue",
    flexDirection: "row",
  },
  calibrationButtons: {
    flex: 1,
    backgroundColor: "purple",
    // borderRadius: 15,
    alignSelf: "stretch",
    margin: 20,
    alignItems: "center"
  },
  backButton: {
    borderRadius: 75,
    margin: 20,
    // backgroundColor: "black",
    alignSelf: "center"
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
    justifyContent: "center",

  },
  sidesText: {

  },
  playersListItems: {
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    height: 55,
    margin: 5,
    flex: 1
  },
  playersListText: {
    margin: 10,
  },
});