import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions, StyleSheet } from 'react-native'
const win = Dimensions.get('window');

// interface IData {
//   title: string,
//   photo: string,
// }

// just display phot and title in horizontal scroll, for ListPosts, ListSongs
export default function Categories(props) {
  const yourPicture: string = props.data.photo;
  const title: string = props.data.title;

  return (
    <View style={{ height: 120, paddingTop: 5, paddingBottom: 2 }}>
      <View style={{ height: 120, width: 120, marginLeft: 20, }}>
        < View style={{ flex: 2 }}>
          <Image
            style={styles.imageScrollH}
            source={yourPicture} />
        </View>
        <View style={{ flex: 1, paddingLeft: 10, paddingTop: 10 }}>
          <Text style={{ color: "white" }}>{title}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  imageScrollH: {
    flex: 1,
    width: "auto",
    height: "auto",
    alignSelf: 'stretch',
    resizeMode: 'cover',
  }
})