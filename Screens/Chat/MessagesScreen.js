import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
class MessagesScreen extends Component {
  state = {
    users: [],
  };
  constructor(props) {
    super(props);
    //this.getUser();
    //this.state = {text: ' '};
    this.subscriber = firebase
      .firestore()
      .collection('users')
      //.where('name', '==', this.state.text)
      .onSnapshot(docs => {
        let users = [];
        docs.forEach(doc => {
          users.push(doc.data());
        });
        this.setState({users});
        console.log(users);
      });
  }
  render() {
    const {navigation} = this.props;
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
                  navigation.navigate('Chat');
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    alignItems: 'center',
                  }}>
                  <View style={{marginRight: 40}}>
                    <Text>Image</Text>
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
