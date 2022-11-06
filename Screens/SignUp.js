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
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import * as yup from 'yup';
const SignUpScreen = ({navigation}) => {
  const [showhide, setShowHide] = useState(true);
  const dispatch = useDispatch();
  const setUserName = (firstName, lastName) => {
    dispatch(
      SetUser({firstName: firstName, lastName: lastName, nameAdded: true}),
    );
  };
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
            'Account Create Successfully',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
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

  return (
    <View style={styles.container}>
      <View style={styles.signUpCard}>
        <Text style={styles.header}>Register</Text>
        <Text style={styles.text}>Please Sign Up Your Account</Text>

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
              signup(values.mail, values.password);
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
              {props.touched.retypePassword && props.errors.retypePassword ? (
                <Text style={styles.error}>{props.errors.retypePassword}</Text>
              ) : null}
              <Pressable
                style={styles.button}
                onPress={() => {
                  console.log('press');
                  props.handleSubmit();
                }}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>
                  Register
                </Text>
              </Pressable>
            </View>
          )}
        </Formik>
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
  error: {
    color: '#f00',
    fontSize: 12,
  },
});
export default SignUpScreen;
