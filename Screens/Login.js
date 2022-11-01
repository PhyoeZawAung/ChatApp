import React, { useState } from "react";

import { View, Text, TextInput, Pressable,StyleSheet,TouchableHighlight } from "react-native";
import auth from "@react-native-firebase/auth";

const LoginScreen = ({navigation}) => {

  const Login = (email,password) => {
    if (email != "" && password != "") {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
          alert('User account created & signed in!');
          navigation.navigate("Detail");
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
    }
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <View style={styles.container}>
      <View style={styles.signUpCard}>
        <Text>SignUp</Text>
        <TextInput placeholder="Email"
        onChangeText={(text)=>setEmail(text)}/>
        <TextInput placeholder="Password"
          onChangeText={(text) => { setPassword(text) }} />
        <Pressable onPress={() => {
          Login(email, password);
        }}>
          <Text>Login</Text>
        </Pressable>
         
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#9b5de0",
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
  },
  signUpCard: {
    width: "80%",
    
    alignItems: "center",
    backgroundColor: "#fff",
    elevation: 15,
    borderRadius: 10,
    padding:26,
    
  }
})
export default LoginScreen;