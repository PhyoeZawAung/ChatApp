//import { View, Text, Button,Image } from "react-native"
//import React , {useState} from "react";
//import { launchCamera, launchImageLibrary } from "react-native-image-picker";
//import storage from "@react-native-firebase/storage";
//import auth from "@react-native-firebase/auth";
//import { useSelector, Provider } from "react-redux";
//import { StackActions } from "@react-navigation/native";
//import { Avatar } from "@rneui/base";
//import store from "../Redux/stroe";
//const ImageUploader = ({navigation}) => {
//  const [image, setImage] = useState();
//  const getImageFromCamera = async() =>
//  {
//    const result = await launchCamera();
//    console.log(result);
//    setImage(result)
//  }
//  const selectImage = async () => {
//    const result = await launchImageLibrary();
//    console.log(result);
//    setImage(result)
//
//  }
//
//  const setUserName = async(name) => {
//    await auth().currentUser.updateProfile({ displayName: name })
//    console.log("Updated User name");
//    console.log(auth().currentUser.displayName);
//    navigation.dispatch(StackActions.replace("Detail"));
//  }
//
//  const setProfilePhoto = async(url) => {
//    await auth().currentUser.updateProfile({ photoURL: url })
//    console.log("Add Profile Photo");
//    alert("Profile set");
//  }
//  const firstName = useSelector((store) => store.firstName);
//  const lastName = useSelector((store) => store.lastName);
//  const name = firstName + " " + lastName;
//  return (
//    <Provider store={store}>
//    <View>
//      <Text>Image Uploader</Text>
//      <Button title="
//      launch camera" onPress={getImageFromCamera}></Button>
//      <Button title="Select Image" onPress={selectImage} />
//      <Text>{JSON.stringify(image)}</Text>
//      <Text>djlddjll;</Text>
//      <Text>{image?.assets && image.assets[0].uri}</Text>
//      <Image source={{ uri: image?.assets && image.assets[0].uri }} style={{ width: 100, height: 100 }} />
//      <Avatar
//          size={100}
//          rounded
//          source={{ uri: 'https://randomuser.me/api/portraits/women/57.jpg' }}
//          title="Bj"
//          containerStyle={{ backgroundColor: 'grey' }}
//        >
//        <Avatar.Accessory size={35}/>
//
//
//
//      </Avatar>
//      <Avatar
//    size={24}
//    rounded
//    icon={{ name: "pencil", type: "font-awesome" }}
//    containerStyle={{ backgroundColor: "#9700b9" }}
//  />
//
//      <Button title="Upload to firebase" onPress={async() => {
//       // path to existing file on filesystem
//       const refUrl = "images/" + auth().currentUser.uid + "_profile_photo.jpg";
//       const reference = storage().ref(refUrl);
//       const pathToFile = image.assets[0].uri;
//       // uploads file
//       const task = reference.putFile(pathToFile);
//
//        task.on('state_changed', taskSnapshot => {
//          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
//        });
//
//        task.then(() => {
//          console.log('Image uploaded to the bucket!');
//          alert("Imgae Uploaded");
//        });
//
//      }} />
//      <Button title="set profile" onPress={async () => {
//        const refUrl = "images/" + auth().currentUser.uid + "_profile_photo.jpg";
//        const url = await storage().ref(refUrl).getDownloadURL();
//        setProfilePhoto(url);
//      }}/>
//      <Button title="Skip" onPress={() => {
//        setUserName(name);
//
//      }} />
//      </View>
//  </Provider>
// )
//}
//
//
//export default ImageUploader;

import React, {useState} from 'react';
import {View, Text, StyleSheet, Pressable, Button} from 'react-native';
import {Avatar, Dialog} from '@rneui/base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import {useSelector} from 'react-redux';
import {StackActions} from '@react-navigation/native';
const ImageUploader = ({navigation}) => {
  const [choice, setChoice] = useState(false);
  const firstName = useSelector(store => store.firstName);
  const lastName = useSelector(store => store.lastName);
  const [image, setImage] = useState();
  const [load, setLoad] = useState(false);
  const [loadingText, setLoadingText] = useState('');
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
    setImage(result);
    console.log('image Url:::' + image);
  };
  const selectImage = async () => {
    const result = await launchImageLibrary();
    console.log(result);
    setImage(result);
    console.log('Image Url:::' + image);
  };

  const settingProfile = async (firstName, lastName, photoURL) => {
    setLoad(true);
    const user = auth().currentUser;
    const name = firstName + ' ' + lastName;
    if (photoURL != null) {
   
    const imageUrl = photoURL.assets[0].uri;
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
      setLoadingText(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
    });

    task.then(async () => {
      console.log('Image uploaded to the bucket!');
      console.log('Imgae Uploaded');
      setLoadingText('Imgae Uploaded');
      const url = await storage().ref(refUrl).getDownloadURL();
      console.log('Get download url' + JSON.stringify(url));
      await auth().currentUser.updateProfile({photoURL: url});
      console.log('Add Profile Photo');
      console.log('Profile set');
      setLoadingText('Profile set');
      console.log("Name::::" + name)
      await user.updateProfile({displayName: name});
      console.log('Profile name set');
      setLoadingText('Profile name set');
      setLoadingText('Done');
      navigation.dispatch(StackActions.replace('Chat'));
      setLoad(false);
    });
    }
    else {
      await user.updateProfile({displayName: name});
      console.log('Profile name set');
      setLoadingText('Profile name set');
      setLoadingText('Done');
      navigation.dispatch(StackActions.replace('Chat'));
      setLoad(false);
    }
    
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Welcome {firstName + ' ' + lastName}</Text>
        <View style={styles.profile}>
          {image != null ? (
            <Avatar
              size={100}
              rounded
              source={{uri: image.assets[0].uri}}
              title="PF"
              containerStyle={{backgroundColor: 'grey'}}>
              <Avatar.Accessory
                size={35}
                onPress={() => {
                  toggleChoice();
                }}
              />
            </Avatar>
          ) : (
            <Avatar
              size={100}
              rounded
              title="PF"
              containerStyle={{backgroundColor: 'grey'}}>
              <Avatar.Accessory
                size={35}
                onPress={() => {
                  toggleChoice();
                }}
              />
            </Avatar>
          )}

          <Text style={styles.name}>{firstName + ' ' + lastName}</Text>
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
              <Text style={{color: '#fff', fontWeight: 'bold'}}>
                Open Camera
              </Text>
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
          <Dialog
            isVisible={load}
            overlayStyle={{backgroundColor: '#fff', borderRadius: 10}}>
            <Dialog.Title title="Setting Up Your Profile" />
            <Text>{loadingText}</Text>

            <Dialog.Loading />
          </Dialog>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => {
            console.log('click continue');
            settingProfile(firstName, lastName, image);
          }}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>
            Continue to App
          </Text>
        </Pressable>
      </View>
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
  innerContainer: {
    justifyContent: 'space-between',
    flex: 1,
    marginVertical: 100,
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 35,
    color: '#fff',
    paddingVertical: 16,
  },
  profile: {
    alignItems: 'center',
  },
  name: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#fff',
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

export default ImageUploader;
