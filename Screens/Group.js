import { View, Text, ScrollView, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useEffect } from 'react';
import { Avatar } from '@rneui/base';

export default function MainScreen({navigation}) {
  const [group, setgroup] = useState([]);
  const ref = firebase.firestore().collection('group');
  const chatroom = (groupId, groupName) => {
    navigation.navigate('Groupchat', { groupId, groupName });
  };
  function convertTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var time = hours + ":" + minutes + " " + ampm;
    return time;
  }
 
  useEffect(() => {
    const subscriber = ref.where('groupMember', 'array-contains', auth().currentUser.uid)
      .onSnapshot(querySnapshot => {
        let group = [];
        querySnapshot.forEach(doc => {
        let mygroup = doc.data();
        mygroup.id = doc.id;

        let time1 = doc.data().latestTime;
        let time2 = new Date(time1 * 1000);
        mygroup.latestTime = convertTime(time2);
        
        group.push(mygroup);
        })
        setgroup(group);
      })
    return () => subscriber();
  },[])
  return (
    <View style={{ backgroundColor: '#4F3B70' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}>
          My Groups
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#ffffff',
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
        }}>
        <FlatList
          data={group}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity onPress={() => chatroom(item.id, item.groupName)}>
                <View
                  style={{
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    paddingVertical: 18,
                    alignItems: "center",
                    borderBottomWidth: 0.2,
                    marginHorizontal: 20,
                    borderBottomColor:'#cccccc'
                  }}>
                  <Avatar title={item.groupName[0]+item.groupName[1]} size={50}
                    containerStyle={{ backgroundColor: "#4F3B70" }}
                   rounded/>
                  <View style={{ flexDirection: 'column' ,marginLeft:20,}}>
                    
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '700',
                        color: "#606060",
                        marginBottom: 5,
                      }}>
                      {item.groupName}
                    </Text>
                    <Text style={{fontSize: 14,color: "#91918e"}}>
                      {item.latestMessages}
                    </Text>
                  </View>
                  <Text
                    style={{
                      position: 'absolute',
                      right: 25,
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#606060",
                    }}>
                    {item.latestTime}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}
