import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
class MessagesScreen extends Component {
  state = {
    users: [],
  };
  handlechat = (recieverId, senderId) => {
    firebase
      .firestore()
      .collection('chatroom')
      .add({
        recieverId,
        senderId,
      })
      .then(docRef => {
        const docid=docRef.id
        this.props.navigation.navigate('Chat', {recieverId, docid});
        console.log(docRef.id);
        console.log('Chat Room Created');
      })
      .catch(error => {
        console.error('Error adding document: ', error);
      });
  };
  constructor(props) {
    super(props);
    //this.getUser();
    //this.state = {text: ' '};

    // this.subscriber = firebase
    //   .firestore()
    //   .collection('users')
    //   .onSnapshot(docs => {
    //     let users = [];
    //     docs.forEach(doc => {
    //       users.push(doc.data());
    //     });
    //     this.setState({users});
    //     console.log(users);
    //   });
    //  this.cities= firebase.firestore().collection("cities").doc("LA").set({
    //     name: "Los Angeles",
    //     state: "CA",
    //     country: "USA"
    // })
    // .then(() => {
    //     console.log("Document successfully written!");
    // })
    // .catch((error) => {
    //     console.error("Error writing document: ", error);
    // });

    this.senderId = auth().currentUser.uid;
    let sender = this.senderId;
    console.log(sender);

    this.userId = firebase
      .firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        let users = [];
        querySnapshot.forEach(documentSnapshot => {
          let user = documentSnapshot.data();
          user.id = documentSnapshot.id;
          users.push(user);
          //console.log('User data: ', users);
        });
        this.setState({users: users});
      });
  }
  render() {
    const {linkTo} = this.props;
    return (
      <ScrollView style={{backgroundColor: '#4F3B70'}}>
        <View style={{padding: 20}}>
          <Text style={{fontSize: 32, color: 'white', fontWeight: 'bold'}}>
            Messages
          </Text>
        </View>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderTopRightRadius: 40,
            borderTopLeftRadius: 40,
          }}>
          {this.state.users.map((user, index) => (
            <View key={index} style={{marginTop: 20}}>
              <TouchableOpacity
                onPress={() => {
                  this.handlechat({user}, this.senderId);
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
                      source={{uri: user?.photoURL}}
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
                      {user.firstName}
                      {user.lastName}
                    </Text>
                    <Text style={{fontSize: 16, color: '#000000'}}>
                      {user.email}
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
                    {user.time}
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
