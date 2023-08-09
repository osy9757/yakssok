import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

import React, { useEffect } from 'react';
import ChatList from '../chat/ChatList';
// import Chat from '../chat/Chat';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();
const Stack = createStackNavigator();

const ChatNavigator = ({navigation, route}) => {

   return (
      <Stack.Navigator screenOptions={{headerShown: false, animation:'fade'}}>
        <Stack.Screen name='ChatList' component={ChatList} initialParams={{'userInfo':route.params.userInfo}}/>
        {/* <Stack.Screen name='Chat' component={Chat} /> */}
      </Stack.Navigator>
  )
}

export default ChatNavigator;