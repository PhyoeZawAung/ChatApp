import { View, Text, Button,Image } from "react-native"
import React , {useState} from "react";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import { useSelector, Provider } from "react-redux";
import { StackActions } from "@react-navigation/native";
const ImageUploader = ({navigation}) => {
  const [image, setImage] = useState();
  const getImageFromCamera = async() => 
  {
    const result = await launchCamera();
    console.log(result);
    setImage(result)
  }
  const selectImage = async () => {
    const result = await launchImageLibrary();
    console.log(result);
    setImage(result)
   
  }

  const setUserName = async(name) => {
    await auth().currentUser.updateProfile({ displayName: name })
    console.log("Updated User name");
    console.log(auth().currentUser.displayName);
    navigation.dispatch(StackActions.replace("Detail"));
  }
  
  const setProfilePhoto = async(url) => {
    await auth().currentUser.updateProfile({ photoURL: url })
    console.log("Add Profile Photo");
    alert("Profile set");
  }
  const firstName = useSelector((store) => store.firstName);
  const lastName = useSelector((store) => store.lastName);
  const name = firstName + " " + lastName;
  return (
    <View>
      <Text>Image Uploader</Text>
      <Button title="
      launch camera" onPress={getImageFromCamera}></Button>
      <Button title="Select Image" onPress={selectImage} />
      <Text>{JSON.stringify(image)}</Text>
      <Text>djlddjll;</Text>
      <Text>{image?.assets && image.assets[0].uri}</Text>
      <Image source={{ uri: image?.assets && image.assets[0].uri }} style={{ width: 100, height: 100 }} />
      
      <Button title="Upload to firebase" onPress={async() => {
       // path to existing file on filesystem
       const refUrl = "images/" + auth().currentUser.uid + "_profile_photo.jpg";
       const reference = storage().ref(refUrl);
       const pathToFile = image.assets[0].uri;
       // uploads file
       const task = reference.putFile(pathToFile);

        task.on('state_changed', taskSnapshot => {
          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        });

        task.then(() => {
          console.log('Image uploaded to the bucket!');
          alert("Imgae Uploaded");
        });
        
      }} />
      <Button title="set profile" onPress={async () => {
        const refUrl = "images/" + auth().currentUser.uid + "_profile_photo.jpg";
        const url = await storage().ref(refUrl).getDownloadURL();
        setProfilePhoto(url);
      }}/>
      <Button title="Skip" onPress={() => {
        setUserName(name);
        
      }} />
   </View>
 )
}


export default ImageUploader;