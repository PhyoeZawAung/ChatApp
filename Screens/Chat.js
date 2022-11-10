import React
  from "react";
import { useEffect } from "react";
import { Text, View, Button,StyleSheet ,Image} from "react-native";



const ChatScreen = ({ navigation }) => {
  useEffect(() => {
    function f1() {
      return (new Promise(Resolve => {
        setTimeout(() => {
          Resolve("Resolve");
        },5000)
        
      }))
     
    }

    async function mes() {
      const msg = await f1();
      console.log("This is afeter ", msg);
      const msg1 = await f1();
      console.log("HTIsi flkadkjja");
    }
    mes();
  },[])
  return (
    <View style={styles.thanthan}>
      <Button title="Edit" onPress={() => {
        navigation.navigate("Me");
      }} />
     
    </View>
  )
}

const styles = StyleSheet.create({
  thanthan: {
    backgroundColor:"#f00"
  }
})

export default ChatScreen;