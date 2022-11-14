/*
import styled from 'styled-components';

export const Container = styled.View`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  align-items: center;
  background-color: #ffffff;
`;

export const Card = styled.TouchableOpacity`
  width: 100%;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const UserImgWrapper = styled.View`
  padding-top: 15px;
  padding-bottom: 15px;
`;

export const UserImg = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const TextSection = styled.View`
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  padding-left: 0;
  margin-left: 10px;
  width: 300px;
  border-bottom-width: 1px;
  border-bottom-color: #cccccc;
`;

export const UserInfoText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
`;

export const UserName = styled.Text`
  font-size: 14px;
  font-weight: bold;
  font-family: 'Lato-Regular';
`;

export const PostTime = styled.Text`
  font-size: 12px;
  color: #666;
  font-family: 'Lato-Regular';
  margin-right: 30px;
`;

export const MessageText = styled.Text`
  font-size: 14px;
  color: #333333;
`;
*/
/*
import React from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';

const ChatListItem = (props) => {
  return(
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}}>
        <View style={styles.imageWrapper}>
          <Image source={ require('./img/img1.jpg')}/>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.lastMessage}>{props.lastMessage}</Text>
        </View>
        <View style={style.activeTime}>
          <Text>{props.activeTime}</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ChatListItem;

const styles = StyleSheet.create({
  
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'grey',
  },

  imageWrapper: {
    width: 50,
    height: 50,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#4F3B70',
  },

  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F3B70',
    marginBottom: 10,
  },

  lastMessage: {
    color: '#d2d2d4',
    fontSize: 7,
    fontWeight: '300',
  },

  activeTime: {
    color: '#d2d2d4',
    fontSize: 7,
    fontWeight: '300',
  },
  
})
*/