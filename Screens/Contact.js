import React, {useEffect, useState, Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Button,
  TextInput,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FlatList} from 'react-native-gesture-handler';
import ChatScreen from './Chat/Chat';
import {Avatar, Icon} from '@rneui/base';

const ContactScreen = ({navigation}) => {
  const [allusers, setAllUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState([]);
  const [allUsersBackup, setAllUsersBackup] = useState([]);
  const [username, setusername] = useState();

  const date = new Date();

  useEffect(() => {
    setCurrentUserId(auth().currentUser.uid);
    const subscriber = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        const user = [];
        querySnapshot.forEach(documentSnapshot => {
          user.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            fullname:( documentSnapshot.data().firstName +
              ' ' + documentSnapshot.data().lastName
            ).toLowerCase()            
          });
        });
 
        setAllUsers(user.filter(it => it.key != auth().currentUser.uid));
        setAllUsersBackup(user.filter(it => it.key != auth().currentUser.uid));
        setLoading(false);

        // see next step
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);
  const search = text => {
    text = text.toLowerCase();
    setAllUsers(allUsersBackup.filter(it => it.fullname.match(text)));
  };
  const renderItem = ({item}) => {
    return (
      <View
      style={{
        backgroundColor: '#ffffff',
      }}>
        <View
          style={{
            marginHorizontal:16,
            borderBottomColor: "#cccccc",
            borderBottomWidth:0.5,
          }}>
          <TouchableOpacity
            onPress={() => {
              handlechat(item.key,item.firstName,item.lastName,item.photoURL);
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 16,
                paddingVertical: 16,
                alignItems: 'center',
              }}>
              <View style={{ marginRight:16 }}>
                <Avatar title={item.firstName[0] + item.lastName[0]}
                  size={50}
                  rounded
                  containerStyle={{ backgroundColor: "#4F3B70" }}
                  source={
                    item?.photoURL
                      ? {uri: item?.photoURL}
                      : null
                  }/>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: '#606060',
                  }}>
                  {item.firstName + ' ' + item.lastName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const handlechat = async (receiver,firstName,lastName,image) => {
    await firestore()
      .collection('chatroom')
      .get()
      .then(querySnapshot => {
        let exist = false;
        querySnapshot.forEach(documentSnapshot => {
          user0 = documentSnapshot.data()['participantId'][0];
          user1 = documentSnapshot.data()['participantId'][1];

          if (
            (user0 == receiver && user1 == currentUserId) ||
            (user0 == currentUserId && user1 == receiver)
          ) {
            console.log('Chat Room already exist');
            navigation.navigate('Chat', { docid: documentSnapshot.id, firstName:firstName,lastName:lastName,image:image});
            exist = true;
            return false;
          }
        });
        if (!exist) {
          firestore()
            .collection('chatroom')
            .add({
              participantId: [receiver, currentUserId],
              latestTime: date,
              latestMessages: '',
            })
            .then(docRef => {
              const docid = docRef.id;
              navigation.navigate('Chat', {docid,firstName:firstName,lastName:lastName,image:image});
              console.log(docRef.id);
              console.log('Chat Room Created');
            })
            .catch(error => {
              console.error('Error adding document: ', error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading All Users....</Text>
        <ActivityIndicator size={40}/>
        </View>
    )
  }
  return (
    <View style={{ backgroundColor: '#4F3B70',}}>
      
      <View style={{ paddingTop: 10 }}>
        <Pressable style={{ position: 'absolute', left: 20, top: 20 }}
      onPress={()=>navigation.goBack()}>
        <Icon name="arrowleft" type="ant-design" size={30} color={ "#fff"} />
      </Pressable>
        <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold',marginLeft:60}}>
          Contacts
        </Text>
        <View style={{
          flexDirection: 'row', marginTop: 10, backgroundColor: "#fff", alignItems: 'center', justifyContent:'center',
        }}>
          <View style={{position:'absolute' ,right:40,zIndex:10,top:35,}}>
            <Icon name="search" size={20} color={'#909090'} />
          </View>
          <TextInput
            style={{
              width: '90%',
              backgroundColor: '#f0f0f0',
              height: 50,
              marginTop: 20,
              marginBottom:6,
              elevation: 2,
              borderRadius:22,
              paddingLeft:40,
            }}
            onChangeText={newText => {
              search(newText);
            }}
            value={username}
            placeholder={"Search"}
            placeholderTextColor="#909090"
          />
        </View>
      </View>
      <View>
       <FlatList style={{backgroundColor:"#fffff"}} data={allusers} renderItem={renderItem}></FlatList>
      </View>
      
    </View>
  );
};

export default ContactScreen;

