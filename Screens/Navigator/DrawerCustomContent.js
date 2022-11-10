import React, {useState, useEffect} from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View, Text, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Provider, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import store from '../../Redux/stroe';

const CustomContent = props => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const firstname = useSelector(store => store.firstName);
  const lastName = useSelector(store => store.lastName);
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
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
      <View style={{flex: 1}}>
        <DrawerContentScrollView style={{alignSelf: 'center'}}>
          <View>
            <Image
              source={{uri: user.photoURL}}
              style={{width: 100, height: 100, borderRadius: 100}}
            />
            <Text>{user.email}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text>{firstname}</Text>
              <Text>{lastName}</Text>
            </View>
          </View>
        </DrawerContentScrollView>
        <DrawerContentScrollView {...props}>
          <View>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="users" color={color} size={size} />
              )}
              label="Home"
              onPress={() => props.navigation.navigate('Index')}></DrawerItem>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="users" color={color} size={size} />
              )}
              label="Profile"
              onPress={() => props.navigation.navigate('Profile')}></DrawerItem>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="users" color={color} size={size} />
              )}
              label="Contacts"
              onPress={() => props.navigation.navigate('Contact')}></DrawerItem>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="users" color={color} size={size} />
              )}
              label="Log Out"
              onPress={() => SignOut()}></DrawerItem>
          </View>
        </DrawerContentScrollView>
      </View>
    </Provider>
  );
};

export default CustomContent;
