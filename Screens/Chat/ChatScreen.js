import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useRoute} from '@react-navigation/native';
import {useLayoutEffect} from 'react';
import {useEffect, useState, useCallback} from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {
  GiftedChat,
  InputToolbar,
  Composer,
  Send,
  Actions,
  MessageImage,
} from 'react-native-gifted-chat';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import {Icon} from '@rneui/base';
function ChatScreen({navigation}) {
  const [photo, setPhoto] = useState();
  const chatroomId = firebase
    .firestore()
    .collection('chatroom')
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        console.log(documentSnapshot.data());
        let chatroom = documentSnapshot.data();
        chatroom.id = documentSnapshot.id;
      });
    });
  const route = useRoute();
  const sender = firebase.auth().currentUser;
  if (sender !== null) {
    const uid = sender.id;
  }
  const [messages, setMessages] = useState([]);
  useLayoutEffect(() => {
    const Unsubscribe = firebase
      .firestore()
      .collection('group')
      .doc(route.params.docid)
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

  const onSend = useCallback(messages => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    const {_id, createdAt, text, user} = messages[0];
    firebase
      .firestore()
      .collection('group')
      .doc(route.params.docid)
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
    firebase
      .firestore()
      .collection('group')
      .doc(route.params.docid)
      .update({
        latestMessages: text,
        latestTime: createdAt,
      })
      .then(() => {
        console.log('latest added');
      });
  }, []);
  const selectImage = async () => {
    console.log('selectImage');
    await launchImageLibrary({
      quality: 0.5,
    }).then(data => {
      console.log(data.assets[0].uri);
      let referenceURL =
        'data/' +
        auth().currentUser.uid +
        '/images/' +
        data.assets[0].fileName +
        '.jpg';
      const reference = storage().ref(referenceURL);
      const task = reference.putFile(data.assets[0].uri);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(async () => {
        const date = new Date();

        const url = await storage().ref(referenceURL).getDownloadURL();
        console.log(url);
        await firebase
          .firestore()
          .collection('group')
          .doc(route.params.docid)
          .collection('messages')
          .add({
            _id: uuid.v4(),
            createdAt: date,
            image: url,
            user: {
              _id: auth().currentUser.uid,
              name: auth().currentUser.displayName,
              avatar: auth().currentUser.photoURL,
            },
          });
        await firebase
          .firestore()
          .collection('group')
          .doc(route.params.docid)
          .update({
            latestMessages: 'Send a photo',
            latestTime: date,
          });
      });
    });
  };
  const getImageFromCamera = async () => {
    console.log('Get from camera');
    await launchCamera({
      quality: 0.5,
    }).then(data => {
      console.log(data.assets[0].uri);
      let referenceURL =
        'data/' +
        auth().currentUser.uid +
        '/images/' +
        data.assets[0].fileName +
        '.jpg';
      const reference = storage().ref(referenceURL);
      const task = reference.putFile(data.assets[0].uri);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(async () => {
        const date = new Date();

        const url = await storage().ref(referenceURL).getDownloadURL();
        console.log(url);
        await firebase
          .firestore()
          .collection('group')
          .doc(route.params.docid)
          .collection('messages')
          .add({
            _id: uuid.v4(),
            createdAt: date,
            image: url,
            user: {
              _id: auth().currentUser.uid,
              name: auth().currentUser.displayName,
              avatar: auth().currentUser.photoURL,
            },
          });
        await firebase
          .firestore()
          .collection('group')
          .doc(route.params.docid)
          .update({
            latestMessages: 'Send a photo',
            latestTime: date,
          });
      });
    });
  };
  const customRenderAction = props => {
    return (
      <Actions
        {...props}
        options={{
          ['Select Image']: selectImage,
          ['Open camera']: getImageFromCamera,
        }}
        icon={() => <Icon name={'attachment'} size={28} />}
      />
    );
  };
  const customRenderMessageImage = props => {
    return (
      <View>
        <MessageImage {...props} imageStyle={{width: 180, height: 200}} />
      </View>
    );
  };
  return (
    <GiftedChat
      renderActions={customRenderAction}
      renderComposer={props1 => (
        <Composer {...props1} textInputStyle={{color: 'blue'}} />
      )}
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages)}
      user={{
        _id: auth().currentUser.uid,
        name: auth().currentUser.displayName,
        avatar: auth().currentUser.photoURL,
      }}
      renderMessageImage={customRenderMessageImage}></GiftedChat>
  );
}

export default ChatScreen;
