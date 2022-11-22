import {View, Text, ScrollView, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useState} from 'react';
import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function MainScreen({navigation}) {
  const [group, setgroup] = useState();
  const ref = firebase.firestore().collection('group');
  const chatroom = (groupId ,groupName)=> {
    navigation.navigate('Groupchat', {groupId,groupName});
  };
  const getGroup = ref
    .where('groupMember', 'array-contains', auth().currentUser.uid)
    .get()
    .then(querySnapshot => {
      let group = [];
      querySnapshot.forEach(doc => {
        let mygroup = doc.data();
        mygroup.id = doc.id;
        mygroup.latestTime =
          doc.data().latestTime.toDate().getHours() +
          ':' +
          doc.data().latestTime.toDate().getMinutes();
        group.push(mygroup);
      });
      setgroup([...group]);
    });

  return (
    <View style={{backgroundColor: '#4F3B70'}}>
      <View style={{padding: 20}}>
        <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold'}}>
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
          renderItem={({item}) => (
            <View>
              <TouchableOpacity onPress={() => chatroom(item.id,item.groupName)}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    alignItems: 'center',
                  }}>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000000',
                        marginBottom: 5,
                      }}>
                      {item.groupName}
                    </Text>
                    <Text style={{fontSize: 16, color: '#000000'}}>
                      {item.latestMessages}
                    </Text>
                  </View>
                  <Text
                    style={{
                      position: 'absolute',
                      right: 25,
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#000000',
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
