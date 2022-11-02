import { View, Text, Button,Image } from "react-native"
import React , {useState} from "react";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
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
       const reference = storage().ref("images/"+image.assets[0].uri);
       const pathToFile = image.assets[0].uri;
       // uploads file
       const task = reference.putFile(pathToFile);

        task.on('state_changed', taskSnapshot => {
          console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
        });

        task.then(() => {
          console.log('Image uploaded to the bucket!');
        });
      }} />
      <Button title="Skip" onPress={()=>{navigation.navigate("Detail")}}/>
   </View>
 )
}


export default ImageUploader;