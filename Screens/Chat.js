import React, {useLayoutEffect, useCallback, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

function ChatScreen({navigation}) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);
  /*useLayoutEffect(() => {
    const Unsubscribe= firebase
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
          })), 
        ))
        return Unsubscribe;
  }, []);*/

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerleft: () => {
        <View style={{marginLeft: 20}}>
          <Text>User's Profile</Text>
          <Text>User's name</Text>
        </View>;
      },
    });
  });
  return (
    <GiftedChat
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: 3,
      }}
    />
  );
}
export default ChatScreen;
