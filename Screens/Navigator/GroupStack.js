import {createStackNavigator} from '@react-navigation/stack';
import {Pressable, TouchableOpacity, View} from 'react-native';
import MainScreen from '../Group';
import ChatScreen from '../Chat/ChatScreen';
import AddScreen from '../GroupaddScreen';
import { Button, Icon, Avatar } from '@rneui/base';
import { Text } from "react-native";
import GroupInfoScreen from '../GroupInfo';
import { rotationHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/RotationGestureHandler';

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
        
        options={({ navigation, route }) => ({
        
          headerTitle: () => (
            <Text style={{fontWeight:'bold',fontSize:20,color:"#000"}}>{route.params.groupName}</Text>),
          headerLeft: () => (
           
            <View style={{ alignItems: 'center', flexDirection: "row" ,paddingLeft:20,}}>
              <Pressable onPress={()=>navigation.goBack()} style={{paddingRight:20,}}>
                <Icon  name='arrowleft'
                   type='ant-design'
                />
               </Pressable>
              <TouchableOpacity onPress={() => navigation.navigate("Group Info", { groupId:route.params.groupId})}>
              <Avatar
                size={40}
                rounded
                title={route.params.groupName[0]+route.params.groupName[1]}
                containerStyle={ {backgroundColor:"#4F3B70"}} />
            </TouchableOpacity>
            </View>
          )
        })
        
        }
        name="Groupchat"
        component={ChatScreen}></GroupStack.Screen>
      <GroupStack.Screen name="Group Info" component={GroupInfoScreen}></GroupStack.Screen>
      <GroupStack.Screen
        name="Create Group"
        component={AddScreen}></GroupStack.Screen>
    </GroupStack.Navigator>
  );
}
export default GroupScreen;
