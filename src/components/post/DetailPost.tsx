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

// Just the small cover mini phot on list of post
export default function DetailPost({ post }) {
  const yourPicture: string = post.photo;

  React.useEffect(() => {
    console.log("details: " + post.photo)
  }, [])
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
  cover: {
    width: 50,
    height: 50,
    borderRadius: 5,
  }
})