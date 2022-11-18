/*
import {firebase, collectionGroup} from '@react-native-firebase/firestore';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

class MessagesScreen extends Component {

  state = {
    chats: [],
    messages: [],
    name: '',
  };

  handlechat = docid => {
    this.props.navigation.navigate('Chat', {docid});
  };

  constructor(props) {
    super(props);

    this.nameId = firebase
      .firestore()
      .collection('chatroom')
      .where('participantId', '!=', auth().currentUser.uid)
      .get()

      console.log("Name ID::", this.nameId);

    this.userName = firebase
      .firestore()
      .collection('users')
      .where('id', '==', this.nameId) 
      .onSnapshot (doc => {
        //let firstName = doc.data().firstName
        //let lastName = doc.data().lastName
        //userName = firstName + " " + lastName
        this.setState({   
          name: doc.firstName+ " " + doc.lastName
        })
      }) 

    this.chatroom = firebase
      .firestore()
      .collection('chatroom')
      .where('participantId', 'array-contains', auth().currentUser.uid) 
      .get()
      .then(querySnapshot => {
        let chats = [];
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, ' => ', doc.data());
          let chatdetail = doc.data();
          chatdetail.id = doc.id;
          chatdetail.latestTime =
            doc.data().latestTime.toDate().getHours() +
            ':' +
            doc.data().latestTime.toDate().getMinutes();
          chats.push(chatdetail);
          console.log(chats);
        });
        this.setState({chats: chats});
        //console.log(chats);
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });

    var messages = firebase.firestore().collectionGroup('messages');
    
    messages.get().then(querySnapshot => {
      let messages = [];
      querySnapshot.forEach(doc => {
        let messageBox = doc.data();
        messages.push(messageBox);
        //console.log(doc.id, ' => ', doc.data());
      });
      this.setState({messages: messages});
    });

  }

  render() {
    return (
      <ScrollView style={{backgroundColor: '#4F3B70'}}>
        <View style={{padding: 20}}>
          <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold'}}>
            My Chatlists
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
          }}>
          {this.state.chats.map((chat, index) => (
            <View key={index} style={{marginTop: 20}}>
              <TouchableOpacity onPress={() => this.handlechat(chat.id)}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    alignItems: 'center',
                  }}>
                  <View style={{marginRight: 40}}>
                    <Image
                      source={require('../../images/default_image.png')}
                      style={{width: 50, height: 50, borderRadius: 100}}
                    />
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        color: '#000000',
                        marginBottom: 5,
                      }}>
                      { this.state.name }
                    </Text>
                    <Text style={{fontSize: 16, color: '#000000'}}>
                      {chat.latestMessages}
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
                    {chat.latestTime}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    );
    
  }
}
export default MessagesScreen;
*/
 

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image, 
  TouchableOpacity,
} from 'react-native';
import firestore, { firebase } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { FlatList } from 'react-native-gesture-handler';

const MessagesScreen = ({ navigation }) => {

  const [chatData, setChatData] = useState({})
  const [chatDataArray, setChatDataArray] = useState([]);

  const handlechat = (chatroomId) => {
    console.log(chatroomId);
    navigation.navigate('Chat', { docid : chatroomId });
  }

  useEffect(() => {

    async function fromChat() {

      let arr = [];
      console.log('START');
      try {
        await firebase
          .firestore()
          .collection('chatroom')
          .where('participantId', 'array-contains', auth().currentUser.uid)
          .get()
          .then(querySnapshot => {   
            let user0, user1;
            let chatData = {}; 
            querySnapshot.forEach(documentSnapshot => {
              
              chatData.chatroomId = documentSnapshot.id;
              console.log("Chat Room ID:: ", chatData.chatroomId)

              user0 = documentSnapshot.data()['participantId'][0];
              user1 = documentSnapshot.data()['participantId'][1];
              if (auth().currentUser.uid != user0) {
                chatData.userId = user0;
              } else {
                chatData.userId = user1;
              }

              console.log("USER ID:: ", chatData.userId);

              getUserData(chatData.userId).then(item => {
                chatData.name = item.name;
                chatData.image = item.image;

                console.log("Name ::", chatData.name);
                console.log("Image ::", chatData.image);

                let time1 = documentSnapshot.data().latestTime.nanoseconds
                let time2 = new Date(time1 * 1000);
                let hour = time2.getHours();
                let minute = time2.getMinutes();
                chatData.lastTime = hour + ":" + minute;
                console.log("Last Time:: ", chatData.lastTime);

                chatData.lastMessage = documentSnapshot.data().latestMessages;
                console.log("Last Message:: ", chatData.lastMessage);
                console.log("====================================")
                
                setChatData({chatData: chatData})
                arr.push({ ...chatData })
              })  
            })  
            setChatDataArray(arr);
            console.log("Chat Data Array:: ", chatDataArray);  
            // console.log("Chat Data Array ::: ", arr);
            // return arr;    
          }) 
           
      } catch (error) {
        console.log("Error trying to get data from chatroom::", error);
      }
    }   
    //setChatDataArray(fromChat()) 
    fromChat(); 
             
  }, [])   
 

  
  // const userData = (id) => {
  //   return new Promise( (resolve, reject) => { 
  //     const data = {};
  //     firebase
  //       .firestore()
  //       .collection('users')
  //       .doc(id)
  //       .get()
  //       .then( docRef => {
  //         data.name = docRef.data().firstName + " " + docRef.data().lastName;
  //         data.image = docRef.data().photoURL;
  //       })
  //       console.log("PHOTO:: ", data.image);
  //       console.log("NAME::: ", data.name);
  //     if (data){
  //       resolve(data);
  //     }else {
  //       reject(); 
  //     } 
  //   })
  // }

  // const getUserData = async(id) => {
  //   const result =  await userData(id);
  //   console.log("RESULT:: ", result);
  // }


  const getUserData = async (id) => {
    const data = {};
    try {
      await firebase
        .firestore()
        .collection('users')
        .doc(id)
        .get()
        .then(docRef => {
          data.name = docRef.data().firstName + " " + docRef.data().lastName;
          data.image = docRef.data().photoURL;
        })
      console.log("Name from function::: ", data.name);
      return data;

    } catch (error) {
      console.log(error);
    }
  }

  // async function getData(id) {
  //   const userData = await getUserData(id)
  //   return userData;
  // }

  const ChatListItem = ({ item }) => {
    return (
      <View>
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity onPress={() => { handlechat(item.chatroomId) }}>
            <View 
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                paddingVertical: 20,
                alignItems: 'center',
              }}>
              <View style={{ marginRight: 40 }}>
                <Image
                  source={
                    item?.image
                      ? { uri: item.image }
                      : require('../../images/default_image.png')}
                  style={{ width: 50, height: 50, borderRadius: 100 }}
                />
              </View>
              <View style={{ flexDirection: 'column' }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#000000',
                    marginBottom: 5,
                  }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 16, color: '#000000' }}>
                  {item.lastMessage}
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
                {item.lastTime}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  return (
    <View style={{ backgroundColor: '#4F3B70' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 32, color: 'white', fontWeight: 'bold' }}>
          My Chatlists
        </Text>
      </View>
      <View style={{
        backgroundColor: '#ffffff',
        borderTopRightRadius: 40,
        borderTopLeftRadius: 40,
      }}>
        <FlatList data={chatDataArray} renderItem={ChatListItem} />
      </View>
    </View>
  )
}

export default MessagesScreen;


/*
function getUserData() {
  try{
  firebase
    .firestore()
    .collection('users')
    .doc(chatData.userId)
    .get()
    .then(docRef => {
      //let userData = {}
      chatData.name = docRef.data().firstName + " " + docRef.data().lastName
      chatData.photo = docRef.data().photoURL;
      //setUser(userData);
      console.log("Chat id::", chat.id);
      console.log("User Data::", user);
    })
} catch (error) {
  console.log("Error", error)
}
}
 
  const fromUser = async() => {
    let ids = chat.map( data => data.userId)
    console.log("ID:::::", ids);
    try{    
      await firebase
      .firestore()
      .collection('users')
      .doc()  
      .get()
      .then(docRef => {
        let userData = {}
        userData.name = docRef.data().firstName + " " + docRef.data().lastName
        userData.photo = docRef.data().photoURL;
        setUser(userData);  
        console.log("Chat id::", chat.id);
        console.log("User Data::", user);
      })
    } catch(error){
        console.log(error);
    }
  }
 
useEffect(() => {
          
  firebase
    .firestore()
    .collection('chatroom')
    .onSnapshot(querySnapShot => {
      let chatData = {}; 
      let user0; 
      let user1;
      querySnapShot.forEach(documentSnapshot => {
        user0 = documentSnapshot.data()['participantId'][0];
        user1 = documentSnapshot.data()['participantId'][1];
        if (auth().currentUser.uid != user0) {
          chatData.id = user0;
        } else {
          chatData.id = user1; 
        }
        chatData.lastMessage = documentSnapshot.data().latestMessages;
        //chatData.lastTime = documentSnapshot.data().latestTime;
        //chatData.lastTime = documentSnapshot.data().latestTime.nanoseconds.toDate().getHours() +
        //':' + documentSnapshot.data().latestTime.nanoseconds.toDate().getMinutes();

        let time1 = documentSnapshot.data().latestTime.nanoseconds
        let time2 = new Date(time1 * 1000)
        let hour = time2.getHours();
        let minute = time2.getMinutes();
        chatData.lastTime = hour + ":" + minute;
        console.log("Time::: ", chatData.lastTime)
      })
      setChatData(chatData);
      console.log("Chat Data:: ", chat);
    })
  

  fromChat();
  //fromUser();

  const display = () => {
    setListItem([...listItem, 
      chat,
    ])
    console.log("Final Output:: ", listItem);
  }

  return () => display();
}, [])
*/



/*
  const fromChat = async () => {
    try {
      console.log("START")
      await firebase
        .firestore()
        .collection('chatroom')
        .get()
        .then(querySnapshot => {
          let chatDataArray = [];
          let chatData = {};
          let user0;
          let user1;
          querySnapshot.forEach(documentSnapshot => {
            chatData.chatroomId = documentSnapshot.id;
            user0 = documentSnapshot.data()['participantId'][0];
            user1 = documentSnapshot.data()['participantId'][1];
            if (auth().currentUser.uid != user0) {
              chatData.userId = user0;
              try {
                console.log("INSIDE IF");
                firebase
                  .firestore()
                  .collection('users')
                  .doc(chatData.userId)
                  .get()
                  .then(docRef => {
                    chatData.name = docRef.data().firstName + " " + docRef.data().lastName
                    chatData.photo = docRef.data().photoURL;
                    console.log("User Data::", chatData.name, chatData.photo);
                    
                  })
              } catch (error) {
                console.log("Error", error)
              }
            } else {
              chatData.userId = user1;
              try {
                firebase
                  .firestore()
                  .collection('users')
                  .doc(chatData.userId)
                  .get()
                  .then(docRef => {
                    chatData.name = docRef.data().firstName + " " + docRef.data().lastName
                    chatData.photo = docRef.data().photoURL;
                    console.log("User Data::", chatData.name, chatData.photo);
                  })
              } catch (error) {
                console.log("Error", error)
              }
            }
            console.log("OUT OF IF")
            chatData.lastMessage = documentSnapshot.data().latestMessages;
 
            let time1 = documentSnapshot.data().latestTime.nanoseconds
            let time2 = new Date(time1 * 1000);
            let hour = time2.getHours();
            let minute = time2.getMinutes();
            chatData.lastTime = hour + ":" + minute;
            console.log("Time::: ", chatData.lastTime)
 
            chatDataArray.push(chatData);
            console.log("Chat Data:: ", chatDataArray);
             
          });
          setChatData(chatDataArray);
          console.log("Chat Data Array:: ", chat);
        }) 
 
    } catch (error) {   
      console.log(error);
    }
  }
 
  useEffect(() => {
    fromChat();
    const display = () => {
      setChatData(chat);
      console.log("Final Output:: ", chat);
    }
    return () => display();
  }, [])
*/