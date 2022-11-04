import React,{useState,useEffect} from "react";

import { View, Text, Button,Image } from "react-native";
import auth from "@react-native-firebase/auth";
import store from "../Redux/stroe";
import { Provider,useSelector } from "react-redux";
const DetailScreen = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const firstname = useSelector((store) => store.firstName);
  const lastName = useSelector((store) => store.lastName);
  // Handle user state changes
  useEffect(() => {
    const user = auth().currentUser;
    setUser(user)
  },[2])
  

  const SignOut = () => {
    auth().signOut().then(() => { console.log("Sign out"); }).catch(error=>console.error(error))
} 

  return (
    <Provider store={store}>
    <View>
      <Text>DetailScreen</Text>
      {user ? (
        <View>
         <Text>{user.email}</Text>
         <Text>{user.uid}</Text>
            <Text>{user.displayName}</Text>
            <Text>{firstname}</Text>
            <Text>{lastName}</Text>
            <Text>{user.photoURL}</Text>
            <Image source={{uri:user.photoURL}} style={{width:100,height:100}}/>
          <Text>{JSON.stringify(user.emailVerify)}</Text>
          <Text>{JSON.stringify(user.metadata)}</Text>
          <Button title="signOut" onPress={() => SignOut()} />
          </View>
      ) : (
          <View>
            <Text>No User</Text>
            </View>
      )
      }
     
      </View>
    </Provider>
  )
}


export default DetailScreen;