import React, {useState} from 'react';

import {View, Text, TextInput, Pressable, StyleSheet,ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [showhide, setShowHide] = useState(true);
  const Show = showhide => {
    if (showhide == true) {
      return false;
    } else return true;
  };
  const signIn = (email, password) => {
    if (email != '' && password != '') {
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
          alert('signed in!');
         
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }
    
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
          if (error.code === "auth/wrong-password") {
            console.log("Wrong password");
            ToastAndroid.showWithGravity(
              "Wrong Password",
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            )
         }
          console.error(error);
        });
    }
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.signUpCard}>
        <Text style={styles.header}>Login</Text>
        <Text style={styles.text}>Please Sign In to Continue</Text>

        <View style={styles.InputBox}>
          
          <TextInput
            placeholder="example@gmail.com"
            style={styles.gmailInput}
            onChangeText={text => setEmail(text)}
          />

          <View style={styles.passwordInput}>
            <TextInput
              placeholder="Password"
              style={styles.inputField}
              onChangeText={text => {
                setPassword(text);
              }}
              secureTextEntry={showhide}
            />
            <Pressable
              onPress={() => {
                setShowHide(Show(showhide));
              }}>
              <Text style={styles.showhidebutton}>
                {showhide ? 'Show' : 'Hide'}
              </Text>
            </Pressable>
          </View>

          
          <Pressable
            style={styles.button}
            onPress={() => {
              signIn(email, password);
            }}> 
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
          </Pressable>
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
  passwordInput: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    paddingLeft: 20,
  },
  showhidebutton: {
    color: '#e211d1',
    paddingRight: 20,
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
export default LoginScreen;
