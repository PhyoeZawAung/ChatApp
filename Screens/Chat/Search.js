import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
} from 'react-native';
import firestore, {firebase} from '@react-native-firebase/firestore';

class SearchScreen extends Component {
  state = {
    users: [],
    text: '',
  };
  constructor(props) {
    super(props);
    //this.getUser();
    //this.state = {text: ' '};
    this.subscriber = firebase
      .firestore()
      .collection('THREADS')
      //.where('name', '==', this.state.text)
      .onSnapshot(docs => {
        console.log(this.state.text);
        let users = [];
        docs.forEach(doc => {
          users.push(doc.data());
        });
        this.setState({users});
        console.log(users);
      });
  }
  /*.get()
      .then(querySnapshot => {
         console.log('Total users: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
        }
        );
      });
  }
  getUser = async () => {
    const userDocument = await firebase
      .firestore()
      .collection('THREADS')
      .doc('ABC')
      .get();
    console.log(userDocument);
  };*/

  render() {
    return (
      <View
        style={{backgroundColor: '#4F3B70', flex: 1, paddingHorizontal: 20}}>
        <View style={{marginTop: 20}}>
          <TextInput
            placeholder="yogurt"
            value={this.state.text}
            onChangeText={text => this.setState({text})}
            style={{borderRadius: 20}}
          />
          <Button title="search" onPress={this.subscriber} />
        </View>
        <View>
          {this.state.users.map((user, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                marginTop: 27,
              }}>
              <TouchableOpacity>
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
                      {user.name}
                    </Text>
                    <Text style={{fontSize: 16, color: '#000000'}}>
                      {user.age}
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
      </View>
    );
  }
}

export default SearchScreen;
