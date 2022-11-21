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
  Pressable
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {FlatList} from 'react-native-gesture-handler';
import ChatScreen from './Chat/Chat';
import {Icon} from '@rneui/base';

const ContactScreen = ({navigation}) => {
  const [allusers, setAllUsers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState([]);
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
            fullname:
              documentSnapshot.data().firstName +
              ' ' +
              documentSnapshot.data().lastName,
          });
        });

        setAllUsers(user.filter(it => it.key != auth().currentUser.uid));
        setLoading(false);

        // see next step
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);
  const initialState = [{}];
  const search = text => {
    setAllUsers(initialState);
    console.log(allusers);
    let searchuser = firebase
      .firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        const user = [];
        querySnapshot.forEach(documentSnapshot => {
          user.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            fullname:
              documentSnapshot.data().firstName +
              ' ' +
              documentSnapshot.data().lastName,
          });
        });
        setAllUsers(user.filter(it => it.key != auth().currentUser.uid));
        setLoading(false);
      });
    data = allusers;
    setAllUsers(data.filter(data => data.fullname.includes(text)));
  };
  const renderItem = ({item}) => {
    return (
      <View>
        <View
          style={{
            marginTop: 20,
            borderRadius: 20,
            marginTop: 27,
            backgroundColor: '#ffffff',
            marginHorizontal: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              handlechat(item.key);
            }}>
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                paddingVertical: 20,
                alignItems: 'center',
              }}>
              <View style={{marginRight: 40}}>
                <Image
                  source={
                    item?.photoURL
                      ? {uri: item?.photoURL}
                      : require('../images/default_image.png')
                  }
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
                  {item.firstName + ' ' + item.lastName}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const handlechat = async receiver => {
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
            navigation.navigate('Chat', {docid: documentSnapshot.id});
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
              navigation.navigate('Chat', {docid});
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
    return <ActivityIndicator />;
  }
  return (
    <View style={{ backgroundColor: '#4F3B70', flex: 1 }}>
      
      <View style={{ padding: 20 }}>
        <Pressable style={{ position: 'absolute', left: 20, top: 30 }}
      onPress={()=>navigation.goBack()}>
        <Icon name="arrowleft" type="ant-design" size={30} color={ "#fff"} />
      </Pressable>
        <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold',marginLeft:60}}>
          Contacts
        </Text>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <TextInput
            style={{
              width: '80%',
              backgroundColor: '#ffffff',
              height: 50,
              borderRadius: 20,
              padding: 15,
            }}
            onChangeText={newText => setusername(newText)}
            value={username}
            placeholder="Search"
            placeholderTextColor="#000000"
          />
          <TouchableOpacity
            onPress={() => search(username)}
            style={{
              backgroundColor: '#ffffff',
              width: '11%',
              height: 40,
              right: 0,
              position: 'absolute',
              borderRadius: 100,
              justifyContent: 'center',
            }}>
            <Icon name="search" size={30} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList data={allusers} renderItem={renderItem}></FlatList>
    </View>
  );
};

export default ContactScreen;
//class ContactScreen extends Component {
//  state = {
//    users: [],
//    chatRooms: [],
//    alreadyCreated: false,
//  };
//  checkRoom = async (data,user1,user2) => {
//    return new Promise(() => {
//      for (i = 0; i < data.length; i++){
//        if (
//          (user1 == data[i][0] && user2 == data[i][1]) ||
//          (user1 == data[i][1] && user2 == data[i][0])
//        ){
//          console.log('Chat Room Already Exist');
//          this.setState({alreadyCreated:true})
//          break;
//        }
//      }
//    })
//
//
//  }
//  handlechat = async (user1, user2) => {
//    await firebase
//      .firestore()
//      .collection('chatroom')
//      .get()
//      .then(data => {
//        let arr = [];
//        data.forEach(room => {
//          console.log(room.data());
//          arr.push(room.data()['participantId']);
//        });
//        this.setState({chatRooms: arr});
//        console.log('this is from chatRoom State array ', this.state.chatRooms);
//      });
//    if (this.state.chatRooms.length == 0) {
//      console.log("No chatroom exists creating new one");
//        firebase
//          .firestore()
//          .collection('chatroom')
//          //.where(recieverId && senderId, '!=', recieverId && senderId)
//          //.where('participantId.user1&&participantId.user2', '!=', user1 && user2)
//          .add({
//            participantId: [user1, user2],
//            latestTime: '',
//            latestMessages: '',
//          })
//          .then(docRef => {
//            const docid = docRef.id;
//            // this.props.navigation.navigate('Chat', {recieverId, docid});
//
//            this.props.navigation.navigate('Chat', {docid});
//            console.log(docRef.id);
//            console.log('Chat Room Created');
//          })
//          .catch(error => {
//            console.error('Error adding document: ', error);
//          });
//    } else {
//      let data = this.state.chatRooms;
//      await this.checkRoom(data,user1,user2).then(() => {
//        console.log(alreadyCreated);
//       })
////
////      this.state.chatRooms.forEach(data => {
////        console.log("this is incoming data" ,data)
////        if (
////          (user1 == data[0] && user2 == data[1]) ||
////          (user1 == data[1] && user2 == data[0])
////        ) {
////          console.log('Chat Room Already Exist');
////          this.setState({alreadyCreated: true});
////        } else {
////          console.log("Creating chat room");
////          firebase
////            .firestore()
////            .collection('chatroom')
////            //.where(recieverId && senderId, '!=', recieverId && senderId)
////            //.where('participantId.user1&&participantId.user2', '!=', user1 && user2)
////            .add({
////              participantId: [user1, user2],
////              latestTime: '',
////              latestMessages: '',
////            })
////            .then(docRef => {
////              const docid = docRef.id;
////              // this.props.navigation.navigate('Chat', {recieverId, docid});
////
////              this.props.navigation.navigate('Chat', {docid});
////              console.log(docRef.id);
////              console.log('Chat Room Created');
////            })
////            .catch(error => {
////              console.error('Error adding document: ', error);
////            });
////        }
////      });
//    }
////
//  };
//  constructor(props) {
//    super(props);
//
//
//    this.senderId = auth().currentUser.uid;
//    let sender = this.senderId;
//    console.log(sender);
//
//    this.userId = firebase
//      .firestore()
//      .collection('users')
//      .get()
//      .then(querySnapshot => {
//        let users = [];
//        querySnapshot.forEach(documentSnapshot => {
//          let user = documentSnapshot.data();
//          user.id = documentSnapshot.id;
//          users.push(user);
//          //console.log('User data: ', users);
//        });
//        this.setState({users: users});
//      });
//  }
//  render() {
//    const {linkTo} = this.props;
//    return (
//      <ScrollView style={{backgroundColor: '#4F3B70'}}>
//        <View style={{padding: 20}}>
//          <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold'}}>
//            Contacts
//          </Text>
//        </View>
//        {this.state.users.map((user, index) => (
//          <View
//            key={index}
//            style={{
//              marginTop: 20,
//              borderRadius: 20,
//              marginTop: 27,
//              backgroundColor: '#ffffff',
//              marginHorizontal: 20,
//            }}>
//            <TouchableOpacity
//              onPress={() => {
//                this.handlechat(user.id, this.senderId);
//              }}>
//              <View
//                style={{
//                  flexDirection: 'row',
//                  paddingHorizontal: 20,
//                  paddingVertical: 20,
//                  alignItems: 'center',
//                }}>
//                <View style={{marginRight: 40}}>
//                  <Image
//                    source={
//                      user?.photoURL
//                        ? {uri: user?.photoURL}
//                        : require('../images/default_image.png')
//                    }
//                    style={{width: 50, height: 50, borderRadius: 100}}
//                  />
//                </View>
//                <View style={{flexDirection: 'column'}}>
//                  <Text
//                    style={{
//                      fontSize: 16,
//                      fontWeight: 'bold',
//                      color: '#000000',
//                      marginBottom: 5,
//                    }}>
//                    {user.firstName}
//                    {user.lastName}
//                  </Text>
//                </View>
//              </View>
//            </TouchableOpacity>
//          </View>
//        ))}
//      </ScrollView>
//    );
//  }
//}
//
//export default ContactScreen;
