import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";

export default function ImageSong() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.cover}
        source={require('../../../assets/1.jpg')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  }, tinyLogo: {

  }, cover: {

  }
})