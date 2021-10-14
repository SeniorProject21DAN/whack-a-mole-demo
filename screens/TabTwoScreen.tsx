import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, RefreshControl } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { FlatList } from 'react-native-gesture-handler';
import * as Paho from '../components/paho-mqtt'
import { RootTabScreenProps } from '../types';

export default function TabTwoScreen({ route, navigation }: RootTabScreenProps<'TabTwo'>) {
  let [machines] = useState([
    { title: 'Washer 1:', key: '1', test: true },
    { title: 'Washer 2:', key: '2', test: true },
    { title: 'Dryer 1:', key: '3', test: true },
    { title: 'Dryer 2:', key: '4', test: true },
])

let client: any = new Paho.Client('localhost', 4200, "/", 'washroom');   //Creates new client that connects to host (calvin IoT) on specific port
client.onMessageArrived = onMessageArrived;     //Defines reaction to a new message 
client.onConnectionLost = onConnectionLost;
var options = {     //options for the MQTT connection
    useSSL: true,
    keepAliveInterval: 60,
    onSuccess: onConnect,
    onFailure: onFail,
    password: 'NA',
    userName: 'NA',
};
client.connect(options);

//On connection success to the host
function onConnect() {
    console.log("Connected!");
//         Publishes and subscribes to the name that was passed in from either the apartment or dorm picker screens. A different topic is published and subscribed based on the card selected in either picker. 
    client.publish("cs326/washroom/" + route.params + "/request", "request")   //Sends request message to the backend raspberry pi in a different topic to avoid confusion in the data interpreter. 
    client.subscribe("cs326/washroom/" + route.params);   //Subscribe to the apartment or dorms topic
}

// On failure to connect to the host
function onFail(context: any) {
    console.log(context);
    console.log("Connection failed!");
    // on screen pop up to show failure to connect
    Alert.alert('Failure to Connect',
        "Unable to connect to host. Try again later.",
        [
            { text: "OK" }
        ],
    )
}

// Called when a message arrives from the subscribed topic, interprets the data coming in from the sensor source, presumably soon after connection and request is published. 
function onMessageArrived(message: any) {
    console.log("Message Arrived:" + message.payloadString);
    // console.log(message.payloadString.length)
    if (message.payloadString.length == 4) {            // Confirm that the string is no longer than 4 char long, make sure invalid data is not being read in. 
        for (let i = 0; i < message.payloadString.length; i++) {        // Interprets the data from the sensor unit, the string of length 4. If the corresponding part of the string is 1, then the machine is on, otherwise the machine is off. 
            if (message.payloadString[i] == '1') {
                machines[i].test = false
            } else {
                machines[i].test = true
            }
        }
    }
}

// called when the client loses its connection. Originally had an alert for loss of connection, but with refreshing options and shifting between dorms and apartments, the message popped up to much.
function onConnectionLost(responseObject: any) {
    if (responseObject.errorCode !== 0) {
        console.log("Connection Lost:" + responseObject.errorMessage);
    }
}

// Code for the refresh element in the flat list. Creates a wait time for the refresh. 
const wait = (timeout: any) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

// Refresh state, false when not currently refreshing, true when in the refreshing state.
const [refreshing, setRefreshing] = React.useState(false);

// Refresh function called in the flatlist, sets refreshing to true, waits for 2000 milliseconds and then returns refreshing back to false. 
const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
}, []);

return (
        <View>
            <View>
                <FlatList data={machines} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />} renderItem={({ item }) => (
                        <View>
                            {/* TIMER CODE, SCRAPPED DUE TO TIME AND COMPLEXITY WITH THE SENSOR SETUP. LEFT IN DUE TO SIMPLICITY AND FUTURE WORK POSSIBILITIES. */}
                            {/* <Text style={globalStyles.subtitleText}>{item.title}</Text>
                        <CountDown
                            until={0}
                            // onFinish={() => alert('Finished')}
                            onPress={() => alert('Hello World')}
                            size={20}
                            timeToShow={['M', 'S']}
                            digitStyle={globalStyles.digitStyleWasher}
                            digitTxtStyle={globalStyles.digitTextStyleWasher}
                        /> */}
                        </View>
                    )} />

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
