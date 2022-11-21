import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

export default function OneChatHeader(props) {
  return (
    <View style={styles.container}>
      <View style={styles.image}>
        <Image
          source={
            props?.image
              ? { uri: props.image }
              : require('../images/default_image.png')}
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.name}>{props.name}</Text>
        <Text style={styles.status}>{props.status}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4F3B70',
    padding: 30,
  },

  image: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 100,
  },

  text: {
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 5,
  },

  name: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '800',
  },

  status: {
    fontSize: 8,
    fontWeight: '200',
    color: '#b8b4a9',
  }
})