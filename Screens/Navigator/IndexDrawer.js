import { createStackNavigator } from '@react-navigation/stack';
import { Pressable, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import MessagesScreen from '../Chat/MessagesScreen';
import ChatScreen from '../Chat/Chat';
import SearchScreen from '../Chat/Search';
import { Button, Icon, Avatar } from '@rneui/base';

const HomeStack = createStackNavigator();
function IndexScreen() {
return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Messages"
        component={MessagesScreen}
        options={({ navigation, route }) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('search')}>
              <Icon
                name="search"
                color="#4F3B70"
                style={{ marginRight: 20, fontSize: 20 }}
              />
            </TouchableOpacity>
          ),
        })}></HomeStack.Screen>
      <HomeStack.Screen name="Chat" component={ChatScreen}
        options={({ navigation, route }) => ({
          
          headerTitle: () => (
            <View style={styles.container}>
              <View>
                <Image
                  style={styles.image}
                  source={
                    route.params?.image
                      ? { uri: route.params.image }
                      : require('../../images/default_image.png')}
                />
              </View>
              <View style={styles.text}>
                <Text style={styles.name}>{route.params.firstName+ " " + route.params.lastName}</Text>
                <Text style={styles.status}>online</Text>
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