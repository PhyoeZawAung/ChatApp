import {createStackNavigator} from '@react-navigation/stack';
import {TouchableOpacity} from 'react-native';
import MainScreen from '../Group';
import ChatScreen from '../Chat/ChatScreen';
import AddScreen from '../GroupaddScreen';
import {Icon} from '@rneui/base';

const GroupStack = createStackNavigator();
function GroupScreen() {
  return (
    <GroupStack.Navigator>
      <GroupStack.Screen
        name="My Group"
        component={MainScreen}
        options={({navigation, route}) => ({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Create Group')}>
              <Icon
                name="group-add"
                color="blue"
                style={{marginRight: 20, fontSize: 20}}
              />
            </TouchableOpacity>
          ),
        })}></GroupStack.Screen>
      <GroupStack.Screen
        name="Groupchat"
        component={ChatScreen}></GroupStack.Screen>
      <GroupStack.Screen
        name="Create Group"
        component={AddScreen}></GroupStack.Screen>
    </GroupStack.Navigator>
  );
}
export default GroupScreen;
