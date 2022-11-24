import React from 'react';
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  ToastAndroid,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useEffect} from 'react';
import {useState} from 'react';
import {StackActions, useRoute} from '@react-navigation/native';
import {FlatList} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import {Avatar, Dialog, Icon} from '@rneui/base';
const GroupInfoScreen = ({navigation}) => {
  const [adminData, setAdminData] = useState([]);
  const [groupMember, setgroupMember] = useState([]);
  const [admin, setAdmin] = useState('');
  const [loading, setLoading] = useState(true);
  const [userInGroup, setUserInGroup] = useState([]);
  const [numberOfUsers, setNumberOfUsers] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [loadingDialog, setLoadingDialog] = useState(true);
  const route = useRoute();
  const user = auth().currentUser.uid;
  let users = [];
  useEffect(() => {
    console.log('Group id', route.params.groupId);
    const subscriber = firestore()
      .collection('group')
      .doc(route.params.groupId)
      .onSnapshot(async data => {
        if (typeof data.data() != 'undefined') {
          setGroupName(data.data().groupName);
          let userInGroup = [];
          console.log('helo', data.data().groupMember);
          setAdmin(data.data().admin);
          setgroupMember(data.data().groupMember);
          setNumberOfUsers(data.data().groupMember.length);
          let arr = data.data().groupMember;
          for (i = 0; i < arr.length; i++) {
            await getUserData(arr[i]).then(data => {
              console.log(data);
              userInGroup.push({...data, uid: arr[i]});
            });
          }

          setUserInGroup(
            userInGroup.filter(it => it.uid != auth().currentUser.uid),
          );
          setAdminData(userInGroup.filter(it => it.uid == data.data().admin));
          setLoading(false);
        }
      });
    return () => subscriber();
  }, []);
  const getUserData = data => {
    return new Promise(resolve => {
      firestore()
        .collection('users')
        .doc(data)
        .get()
        .then(data => {
          resolve(data.data());
        });
    });
  };
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={40}/>
        <Text>Getting Group informations......</Text>
        
      </View>
    )
  }
  const removeFromGroup = uid => {
    const index = groupMember.indexOf(uid);
    groupMember.splice(index, 1);

    firestore().collection('group').doc(route.params.groupId).update({
      groupMember: groupMember,
    });
    console.log(uid);
  };
  const renderItemForAdmin = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 0.5,
          borderBottomColor: 'grey',
          paddingVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar
            title={item.firstName[0] + ' ' + item.lastName[0]}
            size={40}
            containerStyle={{backgroundColor: 'grey'}}
            rounded
            source={item?.photoURL ? {uri: item?.photoURL} : null}
          />
          <Text
            style={{
              paddingLeft: 20,
              color: '#fff',
            }}>
            {item.firstName + ' ' + item.lastName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            removeFromGroup(item.uid);
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'red',
                paddingRight: 8,
              }}>
              Remove
            </Text>
            <Icon name="trash" type="font-awesome" size={20} color={'red'} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const getAllUsers = async usersInGroup => {
    await firestore()
      .collection('users')
      .get()
      .then(usersdoc => {
        usersdoc.forEach(user => {
          users.push({...user.data(), uid: user.id});
        });
        console.log(users);
        setAllUsers(users);
        setLoadingDialog(false);
      });
  };
  const AddToGroup = uid => {
    if (groupMember.includes(uid)) {
      console.log('User already exists');
      ToastAndroid.showWithGravity(
        'User already exists',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else {
      groupMember.push(uid);
      firestore()
        .collection('group')
        .doc(route.params.groupId)
        .update({
          groupMember: groupMember,
        })
        .then(
          ToastAndroid.showWithGravity(
            'User Added',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          ),
        );
    }
  };
  const renderInDialog = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 0.5,
          borderBottomColor: 'grey',
          paddingVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar
            title={item.firstName[0] + item.lastName[0]}
            size={40}
            containerStyle={{backgroundColor: 'grey'}}
            rounded
            source={item?.photoURL ? {uri: item?.photoURL} : null}
          />
          <Text
            style={{
              paddingLeft: 20,
            }}>
            {item.firstName + ' ' + item.lastName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            AddToGroup(item.uid);
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: '#0c93f4',
                paddingRight: 8,
              }}></Text>
            <Icon
              name="addusergroup"
              type="ant-design"
              size={20}
              color={'#0c93f4'}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  const deleteGroup = () => {
    firestore()
      .collection('group')
      .doc(route.params.groupId)
      .delete()
      .then(() => {
        navigation.navigate('My Group');
      });
  };
  if (admin === user) {
    return (
      <View style={styles.container}>
       
        <View
          style={{
            alignItems: 'center',
          }}>
          <Avatar
            title={groupName[0] + groupName[1]}
            size={120}
            rounded
            containerStyle={{backgroundColor: 'grey'}}
          />
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.createdBy}>
            Created by {adminData[0].firstName + ' ' + adminData[0].lastName}
          </Text>
        </View>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={styles.buttonAdd}
            onPress={() => {
              setDialogVisible(true);
              getAllUsers(userInGroup);
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="addusergroup"
                type="ant-design"
                size={20}
                color={'#fff'}
              />
              <Text style={{color: '#fff', paddingLeft: 8}}>Add Members</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonLeave}
            onPress={() => {
              deleteGroup();
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="delete" type="ant-design" size={20} color={'#fff'} />
              <Text style={{color: '#fff', paddingLeft: 8}}>Delete Group</Text>
            </View>
          </TouchableOpacity>
        </View>

        {loadingDialog ? (
          <Dialog
            isVisible={dialogVisible}
            overlayStyle={{backgroundColor: '#fff'}}>
            <Dialog.Title title="Loading All users" />
            <Dialog.Loading />
          </Dialog>
        ) : (
          
          <Dialog
            isVisible={dialogVisible}
            onBackdropPress={() => setDialogVisible(false)}
            overlayStyle={{backgroundColor: '#fff', height: 500,borderRadius:10}}>
              <Dialog.Title title="Add Member" />
            
            <View style={{height:370}}>
              <FlatList data={allUsers} renderItem={renderInDialog} />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setDialogVisible(false);
              }}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: '#fff', paddingLeft: 8}}>Done</Text>
              </View>
                </TouchableOpacity>
              
          </Dialog>
        )}
        <Text
          style={{
            color: '#fff',
            paddingBottom: 10,
            textDecorationLine: 'underline',
            textDecorationColor: 'red',
            fontStyle: 'italic',
        
          }}>
          You are the Admin of this group
        </Text>
        <Text
          style={{
            color: '#fff',
            textDecorationLine: 'underline',
            paddingBottom: 8,
          }}>
          {numberOfUsers} PARTICIPANTS
        </Text>
        <FlatList data={userInGroup} renderItem={renderItemForAdmin} />
      </View>
    );
  }
  const renderItem = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 0.5,
          borderBottomColor: 'grey',
          paddingVertical: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Avatar
            title={item.firstName[0] + ' ' + item.lastName[0]}
            size={40}
            containerStyle={{backgroundColor: 'grey'}}
            rounded
            source={item?.photoURL ? {uri: item?.photoURL} : null}
          />
          <Text
            style={{
              paddingLeft: 20,
              color: '#fff',
            }}>
            {item.firstName + ' ' + item.lastName}
          </Text>
        </View>
      </View>
    );
  };
  const leaveGroup = () => {
    const index = groupMember.indexOf(auth().currentUser.uid);
    groupMember.splice(index, 1);
    firestore().collection('group').doc(route.params.groupId).update({
      groupMember: groupMember,
    });
    navigation.navigate('My Group');
  };
  if (groupName == '') {
    return null;
  }
  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Avatar
          title={groupName[0] + groupName[1]}
          size={120}
          rounded
          containerStyle={{backgroundColor: 'grey'}}
        />
        <Text style={styles.groupName}>{groupName}</Text>
        <Text style={styles.createdBy}>
          Created by {adminData[0].firstName + ' ' + adminData[0].lastName}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#f00" }]}
          onPress={() => {
            leaveGroup();
          }}>
          <View style={{flexDirection: 'row'}}>
            <Icon name="logout" type="ant-design" size={20} color={'#fff'} />
            <Text style={{color: '#fff', paddingLeft: 8}}>Leave Group</Text>
          </View>
        </TouchableOpacity>
      </View>

      {loadingDialog ? (
        <Dialog
          isVisible={dialogVisible}
          overlayStyle={{backgroundColor: '#fff'}}>
          <Dialog.Title title="Loading All users" />
          <Dialog.Loading />
        </Dialog>
      ) : (
        <Dialog
          isVisible={dialogVisible}
          onBackdropPress={() => setDialogVisible(false)}
          overlayStyle={{backgroundColor: '#fff', height: 500}}>
          <Dialog.Title title="Add Member" />
          <View>
            <FlatList data={allUsers} renderItem={renderInDialog} />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setDialogVisible(false);
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#fff', paddingLeft: 8}}>Done</Text>
            </View>
          </TouchableOpacity>
        </Dialog>
      )}
      <Text
        style={{
          color: '#fff',
          textDecorationLine: 'underline',
          paddingBottom: 8,
        }}>
        {numberOfUsers} PARTICIPANTS
      </Text>
      <FlatList data={userInGroup} renderItem={renderItem} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
    backgroundColor: '#4F3B70',
  },
  groupName: {
    color: '#fff',
    fontWeight: 'bold',
    paddingTop: 18,
    fontSize: 30,
  },
  createdBy: {
    color: '#fff',
    fontStyle: 'italic',
  },
  button: {
    width: '100%',
    backgroundColor: '#3fb585',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
  },
  buttonAdd: {
    width: '47%',
    backgroundColor: '#3fb585',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
  },
  buttonLeave: {
    width: '47%',
    backgroundColor: 'red',
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
  },
});
export default GroupInfoScreen;
