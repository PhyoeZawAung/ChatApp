import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Text, View, Image, StyleSheet, Pressable, ToastAndroid, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import { Avatar, Dialog, Button, Icon } from '@rneui/base';
import { TextInput } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import storage from "@react-native-firebase/storage";
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { TestScheduler } from 'jest';
import firestore from "@react-native-firebase/firestore";
const MeScreen = ({ navigation }) => {
  const [userPhoto, setUserPhoto] = useState();
  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [uid, setUid] = useState();


  const [updateUserFirstName, setUpdateUserFirstName] = useState();
  const [updateUserLastName, setUpdateUserLastName] = useState();
  const [updateUserEmail, setUpdateUserEmail] = useState();
  const [updateUserPhoto, setUpdateUserPhoto] = useState();
  const [updateUserPhone, setUpdateUserPhone] = useState();
  const [password, setPassword] = useState();
  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);
  const [editMail, setEditMail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [choice, setChoice] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    auth().currentUser;
    async function getUserData() {
      const user = await auth().currentUser;
      if (user != null) {
        setUserPhoto(user.photoURL);
        setUserEmail(user.email);
        setUid(user.uid);
        let id = user.uid;
        if (id !== null) {
          console.log(id);
          await firestore().collection("users").doc(id).get()
          .then(data => {
            console.log(data)
            setUserFirstName(data._data.firstName);
            setUserLastName(data._data.lastName);
            setPassword(data._data.password);


          }).catch(error=>console.log(error))
          
        }
      
      }
    }
    getUserData();

  }, []);
  const toggleChoice = () => {
    setChoice(!choice);
    if (choice) {
      console.log('modal close');
    } else {
      console.log('modal open');
    }
  };
  const getImageFromCamera = async () => {
    const result = await launchCamera();
    console.log(result);
    setUpdateUserPhoto(result.assets[0].uri)
    setUserPhoto(updateUserPhoto);
    console.log('image Url:::' + userPhoto);
  };
  const selectImage = async () => {
    const result = await launchImageLibrary();
    console.log(result);
    setUpdateUserPhoto(result.assets[0].uri)
    setUserPhoto(updateUserPhoto);
    console.log('Image Url:::' + userPhoto);
  };
  const toggleEditFirstName = () => {
    setEditFirstName(!editFirstName);
  };
  const toggleEditLastName = () => {
    setEditLastName(!editLastName);
  }
  const toggleEditMail = () => {
    setEditMail(!editMail);
  };
  const toggleEditPhone = () => {
    setEditPhone(!editPhone);
  };
  //this function update the name of user

  const UpdateName = async (userFirstName, userLastName) => {
    setLoading(true);
    let name = userFirstName + " " + userLastName;
    await auth().currentUser.updateProfile({ displayName: name }).then(
      () => {
        firestore().collection('users').doc(
          uid
        ).update({
          firstName: userFirstName,
          lastName: userLastName,
        }).then(
          () => {
            console.log("Name Updated in firestore");
            ToastAndroid.showWithGravity(
              "Name Updated",
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
         
            )
            setLoading(false);
          }
          
        )
      }
    ).catch((error) => {
      alert("Error",error)
    }
    )

    console.log('Name Updated');
  };
  const UpdateEmail = async (Email) => {
    setLoading(true);
    await auth().signInWithEmailAndPassword(auth().currentUser.email, password).then(() => {
      console.log("login")
      auth().currentUser.updateEmail(Email).then(() => {
        console.log('Email Updated in firebase Authentication');
        firestore().collection('users').doc(uid).update({ email: Email }).then(() => {
          console.log("Email Update in database");
          ToastAndroid.showWithGravity(
            "Email Updated",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          )
          setLoading(false);
        })
      }).catch(error => alert(error));
    }).catch(error => alert(error));
   


  };
  const UpdatePassword = async Password => {
    //await auth().currentUser.updatePassword(Password)
    console.log('Password Updated');
  };
  //const UpdatePhoneNumber = async(PhoneNumber) => {
  //  await auth().currentUser.updatePhoneNumber(PhoneNumber)
  //    .then(() => {
  //      console.log('Phone Number Updated');
  //    }).catch(error => console.log(error))
  //  
  //  
  //};
  const UpdatePhoto = async (photo) => {
    setLoading(true);
    console.log("Update Photo");
    const imageUrl = photo;
    // path to existing file on filesystem

    const refUrl = 'images/' + auth().currentUser.uid + '_profile_photo.jpg';
    const reference = await storage().ref(refUrl);
    const pathToFile = imageUrl;
    // uploads file
    const task = reference.putFile(pathToFile);

    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
      // setLoadingText(
      //   `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      // );
    });
    task.then(async () => {
      console.log("Image Uploaded");
      const url = await storage().ref(refUrl).getDownloadURL();
      console.log('Get download url' + JSON.stringify(url));
      await auth().currentUser.updateProfile({ photoURL: url }).then(() => {
        firestore().collection('users').doc(uid).update({ photoURL: url }).then(()=>console.log("Image update in firestoer database"));
      })
      console.log('Add Profile Photo');
      setLoading(false);
    })
  }
  const SignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('Sign out');
      })
      .catch(error => console.error(error));
  };
  const SettingProfile = async (firstname, lastname, email, photo, updateFirstName, updateLastName, updateEmail, updatePhoto) => {

    if ((firstname != null && updateFirstName != null) || (lastname != null && updateLastName != null)) {
      if (firstname != "") {
        UpdateName(firstname, lastname)
      }

    }
    if (email != null && updateEmail != null) {
      if (email != "") {
        UpdateEmail(email)
      }

    }
    //if (phone != null && updatePhone != null) {
    //  if (phone != "") {
    //    UpdatePhoneNumber(phone)
    //  }
    // 
    //}
    if (photo != null && updatePhoto != null) {
      UpdatePhoto(photo)
    }

  }
  return (
    <View style={styles.container}>
      <Pressable style={{ position: 'absolute', left: 20, top: 20 }}
      onPress={()=>navigation.goBack()}>
        <Icon name="arrowleft" type="ant-design" size={30} color={ "#fff"} />
      </Pressable>
      {userPhoto != null ? (
        <Avatar
          size={100}
          rounded
          title="PF"
          //    source={{uri:url => {
          //      url = updateUserPhoto != null ?
          //     (userPhoto):(updateUserPhoto)
          // }}}
          source={{ uri: userPhoto }}
          containerStyle={{ backgroundColor: 'grey' }}>
          <Avatar.Accessory
            size={40}
            onPress={() => {
              toggleChoice();
            }}></Avatar.Accessory>
        </Avatar>
      ) : (
        <Avatar
          size={100}
          rounded
          title={userFirstName?.[0]+userLastName?.[0]}
          containerStyle={{ backgroundColor: 'grey' }}>
          <Avatar.Accessory
            size={40}
            onPress={() => {
              toggleChoice();
            }}></Avatar.Accessory>
        </Avatar>
      )}
      <Text style={{ color: "#fff", paddingVertical: 20 }}>{uid}</Text>
      <Dialog
        isVisible={choice}
        onBackdropPress={toggleChoice}
        overlayStyle={{ backgroundColor: '#fff', borderRadius: 10 }}>
        <Dialog.Title title="Pick An Option" />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Camera Open');
            toggleChoice();
            getImageFromCamera();
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Open Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('Choose from gallery');
            toggleChoice();
            selectImage();
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            Choose From Storage
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('cancel the opltion');
            toggleChoice();
          }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
        </TouchableOpacity>
      </Dialog>
      <Dialog isVisible={loading} overlayStyle={{ backgroundColor: "#fff" }}>
        <Dialog.Title title="Saving.." />
        <Dialog.Loading></Dialog.Loading>
      </Dialog>
    <View style={{
        flexDirection: 'row',
        justifyContent: "space-between",
        width:"100%",
       }}>
      <View style={styles.EditViewForName}>
        {editFirstName ? (
          <TextInput
            style={{ borderBottomWidth: 1, width: '80%', borderBottomColor: "#fff" }}
            placeholder={userFirstName}
            onChangeText={text => setUpdateUserFirstName(text)}></TextInput>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <Icon name="person" color={'#fff'} />
            <Text style={{ color: '#fff', paddingLeft: 10 }}>{userFirstName}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            toggleEditFirstName();
            setUserFirstName(updateUserFirstName);
          }}>
          {!editFirstName ? <Icon name="edit" color={'#fff'} size={20}></Icon> : <Icon name="done" size={20} color={'#fff'}/>}
        </TouchableOpacity>
      </View>
      <View style={styles.EditViewForName}>
        {editLastName ? (
          <TextInput
            style={{ borderBottomWidth: 1, width: '80%', borderBottomColor: "#fff" }}
            placeholder={userLastName}
            onChangeText={text => setUpdateUserLastName(text)}></TextInput>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            
            <Text style={{ color: '#fff', paddingLeft: 10 }}>{userLastName}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            toggleEditLastName();
            setUserLastName(updateUserLastName);
          }}>
            {!editLastName ? <Icon name="edit" color={'#fff'} size={20}></Icon> : <Icon name="done" size={20} color={'#fff'}/>}
        </TouchableOpacity>
        </View>
      </View>
      <View style={styles.EditView}>
        {editMail ? (
          <TextInput
            style={{
              borderBottomWidth: 1, width: '80%',
              borderBottomColor: "#fff"
            }}
            placeholder={userEmail}
            onChangeText={text => setUpdateUserEmail(text)}></TextInput>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <Icon name="mail" color={'#fff'} />
            <Text style={{ color: '#fff', paddingLeft: 10 }}>{userEmail}</Text>
          </View>
        )}
        <TouchableOpacity
          onPress={() => {
            toggleEditMail();
            setUserEmail(updateUserEmail);
          }}>
          {!editMail ? <Icon name="edit" color={'#fff'} size={20}></Icon> : <Icon name="done" size={20} color={'#fff'}/>}
        </TouchableOpacity>
      </View>
      {/*<View style={styles.EditView}>
        {editPhone ? (
          <TextInput
            style={{
              borderBottomWidth: 1,
              width: '80%',
              borderBottomColor: '#fff',
            }}
            placeholder={userPhone}
            onChangeText={text => setUpdateUserPhone(text)}></TextInput>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Icon name="phone" color={'#fff'} />
              <Text style={{ color: '#fff', paddingLeft: 10 }}>{userPhone}</Text>
          </View>
        )}
        <Pressable
          onPress={() => {
            toggleEditPhone();
            setUserPhone(updateUserPhone);
          }}>
          {!editPhone ? <Text>Edit</Text> : <Text>Done</Text>}
        </Pressable>
      </View>*/}


      <TouchableOpacity style={styles.button}
        onPress={() => {
          console.log("Press save")
          SettingProfile(userFirstName, userLastName, userEmail, userPhoto, updateUserFirstName, updateUserLastName, updateUserEmail, updateUserPhoto);
        }}>
        <Text style={{ color: "#fff", fontWeight: 'bold' }}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}
        onPress={() => {
          navigation.navigate("ChangePassword");
        }}>
        <Text style={{ color: "#fff", fontWeight: 'bold' }}>Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}
        onPress={() => {
          SignOut();
        }}>
        <Text style={{ color: "#fff", fontWeight: 'bold' }}>SignOut</Text>
      </TouchableOpacity>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#9b5de0',
    backgroundColor: '#4F3B70',
    flex: 1,
    padding: 30,
    alignItems: 'center',
  },
  EditView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#aeaeae",
    height: 60,
  },
  EditViewForName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '47%',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#aeaeae",
    height: 60,
  },
  button: {
    width: '100%',
    backgroundColor: '#3fb585',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
  },
});
export default MeScreen;