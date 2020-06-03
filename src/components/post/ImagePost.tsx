import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";

export default function ImagePost({ post }) {
  const yourPicture: string = post.photo;
  return (
    <View>
      <Image
        style={styles.cover}
        source={{ uri: yourPicture }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  }, tinyLogo: {

  }, cover: {
    flex: 1,
    width: 'auto',
    height: 'auto',
    resizeMode: 'cover',
  }
})