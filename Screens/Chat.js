import React
  from "react";
import { Text, View, Button,StyleSheet ,Image} from "react-native";



const ChatScreen = ({navigation}) => {
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