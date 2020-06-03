import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  AsyncStorage,
} from "react-native";

export default function DetailList({ song }) {
  return (
    <View>
      <Image
        style={styles.cover}
        source={require('../../assets/1.jpg')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  cover: {
    maxWidth: 45,
    maxHeight: 45,
    borderRadius: 5,
  }
})