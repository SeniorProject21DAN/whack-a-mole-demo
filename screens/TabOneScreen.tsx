import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import * as firebase from "firebase";
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

  firebase.default.firestore().collection("Hey").add({
    num: 1,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
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
