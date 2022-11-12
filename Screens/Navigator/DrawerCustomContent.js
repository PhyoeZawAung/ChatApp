import React, {useState, useEffect} from 'react';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {View, Text, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Provider, useSelector} from 'react-redux';
import {Icon} from '@rneui/base';
import store from '../../Redux/stroe';
import {TEST_ID} from 'react-native-gifted-chat';

const CustomContent = props => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const firstname = useSelector(store => store.firstName);
  const lastName = useSelector(store => store.lastName);
  // Handle user state changes
  useEffect(() => {
    const user = auth().currentUser;
    if (user != null) {
      setUser(user);
      console.log(JSON.stringify(user));
    }
  }, []);
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
<<<<<<< HEAD
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
                onPress={() =>
                  props.navigation.navigate('Profile')
                }></DrawerItem>
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="users" color={color} size={size} />
                )}
                label="Contacts"
                onPress={() =>
                  props.navigation.navigate('Contact')
                }></DrawerItem>
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="users" color={color} size={size} />
                )}
                label="Log Out"
=======
        <View style={{flex: 1, backgroundColor: '#4F3B70'}}>
          <View style={{alignItems: 'center', paddingTop: 20}}>
            <Image
              source={{uri: user.photoURL}}
              style={{width: 100, height: 100, borderRadius: 100}}
            />
            <Text
              style={{
                color: '#fff',
                paddingTop: 20,
                fontWeight: 'bold',
                fontSize: 23,
              }}>
              {user.displayName}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text>{firstname}</Text>
              <Text>{lastName}</Text>
            </View>
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
                  icon={({color, size}) => (
                    <Icon name="people" color={color} size={size} />
                  )}
                  label="Contacts"
                  inactiveTintColor="#fff"
                  onPress={() =>
                    props.navigation.navigate('Contact')
                  }></DrawerItem>
              </View>

              <DrawerItem
                style={{paddingLeft: 30}}
                icon={({color, size}) => (
                  <Icon name="logout" color={color} size={size} />
                )}
                label="Log Out"
                inactiveTintColor="#fff"
>>>>>>> d1caaf12bc76166e3e77186e3a2ba1778132d638
                onPress={() => SignOut()}></DrawerItem>
            </View>
          </DrawerContentScrollView>
        </View>
      ) : null}
    </Provider>
  );
};

export default CustomContent;
