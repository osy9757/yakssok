import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import NewsScreen from '../content/NewsScreen';
// import NewsDetailScreen from '../content/NewsDetailScreen';
import { useScrollToTop } from "@react-navigation/native";
import NewsScreen from '../content/NewsScreen2';
import NewsDetailScreen from '../content/NewsDetailScreen2';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
const Stack = createNativeStackNavigator();

const NewsNavigator = ({route, navigation}) => {

  return (
      <Stack.Navigator initialRouteName='NewsScreen' screenOptions={{headerShown:false, animation:'fade_from_bottom'}}>
        <Stack.Screen name='NewsScreen' component={NewsScreen} initialParams={route.params} />
        {/* <Stack.Screen name='NewsScreen2' component={NewsScreen} /> */}
        <Stack.Screen name='NewsDetailScreen' component={NewsDetailScreen} />
        {/* <Stack.Screen name='NewsDetailScreen2' component={NewsDetailScreen2} /> */}
      </Stack.Navigator>
  )
}

export default NewsNavigator;