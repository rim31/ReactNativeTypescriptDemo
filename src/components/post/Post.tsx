import * as React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, AsyncStorage, Button, } from "react-native";
import { Rating } from 'react-native-elements';
import CheckToken from '../forms/CheckToken';

interface IPost {
  title: string,
  description: string,
  photo: string,
  kind: string,
  valid: boolean,
  postedBy: Object,
  ranking: number,
  alert: number,
  check: boolean,
}

export default function Post({ route, navigation, jwt }) {
  let token: String | null = null;
  const [post, setPost] = React.useState<IPost>(route.params.post)
  const [posts, setPosts] = React.useState<IPost[]>(route.params.posts)
  const yourPicture: string = post.photo;
  // take only the public_id from the url, get the last /, than split '.' ant take the name
  const public_id: string = (yourPicture.substr(yourPicture.lastIndexOf('/') + 1)).split('.')[0]



  const check: any = async (jwt: string) => {
    return await CheckToken(jwt)
  }


  // On component did mount once with the []
  React.useEffect(() => {
    check(route.params.jwt).then((res: any) => {
      if (!res) navigation.navigate("HomeLogin");
    })

    //==========ADD RIGHT HEADER BUTTON=========
    navigation.setOptions({
      headerRight: () => <Button title="Edit"
        onPress={() => navigation.navigate('EditPost', {
          post: post,
          posts: posts.posts,
          setIsLoading: route.params.setIsLoading,
          refresh: true,
          jwt: route.params.jwt
        })}
      />
    })
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#222f3e', alignItems: 'center', width: '100%', height: '100%', }}>
      <Text style={styles.title}>{post.title}</Text>
      <Image
        style={styles.image}
        source={{ uri: yourPicture }} />
      <Text style={{ fontSize: 10, color: "white" }}>Description :</Text>
      <Text style={styles.text}>{post.description}</Text>
      <Text style={styles.text}>{post.kind}</Text>
      <Rating
        // showRating
        fractions={1}
        startingValue={post.rating}
        imageSize={20}
        ratingColor='orange'
        ratingBackgroundColor='white'
        type='custom'
        ratingCount={5}
        tintColor='#222f3e'
      />
      <Text style={{ fontSize: 9, color: "grey" }}>{post.created_at.substring(0, 10)}</Text>
      <Text style={styles.text}>{post.ranking}</Text>
      {/* <Button title="delete" onPress={deletePost} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "hotpink",
    borderRadius: 5,
  },
  title: {
    color: 'white',
    fontSize: 24,
    padding: 5
  },
  text: {
    color: 'white',
    fontSize: 14,
    padding: 5
  },
  logo: {
    width: 66,
    height: 58,
  },
  image: {
    flex: 1,
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
});

