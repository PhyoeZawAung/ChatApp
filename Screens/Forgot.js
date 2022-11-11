import React, {useState} from 'react';

import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Dialog} from '@rneui/base';
const ForgotScreen = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const Forgot = async email => {
    await auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setVisible(true);
      })
      .catch(error => {
        alert(JSON.stringify(error));
      });
  };
  const [email, setEmail] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.signUpCard}>
        <Text style={styles.header}>Forgottened Password</Text>
        <Text style={styles.text}>
          Please Fill Yout Email Address to Receive Reset Mail Link
        </Text>

        <View style={styles.InputBox}>
          <TextInput
            placeholder="example@gmail.com"
            style={styles.gmailInput}
            onChangeText={text => setEmail(text)}
          />

          <Pressable
            style={styles.button}
            onPress={() => {
              Forgot(email);
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Send Link</Text>
          </Pressable>
          <Dialog overlayStyle={{backgroundColor: '#fff'}} isVisible={visible}>
            <Dialog.Title title="Password Reset Mail Send"></Dialog.Title>
            <Text>Please Check Your Gmail And Click the link.</Text>
            <Text>If you don't find any mail check in your spam folder</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                navigation.navigate('Login');
                setVisible(false);
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                go to login
              </Text>
            </Pressable>
          </Dialog>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9b5de0',
    flex: 1,
    padding: 30,
  },

  header: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#fff',
    paddingVertical: 16,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  InputBox: {
    width: '100%',

    paddingVertical: 40,
  },

  gmailInput: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingLeft: 16,
  },

  button: {
    width: '100%',
    backgroundColor: '#e211d1',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
  },
});
export default ForgotScreen;
