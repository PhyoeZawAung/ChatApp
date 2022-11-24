import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import MessagesScreen from '../Chat/MessagesScreen';
import ChatScreen from '../Chat/Chat';
import SearchScreen from '../Chat/Search';
import { Button, Icon, Avatar } from '@rneui/base';
import { DrawerActions } from '@react-navigation/native';

const HomeStack = createStackNavigator();
function IndexScreen({navigation}) {
return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Messages"
        component={MessagesScreen}
        options={({ navigation, route }) => ({
          headerLeft: () => (
            <TouchableOpacity onPress={()=>navigation.openDrawer()}>
              <Icon
                name="menu-open"
                size={30}
                style={{ marginHorizontal: 20, }}
              />
            </TouchableOpacity>
          ),
        })}></HomeStack.Screen>
      <HomeStack.Screen name="Chat" component={ChatScreen}
        options={({ navigation, route }) => ({
          
          headerTitle: () => (
            <View style={styles.container}>
              <View>
                <Avatar 
                  size={40}
                  rounded
                  containerStyle={{ backgroundColor: "#4F3B70"}}
                  source={
                    route.params?.image
                      ? { uri: route.params.image }
                      : null}
                />
               
              </View>
              <View style={styles.text}>
                <Text style={styles.name}>{route.params.firstName + " " + route.params.lastName}</Text>
                
                {
                  route.params.status?.state == 'online' ? (<Text
                    style={styles.status}>online</Text>) : (<Text
                      style={styles.status}>Offline</Text>)
                }
              </View>
            </View>
          )
        })}
      ></HomeStack.Screen>
      <HomeStack.Screen
        name="search"
        component={SearchScreen}
        options={{ headerShown: false }}></HomeStack.Screen>
    </HomeStack.Navigator>
  );
}
export default IndexScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 0,
    alignItems: 'center',
  },

  image: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderRadius: 100,
    marginRight: 10,
  },

  text: {
    marginLeft:16,
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 0,
  },

  name: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
  },

  status: {
    fontSize: 13,
    fontWeight: '400',
    color: '#000000',
  }
})