import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList, Button, Alert, ToastAndroid} from 'react-native';
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
  function create({ groupName, groupMember }) {
    if (typeof (groupName) == "undefined") {
      alert("Plaease Set Group Name");
      ToastAndroid.showWithGravity(
        "Plaease Set Group Name",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      )
      return false;
    }
    ref
      .add({
        groupName,
        admin: user1,
        groupMember,
        latestTime: date,
        latestMessage: 'Group created',
      })
      .then(doc => {
        const groupId = doc.id;
        navigation.navigate('Groupchat', {groupId,groupName});
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

    ToastAndroid.showWithGravity(
      `added ${namer}`,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
    )
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
      setUsers([...users]);
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
          style={{marginLeft: 40, width: '70%', color: '#ffffff',borderBottomWidth:1,borderBottomColor:"grey"}}
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
        <FlatList
          style={{backgroundColor: '#ffffff'}}
          data={users}
          renderItem={({item}) => {
            let isMember = groupMember.includes(item.id);
            return (
              <View
                style={{
                  borderBottomColor: '#4F3B70',
                  borderBottomWidth: 0.5,
                  flexDirection: 'row',
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  marginHorizontal:12,
                  paddingVertical: 20,
                }}>
                
                <Avatar title={item.firstName[0] + ' ' + item.lastName[0]} size={50} rounded
                  containerStyle={{backgroundColor:"#4F3B70"}}
                 source={
                  item?.photoURL
                    ? {uri: item?.photoURL}
                    : null}/>
                
                <Text style={{color: '#4F3B70', fontWeight: 'bold',marginLeft:20}}>
                  {item.firstName+' ' +item.lastName}
                </Text>
                <View
                  style={{
                    
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    position: 'absolute',
                    right: 10,
                    borderRadius: 50,
                  }}>
                  <TouchableOpacity
                    disabled={isMember}
                    onPress={() => addMember(item.id, item.firstName +' '+ item.lastName)}>
                    {isMember ? <Icon
                               name="check"
                               type="ant-design"
                               size={24}
                               color={'#3fb585'}
                 /> : <Icon
                                  name="addusergroup"
                                  type="ant-design"
                                  size={24}
                                  color={'#0c93f4'}/>}
                   
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