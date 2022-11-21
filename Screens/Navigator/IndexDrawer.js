import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity} from 'react-native';
import MessagesScreen from '../Chat/MessagesScreen';
import ChatScreen from '../Chat/Chat';
import SearchScreen from '../Chat/Search';
import Icon from 'react-native-vector-icons/FontAwesome';
import {OneChatHeader} from '../../components/OneChatHeader';

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
                color="#4F3B70"
                style={{marginRight: 20, fontSize: 20}}
              />
            </TouchableOpacity>
          ),
        })}></HomeStack.Screen>
      <HomeStack.Screen name="Chat" component={ChatScreen}
        options= {({navigation,route}) => ({
          header: () => <OneChatHeader 
            image={route.params.image} 
            name={route.params.name}
            status={route.params.status} />
        })}
      ></HomeStack.Screen>
      <HomeStack.Screen
        name="search"
        component={SearchScreen}
        options={{headerShown: false}}></HomeStack.Screen>
    </HomeStack.Navigator>
  );
}
export default IndexScreen;
