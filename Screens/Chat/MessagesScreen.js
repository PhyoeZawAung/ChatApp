import {firebase, collectionGroup} from '@react-native-firebase/firestore';
import React, {Component, useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';

class MessagesScreen extends Component {
  state = {
    chats: [],
    messages: [],
  };
  handlechat = docid => {
    this.props.navigation.navigate('Chat', {docid});
  };
  constructor(props) {
    super(props);
    this.chatroom = firebase
      .firestore()
      .collection('chatroom')
      .where('participantId', 'array-contains', auth().currentUser.uid)
      //.where('participantId.user1', '==', auth().currentUser.uid)
      //.where('participantId.user1', '==', auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        let chats = [];
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, ' => ', doc.data());
          let chatdetail = doc.data();
          chatdetail.id = doc.id;
          chatdetail.latestTime = doc.data().latestTime.toDate();
          chats.push(chatdetail);
          console.log(chats);
        });
        this.setState({chats: chats});
        //console.log(chats);
      })
      .catch(error => {
        console.log('Error getting documents: ', error);
      });
    //messages
    var messages = firebase.firestore().collectionGroup('messages');
    //.where('type', '==', 'museum');
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
                      {chat.id}
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
                    }}>.
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
