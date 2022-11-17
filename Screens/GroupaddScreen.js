import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, Button, Alert} from 'react-native';
import {Avatar} from '@rneui/base';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {color} from 'react-native-reanimated';

export default function MainScreen({navigation}) {
  const [groupName, setgroupName] = useState();
  const [users, setUsers] = useState();
  const user1 = auth().currentUser.uid;
  const [groupMember, setgroupMember] = useState([user1]);

  const ref = firebase.firestore().collection('group');
  function create({groupName, groupMember}) {
    ref
      .add({
        groupName,
        groupMember,
        latestTime: '',
        latestMessage: 'Group created',
      })
      .then(docRef => {
        const docid = docRef.id;
        navigation.navigate('Groupchat', {docid});
      });
  }

  const addMember = members => {
    let data = groupMember;
    data.push(members);
    setgroupMember(data);
    console.log(groupMember);
    console.log('Member', members);
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
      <View style={{marginTop: 40, backgroundColor: '#ffffff'}}>
        <FlatList
          style={{backgroundColor: '#ffffff'}}
          data={users}
          renderItem={({item}) => (
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
                <TouchableOpacity onPress={() => addMember(item.id)}>
                  <Text style={{color: '#ffffff'}}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}
