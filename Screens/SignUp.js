import React, {useState} from 'react';
import { useSelector, useDispatch ,Provider} from 'react-redux';
import { SetUser } from '../Redux/User/UserAction';
import {View, Text, TextInput, Pressable, StyleSheet,ToastAndroid} from 'react-native';
import auth from '@react-native-firebase/auth';
import store from '../Redux/stroe';
const SignUpScreen = ({navigation}) => {
  const [showhide, setShowHide] = useState(true);
  const dispatch = useDispatch();
  const setUserName = (firstName,lastName) => {
    dispatch(SetUser({ firstName: firstName, lastName: lastName,nameAdded:true }));
  }
  const Show = showhide => {
    if (showhide == true) {
      return false;
    } else return true;
  };
  const signup = (email, password) => {
    if (email != '' && password != '') {
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
          
          ToastAndroid.showWithGravity(
            "Account Create Successfully",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          )
          
      
        })
        .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.log('That email address is already in use!');
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }

          console.error(error);
        });
        
        
     
    }
  };


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.signUpCard}>
        <Text style={styles.header}>Register</Text>
        <Text style={styles.text}>Please Sign Up Your Account</Text>

        <View style={styles.InputBox}>
          <View style={styles.name}>
            <TextInput
              style={styles.nameInput}
              placeholder="first name"
              onChangeText={(text) => { setFirstName(text) }}></TextInput>
            <TextInput
              style={styles.nameInput}
              placeholder="last name"
            onChangeText={(text) =>{setLastName(text)}}></TextInput>
          </View>
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

          <View style={styles.passwordInput}>
            <TextInput
              placeholder="Comfirm Password"
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
              signup(email, password);
              setUserName(firstName,lastName);
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Register</Text>
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
  name: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  nameInput: {
    backgroundColor: '#fff',
    width: 50,
    borderRadius: 5,
    width: '48%',
    paddingLeft: 16,
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
export default SignUpScreen;
