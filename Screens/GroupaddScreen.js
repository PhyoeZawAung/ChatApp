import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, Button, Alert} from 'react-native';
import {Avatar, Icon} from '@rneui/base';
import {
  TextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native-gesture-handler';
import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function AddScreen({navigation}) {
  const [groupName, setgroupName] = useState();
  const [users, setUsers] = useState();
  const user1 = auth().currentUser.uid;
  const [groupMember, setgroupMember] = useState([user1]);
  const [nameMember, setnameMember] = useState([]);
  const date = new Date();

  const ref = firebase.firestore().collection('group');
  function create({groupName, groupMember}) {
    ref
      .add({
        groupName,
        groupMember,
        latestTime: date,
        latestMessage: 'Group created',
      })
      .then(doc => {
        const docid = doc.id;
        navigation.navigate('Groupchat', {docid});
        console.log(doc.id);
      });
  }

  const addMember = (members, namer) => {
    let data = groupMember;
    data.push(members);
    setgroupMember(data);
    let dataname = nameMember;
    dataname.push(namer);
    setnameMember(dataname);

    console.log(members);
    console.log(groupMember);
    console.log('Member', namer);
  };

  const name = firebase
    .firestore()
    .collection('users')
    .get()
    .then(querySnapshot => {
      let users = [];
      querySnapshot.forEach(documentSnapshot => {
        let user = documentSnapshot.data();
        user.id = documentSnapshot.id;
        users.push(user);
      });
      setUsers([...users, users]);
    });
  // useEffect(() => {
  //   let array = setUsers.map((item, index) => {
  //     item.isSelected = false;
  //     return {...item};
  //   });
  //   console.log(array);
  //   setUsers({users: array});
  // });
  // const selectionHandler = () => {
  //   isSelected: false;
  // };
  //const array = users.id.filter(element => element != groupMember);
  return (
    <View style={{backgroundColor: '#ffffff'}}>
      <View
        style={{
          backgroundColor: '#4F3B70',
          flexDirection: 'row',
          padding: 20,
          alignItems: 'center',
        }}>
        <TextInput
          style={{marginLeft: 40, width: '70%', color: '#ffffff'}}
          onChangeText={newText => setgroupName(newText)}
          value={groupName}
          placeholder="Name your group"
          placeholderTextColor="#ffffff"
        />
        <TouchableOpacity
          style={{
            width: 70,
            height: 40,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            borderRadius: 10,
          }}
          onPress={() => create({groupName, groupMember})}>
          <Text style={{color: '#000000', alignSelf: 'center'}}>Create</Text>
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: '#4F3B70'}}>
        <View style={{height: 40}}>
          <Text style={{fontSize: 16, color: '#ffffff'}}>
            <Text style={{fontSize: 16, color: '#ffffff'}}>Member:</Text>{' '}
            {nameMember}
          </Text>
        </View>
        <FlatList
          style={{backgroundColor: '#ffffff'}}
          data={users}
          renderItem={({item}) => {
            let isMember = groupMember.includes(item.id);
            return (
              <View
                style={{
                  borderBottomColor: '#4F3B70',
                  borderWidth: 1,
                  flexDirection: 'row',
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                }}>
                <Image
                  source={
                    item?.photoURL
                      ? {uri: item?.photoURL}
                      : require('../images/default_image.png')
                  }
                  style={{height: 40, width: 40, marginRight: 60}}
                />
                <Text style={{color: '#4F3B70', fontWeight: 'bold'}}>
                  {item.firstName}

                  {item.lastName}
                </Text>
                <View
                  style={{
                    backgroundColor: '#4F3B70',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    position: 'absolute',
                    right: 10,
                    borderRadius: 50,
                  }}>
                  <TouchableOpacity
                    disabled={isMember}
                    onPress={() => addMember(item.id, item.firstName)}>
                    <Text style={{color: '#ffffff'}}>
                      {isMember ? 'Added' : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
