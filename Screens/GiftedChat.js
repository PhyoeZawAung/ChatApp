import React, { useState ,useEffect,useCallback} from "react";
import { GiftedChat,Actions, MessageImage} from "react-native-gifted-chat";
import { Icon } from "@rneui/base";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { View,Image ,Text} from "react-native";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
const GiftedChatScreen = () => {
  const [image, setImage] = useState();
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: 'Hello developer',
      image:'https://placeimg.com/140/140/any',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
      received: true,
    },
    {
      _id: 2,
      text: 'Hi',
      image:'https://placeimg.com/140/140/any',
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
      
      pending: true,
    },
    {
      _id: 3,
      image: "https://placeimg.com/140/140/any",
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      }
    }
  ]);
  const selectImage = async () => {
    await launchImageLibrary({
      mediaType:"photo",
      quality: 0.6,
      presentationStyle:"popover",
    }).then(async data => {
      console.log(data.assets[0].uri);

      const imageUrl = data.assets[0].uri;
      // path to existing file on filesystem

      const refUrl = 'Sender_images/' + auth().currentUser.uid + '_photo.jpg';
      const reference = await storage().ref(refUrl);
      const pathToFile = imageUrl;
      // uploads file
      const task = reference.putFile(pathToFile);

      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
     
      });
      task.then(async () => {
        console.log("Image Uploaded");
        const url = await storage().ref(refUrl).getDownloadURL();
        console.log('Get download url' + JSON.stringify(url));
        setImage(url)
      })
   
    });
  }
  const getImageFromCamera = async () => {
    const result = await launchCamera();
    
   
  };

  

  const renderActions = (props) => {
    return (
      <Actions
        {...props}
        options={{
          ['Select Image']: selectImage,
          ['Open camera']: getImageFromCamera,
        }}
        icon={() => (
          <Icon name={'attachment'} size={28} />
        )}
  
      />
    )
  }
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])
  const customRenderMessageImage = (props) => {
    return (
      <View>
        <MessageImage 
          {...props}
          imageStyle={{ width: 180, height: 200 }}
        />
      </View>
      
    )
  }
  const customRenderAccessory = () => {
    return (
      null
    )
  }
  const customView = () => {
    return (
      <View style={{width:100}}>
        <Text>HEllo</Text>
      </View>
    )
  }
  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      renderActions={renderActions}
      user={{
        _id: 1,
      }}
      renderMessageImage={props => customRenderMessageImage(props)}
      renderAccessory={customView}
    />
  )
}

export default GiftedChatScreen;