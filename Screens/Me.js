import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {Text, View, Image, StyleSheet, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Avatar, Dialog, Button, Icon} from '@rneui/base';
import {TextInput} from 'react-native-gesture-handler';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from "@react-native-firebase/storage";
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { TestScheduler } from 'jest';
const MeScreen = () => {
  const [userPhoto, setUserPhoto] = useState();
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userPhone, setUserPhone] = useState();
  const [uid , setUid] = useState();
  const [updateUserName, setUpdateUserName] = useState();
  const [updateUserEmail, setUpdateUserEmail] = useState();
  const [updateUserPhoto, setUpdateUserPhoto] = useState();
  const [updateUserPhone, setUpdateUserPhone] = useState();

  const [editName, setEditName] = useState(false);
  const [editMail, setEditMail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [choice, setChoice] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const user = auth().currentUser;
    if (user !== null) {
      setUserPhoto(user.photoURL);
      setUserName(user.displayName);
      setUserEmail(user.email);
      setUserPhone(user.phoneNumber); 
      setUid(user.uid);
    }
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
  const toggleEdit = () => {
    setEditName(!editName);
  };
  const toggleEditMail = () => {
    setEditMail(!editMail);
  };
  const toggleEditPhone = () => {
    setEditPhone(!editPhone);
  };
  //this function update the name of user

  const UpdateName = async (name) => {
    await auth().currentUser.updateProfile({ displayName: name })
    
    console.log('Name Updated');
  };
  const UpdateEmail = async (Email) => {
    await auth().currentUser.updateEmail(Email).then(() => {
      console.log('Email Updated');
    }).catch(error => console.log(error));
   
    
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
    task.then(async() => {
      console.log("Image Uploaded");
      const url = await storage().ref(refUrl).getDownloadURL();
      console.log('Get download url' + JSON.stringify(url));
      await auth().currentUser.updateProfile({photoURL: url});
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
  const SettingProfile = async (name, email, phone, photo,updateName,updateEmail,updatePhone,updatePhoto) => {
   
    if (name != null && updateName != null) {
      if (name != "") {
        UpdateName(name)
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
      {userPhoto != null ? (
        <Avatar
          size={100}
          rounded
          title="PF"
          //    source={{uri:url => {
          //      url = updateUserPhoto != null ?
          //     (userPhoto):(updateUserPhoto)
          // }}}
          source={{uri: userPhoto}}
          containerStyle={{backgroundColor: 'grey'}}>
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
          title="PF"
          containerStyle={{backgroundColor: 'grey'}}>
          <Avatar.Accessory
            size={40}
            onPress={() => {
              toggleChoice();
            }}></Avatar.Accessory>
        </Avatar>
      )}
      <Text style={{color:"#fff",paddingVertical:20}}>{uid}</Text>
      <Dialog
        isVisible={choice}
        onBackdropPress={toggleChoice}
        overlayStyle={{backgroundColor: '#fff', borderRadius: 10}}>
        <Dialog.Title title="Pick An Option" />

        <Pressable
          style={styles.button}
          onPress={() => {
            console.log('Camera Open');
            toggleChoice();
            getImageFromCamera();
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Open Camera</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log('Choose from gallery');
            toggleChoice();
            selectImage();
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>
            Choose From Storage
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log('cancel the opltion');
            toggleChoice();
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Cancel</Text>
        </Pressable>
      </Dialog>
      <Dialog isVisible={loading} overlayStyle={{backgroundColor:"#fff"}}>
        <Dialog.Title title="Saving.."/>
        <Dialog.Loading></Dialog.Loading>
      </Dialog>

      <View style={styles.EditView}>
        {editName ? (
          <TextInput
            style={{borderBottomWidth: 1, width: '80%',borderBottomColor:"#fff"}}
            placeholder={userName}
            onChangeText={text => setUpdateUserName(text)}></TextInput>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Icon name="person" color={'#fff'} />
            <Text style={{color: '#fff', paddingLeft: 10}}>{userName}</Text>
          </View>
        )}
        <Pressable
          onPress={() => {
            toggleEdit();
            setUserName(updateUserName);
          }}>
          {!editName ? <Text>Edit</Text> : <Text>Done</Text>}
        </Pressable>
      </View>
      <View style={styles.EditView}>
        {editMail ? (
          <TextInput
            style={{
              borderBottomWidth: 1, width: '80%',
            borderBottomColor:"#fff"}}
            placeholder={userEmail}
            onChangeText={text => setUpdateUserEmail(text)}></TextInput>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Icon name="mail" color={'#fff'} />
            <Text style={{color: '#fff', paddingLeft: 10}}>{userEmail}</Text>
          </View>
        )}
        <Pressable
          onPress={() => {
            toggleEditMail();
            setUserEmail(updateUserEmail);
          }}>
          {!editMail ? <Text>Edit</Text> : <Text>Done</Text>}
        </Pressable>
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

      
      <Pressable style={styles.button}
       onPress={() => {
        SettingProfile(userName, userEmail, userPhone,userPhoto,updateUserName,updateUserEmail,updateUserPhone,updateUserPhoto );
      }}>
        <Text style={{color:"#fff",fontWeight:'bold'}}>Save</Text>
      </Pressable>
    
      <Pressable style={styles.button}
       onPress={() => {
        SignOut();
      }}>
        <Text style={{color:"#fff",fontWeight:'bold'}}>SignOut</Text>
       </Pressable>
     
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9b5de0',
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
    borderBottomColor:"#aeaeae",
    height: 60,
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
export default MeScreen;