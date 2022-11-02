import React,{useState,useEffect} from "react";

import { View, Text, Button } from "react-native";
import auth from "@react-native-firebase/auth";
import store from "../Redux/stroe";
import { Provider,useSelector } from "react-redux";
const DetailScreen = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const firstname = useSelector((store) => store.firstName);
  const lastName = useSelector((store) => store.lastName);
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