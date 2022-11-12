import {firebase, collectionGroup} from '@react-native-firebase/firestore';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

function ContactScreen() {
  var citiesRef = firebase.firestore().collection('cities');
  var museums = firebase
    .firestore()
    .collectionGroup('landmarks')
    .where('type', '==', 'museum');
  museums.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      console.log(doc.id, ' => ', doc.data());
    });
  });
  return (
    <ScrollView style={{backgroundColor: '#4F3B70'}}>
      <View style={{padding: 20}}>
        <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold'}}>
          My Chatlists
        </Text>
      </View>
      {/* <View
          style={{
            backgroundColor: '#ffffff',
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
          }}>
          {this.state.chats.map((chatroom, index) => (
            <View key={index} style={{marginTop: 20}}>
              <TouchableOpacity onPress={() => alert}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    alignItems: 'center',
                  }}>
                  <View style={{marginRight: 40}}>
                    <Image
                      source={{uri: chatroom?.photoURL}}
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
                      {chatroom.recieverId}
                    </Text>
                    <Text style={{fontSize: 16, color: '#000000'}}>
                      {chatroom.email}
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
                    {chatroom.time}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View> */}
    </ScrollView>
  );
}
export default ContactScreen;
