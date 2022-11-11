import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useRoute} from '@react-navigation/native';
import {useLayoutEffect} from 'react';
import {useEffect, useState, useCallback} from 'react';
import {View, Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
function ChatScreen({navigation}) {
  const route = useRoute();
  useEffect(() => {
    navigation.setOptions({
      title: '',
      headerLeft: () => (
        <View style={{flexDirection: 'row'}}>
          <Text>Image</Text>
          <Text>{route.params.userId.user.firstName} </Text>
          <Text>{route.params.userId.user.lastName} </Text>
        </View>
      ),
    });
  });
  const sender = firebase.auth().currentUser;
  if (sender !== null) {
    const uid = sender.id;
  }
  const [messages, setMessages] = useState([]);
  useLayoutEffect(() => {
    const Unsubscribe = firebase
      .firestore()
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            image: doc.data().image,
          })),
        ),
      );
    return Unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    firebase
      .firestore()
      .collection('messages')
      .add({
        _id,
        createdAt,
        text,
        user,
      })
      .then(() => {
        console.log('User added!');
      });
  }, []);
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth().currentUser.email,
      }}
    />
  );
}
export default ChatScreen;
