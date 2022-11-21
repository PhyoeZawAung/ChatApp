import React, {useState} from 'react';
import {useSelector, useDispatch, Provider} from 'react-redux';
import {SetUser} from '../Redux/User/UserAction';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import * as yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import {Dialog, Icon} from '@rneui/base';

const SignUpScreen = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [showhidePassword, setShowHidePassword] = useState(true);
  const [showhideConfirmPassword, setShowHideConfirmPassword] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();
  const toggleError = () => {
    setShowError(!showError);
  };
  const setUserName = (firstName, lastName) => {
    dispatch(
      SetUser({
        firstName: firstName,
        lastName: lastName,
        nameAdded: true,
      }),
    );
    console.log('user name' + firstName + lastName);
  };

  const Show = showhide => {
    if (showhide == true) {
      return false;
    } else return true;
  };

  const signup = async (email, password, firstName, lastName) => {
    setLoading(true);
    try {
      await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(cred => {
          firestore()
            .collection('users')
            .doc(cred.user.uid)
            .set({
              id: auth().currentUser.uid,
              firstName,
              lastName,
              email,
              password,
            })
            .then(() => setLoading(false));
        });
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        setLoading(false);
        setErrorMsg('Email Address is already in use');
        toggleError();
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        setLoading(false);
        setErrorMsg('That email address is invalid!');
        toggleError();
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.signUpCard}>
        <Text style={styles.header}>Register</Text>
        <Text style={styles.text}>Sign Up Your Account</Text>
        

        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            mail: '',
            password: '',
            retypePassword: '',
          }}
          validationSchema={yup.object({
            firstName: yup.string().required('Enter First Name'),
            mail: yup.string().email('Invalid Email').required('Enter Email'),
            password: yup
              .string()
              .min(8, ({min}) => `password must be ${min} characters`)
              .matches(/[0-9]/, 'Must Contain number(0 to 9)')

              .required('Enter Password'),
            retypePassword: yup
              .string()

              .oneOf([yup.ref('password'), null], "Password doesn't match")
              .required('Enter Password'),
          })}
          onSubmit={(values, formikAction) => {
            setTimeout(() => {
              console.log(JSON.stringify(values));
              setUserName(values.firstName, values.lastName);
              signup(
                values.mail,
                values.password,
                values.firstName,
                values.lastName,
              );
              formikAction.setSubmitting(false);
            }, 500);
          }}>
          {props => (
            <View style={styles.InputBox}>
              <View style={styles.name}>
                <TextInput
                  style={styles.nameInput}
                  placeholder="first name"
                  onChangeText={props.handleChange('firstName')}
                  onBlur={props.handleBlur('firstName')}
                  value={props.values.firstName}></TextInput>
                <TextInput
                  style={styles.nameInput}
                  placeholder="last name"
                  onChangeText={props.handleChange('lastName')}
                  onBlur={props.handleBlur('last Name')}
                  value={props.values.lastName}></TextInput>
              </View>
              {props.touched.firstName && props.errors.firstName ? (
                <Text style={styles.error}>{props.errors.firstName}</Text>
              ) : null}
              <TextInput
                placeholder="example@gmail.com"
                style={styles.gmailInput}
                onChangeText={props.handleChange('mail')}
                onBlur={props.handleBlur('mail')}
                value={props.values.mail}
              />
              {props.touched.mail && props.errors.mail ? (
                <Text style={styles.error}>{props.errors.mail}</Text>
              ) : null}
              <View style={styles.passwordInput}>
                <TextInput
                  placeholder="Password"
                  style={styles.inputField}
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  secureTextEntry={showhidePassword}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowHidePassword(Show(showhidePassword));
                  }}>
                   <View style={styles.showhidebutton}>
                  <Icon name={showhidePassword ? 'eye-off' : 'eye'} type="feather" size={20}>
                    
                    </Icon>
                  </View>
                </TouchableOpacity>
              </View>
              {props.touched.password && props.errors.password ? (
                <Text style={styles.error}>{props.errors.password}</Text>
              ) : null}

              <View style={styles.passwordInput}>
                <TextInput
                  placeholder="Comfirm Password"
                  style={styles.inputField}
                  onChangeText={props.handleChange('retypePassword')}
                  onBlur={props.handleBlur('retypePassword')}
                  value={props.values.retypePassword}
                  secureTextEntry={showhideConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowHideConfirmPassword(Show(showhideConfirmPassword));
                  }}>
                  <View style={styles.showhidebutton}>
                  <Icon name={showhideConfirmPassword ? 'eye-off' : 'eye'} type="feather" size={20}>
                    
                  </Icon>
                  </View>
                </TouchableOpacity>
              </View>
              {props.touched.retypePassword && props.errors.retypePassword ? (
                <Text style={styles.error}>{props.errors.retypePassword}</Text>
              ) : null}
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log('press');
                  props.handleSubmit();
                }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
        <Dialog isVisible={loading} overlayStyle={{backgroundColor: '#fff'}}>
          <Dialog.Loading />
        </Dialog>
        <Dialog
          isVisible={showError}
          overlayStyle={{backgroundColor: '#fff'}}
          onBackdropPress={toggleError}>
          <Dialog.Title title={errorMsg} />
          <Dialog.Actions>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate('Login');
                toggleError();
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Try login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate('Forgot');
                toggleError();
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Forgot password
              </Text>
            </TouchableOpacity>
          </Dialog.Actions>
        </Dialog>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4F3B70',
    flex: 1,
    padding: 30,
  },

  header: {
    fontWeight: 'bold',
    fontSize: 40,
    color: '#fff',
    paddingVertical: 16,
    textAlign: 'center',
    marginBottom: 50,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  InputBox: {
    width: '100%',

    paddingVertical: 15,
  },
  name: {
    flexDirection: 'row',
    marginVertical: 5,
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
    color: '#3fb585',
    paddingRight: 20,
  },
  button: {
    width: '100%',
    backgroundColor: '#3fb585',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
  },
  error: {
    color: '#f00',
    fontSize: 12,
  },
  inputField: {
    width:"80%"
  }
});
export default SignUpScreen;
