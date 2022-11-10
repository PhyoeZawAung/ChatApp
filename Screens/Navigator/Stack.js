import React, { useState, useEffect } from "react";

import LoginScreen from "../Login";
import SignUpScreen from "../SignUp";
import ImageUploader from "../ImageUploader";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DetailScreen from "../Detail";

import StartScreen from "../StartScreen";
import ForgotScreen from "../Forgot";
import store from "../../Redux/stroe";
import { Provider } from "react-redux";
import auth from "@react-native-firebase/auth";
import MessagesScreen from "../Chat/MessagesScreen";
import ChatScreen from "../Chat/ChatScreen";
import MeScreen from "../Me";
const Stack = createStackNavigator();

const StackScreen = () => 
{

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    // Handle user state changes
    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false); 
    }
  
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      // unsubscribe on unmount
    });
  
  if (initializing) return null;

  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (<Stack.Group>
                <Stack.Screen name="Start" component={StartScreen}/>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="Forgot" component={ForgotScreen} />
                
            </Stack.Group>
          ) : (
              
              <Stack.Group>
                {user.displayName == null ? (
                  <>
                    <Stack.Screen name="Upload" component={ImageUploader} />
                    {/*<Stack.Screen name="Detail" component={DetailScreen} />*/}
                    {/*<Stack.Screen name="Detail" component={DetailScreen} />*/}
                    <Stack.Screen name="Chat" component={ChatScreen} />
                    <Stack.Screen name ="Me" component={MeScreen}/>
                  </>
                  
                ) : (
                    <>
                       {/*<Stack.Screen name="Detail" component={DetailScreen} />*/}
                      {/*<Stack.Screen name="Detail" component={DetailScreen} />*/}
                      <Stack.Screen name="Chat" component={ChatScreen} />
                      <Stack.Screen name ="Me" component={MeScreen}/>
                    </>
                 
                )}
              
              
              
            </Stack.Group>
        )}



            
        
      </Stack.Navigator>

    </NavigationContainer>
    </Provider>
  )
}

export default StackScreen;
/*
<Stack.Screen name="Upload" component={ImageUploader} />
<Stack.Screen name="Detail" component={DetailScreen} />
*/