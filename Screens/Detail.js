import React,{useState,useEffect} from "react";

import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";

const DetailScreen = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

if (initializing) return null;
  const SignOut = () => {
    auth().signOut().then(() => { console.log("Sign out"); }).catch(error=>console.error(error))
}

  return (
    <View>
      <Text>DetailScreen</Text>
      {user ? (
        <View>
         <Text>{user.email}</Text>
         <Text>{user.uid}</Text>
         <Text>{user.displayName}</Text>
          <Button title="signOut" onPress={() => SignOut()} />
          </View>
      ) : (
          <View>
            <Text></Text>
            </View>
      )
      }
     
    </View>
  )
}


export default DetailScreen;