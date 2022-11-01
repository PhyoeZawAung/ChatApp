import React from "react";

import { View, Text, Pressable ,StyleSheet} from "react-native";



const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>Logo is here</Text>
      </View>
      <View>
      <Pressable
            style={styles.button}
            onPress={() => {
              navigation.navigate("Login")
            }}> 
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Login with Email</Text>
        </Pressable>
        <Pressable onPress={()=>{navigation.navigate("Forgot")}}>
          <Text style={styles.text}>Forgotten Password?</Text>
        </Pressable>

      </View>
      <View>
        <View  style={styles.signup}>
          <Text style={styles.text}>New User?  </Text>
          <Pressable onPress={() => { navigation.navigate("SignUp") }}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </Pressable>
        </View>
        

      </View>
      
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9b5de0',
    flex: 1,
    padding: 30,
    justifyContent: "space-between",
    alignItems:"center",
  },
  button: {
    width: 350,
    backgroundColor: '#e211d1',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
  },
  signup: {
    flexDirection: "row",
    alignItems:"center",
  },
  text: {
    color: "#fff",
    fontWeight:"bold",
  },
  signUpText: {
    color: "#46eeaa",
    fontWeight: "bold",
    fontSize:18
  }
})
export default StartScreen;