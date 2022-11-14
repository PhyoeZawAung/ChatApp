import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Dialog} from '@rneui/base';

const LoginScreen = ({navigation}) => {
  const [showhide, setShowHide] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const Show = showhide => {
    if (showhide == true) {
      return false;
    } else return true;
  };
  const signIn = async (email, password) => {
   
    if (email == "") {
      ToastAndroid.showWithGravity(
        'Emter Email',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return false;
    }
    if (password == '') {
      ToastAndroid.showWithGravity(
        'Emter Password',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
      return false;
    }
    if (email != '' && password != '') {
      setLoading(true);
      console.log('Enter Sign process');
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
          setLoading(false);
          //alert('signed in!');
        })
        .catch(error => {
          if (error.code === 'auth/user-not-found') {
            console.log('User Not Found');
            setError("User Not found");
            setLoading(false);
            toggleDialog();
          }

          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
            setError('That email address is invalid!');
            setLoading(false);
            toggleDialog();
          }
          if (error.code === 'auth/wrong-password') {
            console.log('Wrong password');
            ToastAndroid.showWithGravity(
              'Wrong Password',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
            setLoading(false);
            setError('Wrong password');
            toggleDialog();
          }
          if (error.code === 'auth/too-many-requests') {
            setError('Too many Request wait for a minute and try again');
            setLoading(false);
            toggleDialog();
          }
          console.log(error);
        });
    }
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toggleDialog = () => {
    setDialog(!dialog);
  };
  return (
    <View style={styles.container}>
      <View style={styles.InputBox}>
      <View>
        <Text style={styles.header}>Login</Text>
        <Text style={styles.text}>Please Sign In to Continue</Text>
      </View>

      
        <View>
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
            </View>
          <View>
          <Pressable
            style={styles.button}
            onPress={() => {
              console.log('Press login');
              signIn(email, password);
              //navigation.navigate("Messages");
            }}>
            <Text style={{color: '#fff', fontWeight: 'bold'}}>Login</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              navigation.navigate('Forgot');
            }}>
            <Text style={styles.text}>Forgotten Password?</Text>
            </Pressable>
            </View>

          

          <Dialog
            isVisible={dialog}
            onBackdropPress={() => {
              toggleDialog();
            }}
            overlayStyle={{backgroundColor: '#fff', borderRadius: 10}}>
            <Dialog.Title title={error} />
            <Dialog.Button
              title="Forgot password"
              onPress={() => {
                console.log('Primary Action Clicked!');
                navigation.navigate('Forgot');
              }}
            />
        </Dialog>
        <Dialog isVisible={loading} overlayStyle={{backgroundColor:"#fff"}}>
          <Dialog.Loading/>
        </Dialog>
      </View>
      <View>
            <View style={styles.signup}>
              <Text style={styles.text}>New User? </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate('SignUp');
                }}>
                <Text style={styles.signUpText}>Sign Up</Text>
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
    justifyContent:"space-between",
    padding: 30,
    alignItems:"center",
  },
  signup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#fff',
    paddingVertical: 16,
  },
  signUpText: {
    color: '#46eeaa',
    fontWeight: 'bold',
    fontSize: 18,
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
    width: 350,
    backgroundColor: '#e211d1',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
  },
});
export default LoginScreen;
