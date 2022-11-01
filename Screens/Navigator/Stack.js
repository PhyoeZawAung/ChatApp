import React from "react";

import LoginScreen from "../Login";
import SignUpScreen from "../SignUp";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DetailScreen from "../Detail";


const Stack = createStackNavigator();
const StackScreen = () => 
{
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen name="SignUp" component={SignUpScreen} />

        
        <Stack.Screen name="Login" component={LoginScreen} />
        
        <Stack.Screen name= "Detail" component={DetailScreen}/>
      </Stack.Navigator>

    </NavigationContainer>
  )
}

export default StackScreen;