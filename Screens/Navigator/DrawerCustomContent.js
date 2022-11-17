import React, {useState, useEffect} from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View, Text, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Provider, useSelector} from 'react-redux';
import {Icon} from '@rneui/base';
import store from '../../Redux/stroe';
import {TEST_ID} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { Avatar } from '@rneui/base';
const CustomContent = props => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  
  const firstname = useSelector(store => store.firstName);
  const lastName = useSelector(store => store.lastName);
  // Handle user state changes
  useEffect(() => {
    //const user = auth().currentUser;
    //if (user != null) {
    //  setUser(user);
    //  console.log(JSON.stringify(user));
    //}
    getUser( auth().currentUser.uid);
  }, []);

  const getUser = (userId) => {
    if (userId != null) {
      firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);

        if (documentSnapshot.exists) {
          
          setUser(documentSnapshot.data());
          
          
          console.log('User data: ', user);
        
        }
      });
    }
    
  };

  const SignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('Sign out');
      })
      .catch(error => console.error(error));
  };
  return (
    <Provider store={store}>
      {user ? (
        <View style={{flex: 1, backgroundColor: '#4F3B70'}}>
          <View style={{alignItems: 'center', paddingTop: 20}}>
           
            {
              typeof(user.photoURL) === "undefined" ? (
                <Avatar
                size={100}
                rounded
                  title={user.firstName[0] + user.lastName[0]}
                containerStyle={{ backgroundColor: 'grey' }}>
                </Avatar>
                
              ) : (
                <Avatar
                size={100}
                rounded
                source={{ uri: user.photoURL }}
                containerStyle={{ backgroundColor: 'grey' }}>
                </Avatar>
              )
                
            }
            <Text
              style={{
                color: '#fff',
                paddingTop: 20,
                fontWeight: 'bold',
                fontSize: 23,
              }}>
              {user.firstName +" " + user.lastName}
            </Text>
           
          </View>

          <DrawerContentScrollView {...props}>
            <View style={{justifyContent: 'space-between', height: 450}}>
              <View style={{paddingLeft: 30}}>
                <DrawerItem
                  icon={({color, size}) => (
                    <Icon name="home" color={color} size={size} />
                  )}
                  label="Home"
                  inactiveTintColor="#fff"
                  onPress={() =>
                    props.navigation.navigate('Index')
                  }></DrawerItem>
                <DrawerItem
                  icon={({color, size}) => (
                    <Icon name="person" color={color} size={size} />
                  )}
                  label="Profile"
                  inactiveTintColor="#fff"
                  onPress={() =>
                    props.navigation.navigate('Profile')
                  }></DrawerItem>
                <DrawerItem
                  initializing={true}
                  icon={({color, size}) => (
                    <Icon name="people" color={color} size={size} />
                  )}
                  label="Contacts"
                  inactiveTintColor="#fff"
                  onPress={() =>
                    props.navigation.navigate('Contact')
                  }></DrawerItem>
                  <DrawerItem
                  initializing={true}
                  icon={({color, size}) => (
                    <Icon name="people" color={color} size={size} />
                  )}
                  label="My Group"
                  inactiveTintColor="#fff"
                  onPress={() =>
                    props.navigation.navigate('Group')
                  }></DrawerItem>
              </View>

              <DrawerItem
                style={{paddingLeft: 30}}
                icon={({color, size}) => (
                  <Icon name="logout" color={color} size={size} />
                )}
                label="Log Out"
                inactiveTintColor="#fff"
                onPress={() => SignOut()}></DrawerItem>
            </View>
          </DrawerContentScrollView>
        </View>
      ) : null}
    </Provider>
  );
};

export default CustomContent;
