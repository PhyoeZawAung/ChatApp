

import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import firestore, { firebase } from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import { FlatList } from "react-native-gesture-handler";
import database from "@react-native-firebase/database";
import { ref } from "yup";
import {Avatar, Dialog} from '@rneui/base';

const MessagesScreen = ({ navigation }) => {
  const [chatData, setChatData] = useState([]);
  const [chatDataArray, setChatDataArray] = useState([]);
  const [loading, setloading] = useState(true);
  const [currentChatUsersId, setCurrentChatUserId] = useState([]);
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

  const handlechat = (chatroomId, firstName, lastName, image, status) => {
    console.log(chatroomId);
    navigation.navigate('Chat', {
      docid: chatroomId,
      firstName: firstName,
      lastName: lastName,
      image: image,
      status: status,
    });
  }


  useEffect(() => {
    const user = auth().currentUser.uid;
        const isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };
    const userId = auth().currentUser.uid;

    const reference = database().ref(`/status/${userId}`);
    database()
      .ref('.info/connected')
      .on('value', snapshot => {
        console.log(snapshot.val());
        
        reference
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            console.log('disconnected function set');
            reference.set(isOnlineForDatabase);
          });
      });
    const subscriber = firestore().collection('chatroom')
      .where('participantId', 'array-contains', auth().currentUser.uid)
      .onSnapshot(async querySnapshot => {
        let doc = querySnapshot.docs;
        let array = [];
        for (i = 0; i < doc.length; i++){
          let chatRoomData = {};
          console.log(doc[i]._data['participantId']);
          let user0 = doc[i]._data['participantId'][0];
          let user1 = doc[i]._data['participantId'][1];
          let id = user;
          if (user == user0) id = user1;
          else id = user0;
          await getUser(id).then(user => {
            chatRoomData.chatRoomId = doc[i].id;
            chatRoomData.lastMessage = doc[i].data().latestMessages;
            let time1 = doc[i].data().latestTime;
            let time2 = new Date(time1 * 1000);
            chatRoomData.lastTime = convertTime(time2);
            
            chatRoomData.firstName = user.firstName;
            chatRoomData.lastName = user.lastName;
            chatRoomData.image = user.photoURL;
            array.push(chatRoomData);
          })
          await getUserStatus(id).then(status => {
            console.log(status);
            chatRoomData.status = status;
          })

        }
        setChatData(array);
        setloading(false);
      })
                  
    
    return () => subscriber();
  }, []);
  
  const getUserStatus = (uid) => {
    return new Promise((resolve) => {
      database().ref(`/status/${uid}`).on('value', snapshot => {
        resolve(snapshot.val());
      })
    })
  }
  const getUser = (uid) => {
    return new Promise((resolve) => {
      firestore().collection('users').doc(uid)
        .get().then(data => {
          
          resolve(data.data());
      })
   })
 }
  

  const ChatListItem =  ({ item }) => {
    

    return (
      <View>
        <View>
          <TouchableOpacity
            onPress={() => {
              handlechat(item.chatRoomId, item.firstName, item.lastName, item.image, item.status);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: 18,
                alignItems: "center",
                borderBottomWidth: 0.2,
                marginHorizontal: 20,
                borderBottomColor:'#cccccc'
              }}
            >
              <View style={{ marginRight: 20 }}>
                <Avatar
                  title={item.firstName[0]+item.lastName[0]}
                  size={50}
                  containerStyle={{ backgroundColor: '#4F3B70' }}
                  rounded
                  source={
                    item?.image
                      ? { uri: item.image }
                      : null
                  }
                  
                />
                <Avatar.Accessory
                  size={13}
                  style={{borderRadius:200,backgroundColor: item.status?.state == 'online' ?
                    '#90ff90' : '#dc2121'
                  }}
                  iconStyle={{width:0,height:0}}
                  rounded
            ></Avatar.Accessory>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: "#606060",
                    marginBottom: 5,
                  }}
                >
                  {item.firstName + ' ' + item.lastName}
                </Text>
                <Text style={{ fontSize: 14, color: "#91918e" }}>
                  {item.lastMessage}
                </Text>
              </View>

              <Text
                style={{
                  position: "absolute",
                  top: 22,
                  right: 0,
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#606060",
                }}
              >
                {item.lastTime}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="small"/>
      <Text style={{fontSize: 20, color: '#4F3B70', fontWeight: '700'}}>loading chat...</Text>
    </View>
    )
  }
  return (
    <View style={{ backgroundColor: "#4F3B70" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, color: "white", fontWeight: "bold" }}>
          My Chatlists
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#ffffff",
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          paddingTop:20,
          
        }}
      >
        <FlatList data={chatData} renderItem={ChatListItem} />
      </View>
    </View>
  );
};

export default MessagesScreen;
