import React from 'react'
import { View, Text, Image, Dimensions } from 'react-native'
import { Rating } from 'react-native-elements';
const win = Dimensions.get('window');
// https://www.youtube.com/watch?v=Ebqtkqw95Y8
// https://react-native-elements.github.io/react-native-elements/docs/rating.html

export default function SplitTiles({ post }) {
  const yourPicture: string = post.photo;

  return (
    <View>
      <View style={{ width: win.width / 2 - 30, height: win.width / 2 - 30, borderWidth: 0.5, borderColor: 'grey', }}>
        <View style={{ flex: 1 }}>
          <Image
            style={{ flex: 1, resizeMode: 'cover', width: "auto", height: "auto", }}
            source={{ uri: yourPicture }}
          />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'space-evenly', paddingLeft: 10 }}>
          <Text style={{ fontSize: 10, color: 'red' }}>{post.title}</Text>
          <Text style={{ fontSize: 12, color: 'grey', fontWeight: 'bold' }}>{post.description}</Text>
          <Text style={{ fontSize: 10, color: 'grey' }}>42 €</Text>
          <Rating
            fractions={1}
            startingValue={post.rating}
            imageSize={10}
            ratingColor='orange'
            ratingBackgroundColor='white'
            type='custom'
            ratingCount={5}
            tintColor='#222f3e'
          />
        </View>
      </View>
    </View>

  )
}
