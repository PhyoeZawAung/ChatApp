import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
class ContactScreen extends Component {
  state = {
    users: [],
  };
  handlechat = (user1, user2) => {
    firebase
      .firestore()
      .collection('chatroom')
      //.where(recieverId && senderId, '!=', recieverId && senderId)
      //.where('participantId.user1&&participantId.user2', '!=', user1 && user2)
      .add({
        participantId: [user1, user2],
        latestTime: '',
        latestMessages: '',
      })
      .then(docRef => {
        const docid = docRef.id;
        //this.props.navigation.navigate('Chat', {recieverId, docid});

        this.props.navigation.navigate('Chat', {docid});
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
          if( auth().currentUser.uid != documentSnapshot.id ){
            let user = documentSnapshot.data();
            user.id = documentSnapshot.id;
            users.push(user);
            console.log('User data: ', users);
          }
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
            Contacts
          </Text>
        </View>
        {this.state.users.map((user, index) => (
          <View
            key={index}
            style={{
              marginTop: 20,
              borderRadius: 20,
              marginTop: 27,
              backgroundColor: '#ffffff',
              marginHorizontal: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                this.handlechat(user.id, this.senderId);
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
                      user?.photoURL
                        ? {uri: user?.photoURL}
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
                    {user.firstName + " " + user.lastName}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  }
}

export default ContactScreen;
