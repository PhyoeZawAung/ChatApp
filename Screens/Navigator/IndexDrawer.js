import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity} from 'react-native';
import MessagesScreen from '../Chat/MessagesScreen';
import ChatScreen from '../Chat/ChatScreen';
import SearchScreen from '../Chat/Search';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeStack = createStackNavigator();
function IndexScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Messages"
        component={MessagesScreen}
        options={({navigation, route}) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('search')}>
              <Icon
                name="search"
                color="blue"
                style={{marginRight: 20, fontSize: 20}}
              />
            </TouchableOpacity>
          ),
        })}></HomeStack.Screen>
      <HomeStack.Screen name="Chat" component={ChatScreen}></HomeStack.Screen>
      <HomeStack.Screen
        name="search"
        component={SearchScreen}
        options={{headerShown: false}}></HomeStack.Screen>
    </HomeStack.Navigator>
  );
}
export default IndexScreen;
