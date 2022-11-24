import React, {useState,useEffect} from 'react';
import {useSelector, useDispatch, Provider} from 'react-redux';
import {SetUser} from '../Redux/User/UserAction';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import * as yup from 'yup';
import firestore from '@react-native-firebase/firestore';
import { Icon } from '@rneui/base';

const ChangePasswordScreen = ({navigation}) => {
  const [user, setUser] = useState();
  const [oldPassword, setOldPassowrd] = useState("");
  const [newPassword, setNewPassword] = useState("");
  useEffect(() => {
    async function getData() {
      let id = await auth().currentUser.uid;

      if (id != null) {
        console.log(id);
        await firestore()
          .collection('users')
          .doc(id)

          .get()
          .then(user => {
            console.log(user._data);
            setUser(user._data);
          });
      }
    }

    getData();
    console.log(user);
  }, []);

  const [showhideCurrentPassword, setShowHideCurrentPassword] = useState(true);
  const [showhideNewPassword, setShowHideNewPassword] = useState(true);
  const [showhideConfirmPassword, setShowHideConfirmPassword] = useState(true);
  

  const Show = showhide => {
    if (showhide == true) {
      return false;
    } else return true;
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (newPassword == oldPassword) {
      alert("New password and old password are the same");
      return;
    }
    await auth().signInWithEmailAndPassword(auth().currentUser.email, oldPassword).then(async() => {
      await auth().currentUser.updatePassword(newPassword).then(async () => {
        await firestore().collection('users').doc(auth().currentUser.uid).update(
          {
            password: newPassword,
          }
        ).then(() => {
          console.log("Password Change Successfully");
        alert("Password Change Successfully")
        })

        
      }).catch(error => console.log(error));
    }).catch(error => {
      if (error.code === "auth/wrong-password") {
        alert("The Old password Wrong");
      }
    })
   
    
  }

  return (
    <View style={styles.container}>
       <Pressable style={{ position: 'absolute', left: 20, top: 20 }}
      onPress={()=>navigation.goBack()}>
        <Icon name="arrowleft" type="ant-design" size={30} color={ "#fff"} />
      </Pressable>
      <View style={styles.signUpCard}>
        <Text style={styles.header}>Create A New Password</Text>
        <Text style={styles.text}>Your new Password Must Be Different from the old password</Text>

        <Formik
          initialValues={{
            oldPassword:'',
            newPassword: '',
            retypePassword: '',
          }}
          validationSchema={yup.object({
            newPassword: yup
              .string()
              .min(8, ({min}) => `password must be ${min} characters`)
              .matches(/[0-9]/, 'Must Contain number(0 to 9)')

              .required('Enter Password'),
            retypePassword: yup
              .string()

              .oneOf([yup.ref('newPassword'), null], "Password doesn't match")
              .required('Enter Password'),
          })}
          onSubmit={(values, formikAction) => {
            setTimeout(() => {
              console.log(JSON.stringify(values));
              changePassword(values.oldPassword, values.newPassword);
              setOldPassowrd(values.oldPassword);
              setNewPassword(values.newPassword);
              formikAction.setSubmitting(false);
            }, 500);
          }}>
          {props => (
            <View style={styles.InputBox}>
              
              <View style={styles.passwordInput}>
                <TextInput
                  placeholder="Current Password"
                  style={styles.inputField}
                  onChangeText={props.handleChange('oldPassword')}
                  onBlur={props.handleBlur('oldPassword')}
                  value={props.values.oldPassword}
                  secureTextEntry={showhideCurrentPassword}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowHideCurrentPassword(Show(showhideCurrentPassword));
                  }}>
                   <View style={styles.showhidebutton}>
                  <Icon name={showhideCurrentPassword ? 'eye-off' : 'eye'} type="feather" size={20}>
                    
                    </Icon>
                  </View>
                </TouchableOpacity>
              </View>
             
             
              <View style={styles.passwordInput}>
                <TextInput
                  placeholder="New Password"
                  style={styles.inputField}
                  onChangeText={props.handleChange('newPassword')}
                  onBlur={props.handleBlur('newPassword')}
                  value={props.values.newPassword}
                  secureTextEntry={showhideNewPassword}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowHideNewPassword(Show(showhideNewPassword));
                  }}>
                   <View style={styles.showhidebutton}>
                  <Icon name={showhideNewPassword ? 'eye-off' : 'eye'} type="feather" size={20}>
                    
                    </Icon>
                  </View>
                </TouchableOpacity>
              </View>
              {props.touched.newPassword && props.errors.newPassword ? (
                <Text style={styles.error}>{props.errors.newPassword}</Text>
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
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
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
export default ChangePasswordScreen;
