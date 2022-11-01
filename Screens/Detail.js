import React,{useState,useEffect} from "react";

import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";

const DetailScreen = ({ navigation }) => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      setUser(user)
    })
  },[])
  const SignOut = () => {
    auth().signOut().then(() => { console.log("Sign out"); navigation.navigate("Login"); }).catch(error=>console.error(error))
}

  return (
    <View>
      <Text>DetailScreen</Text>
      <Text>{user.email}</Text>
      <Text>{user.uid}</Text>
      <Text>{user.displayName}</Text>
      <Button title="signOut" onPress={()=>SignOut()}/>
    </View>
  )
}


export default DetailScreen;