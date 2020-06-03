import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TextInput
} from "react-native";
import { Card, ListItem, Icon } from 'react-native-elements';
import CheckToken from '../forms/CheckToken';
import Environment from '../../../Environment';


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
  const [newPost, setNewPost] = React.useState<IPost>(post)
  const [posts, setPosts] = React.useState<IPost[]>(route.params)
  const yourPicture: string = post.photo;
  // take only the public_id from the url, get the last /, thans split '.' ant take the name
  const public_id: string = (yourPicture.substr(yourPicture.lastIndexOf('/') + 1)).split('.')[0];
  const [error, showError] = React.useState<Boolean>(false);



  ////////////////// DELETE///////////////
  const deletePost = async () => {
    try {
      const response: Response = await fetch(`${Environment.BASE_URL}post/${post._id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json", "auth_token": route.params.jwt },
        body: JSON.stringify({
          title: post.title,
          description: post.description,
          ranking: post.ranking,
          photo: post.photo,
          kind: post.kind,
          valid: false,
        })
      });
      const res: JSON = await response.json();
      if (res.status == 200) {
        alert("Deleted")
        navigation.navigate('ListPosts', { refresh: true, jwt: route.params.jwt });
      }
      navigation.navigate('ListPosts', { refresh: true, jwt: route.params.jwt });
    } catch (error) {
      console.log("error deleting image url", error.message)
      throw (error)
    }
  }

  ////////////////// UPDATE////////////////
  const updatePost = async () => {
    try {
      await fetch(`${Environment.BASE_URL}post/${post._id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json", "auth_token": route.params.jwt },// token reset to null when changing text ?!
        body: JSON.stringify({
          title: post.title,
          description: post.description,
          ranking: post.ranking,
          photo: post.photo,
          kind: post.kind,
          valid: true,
        })
      }).then((response) => response.json())
        .then((res) => {
          navigation.navigate('ListPosts', { refresh: true, jwt: route.params.jwt });
        })
    } catch (error) {
      console.log("error update image url", error.message)
      throw (error)
    }
  }

  function handleChange(name: string, value: string) {
    setPost({
      ...post,
      [name]: value
    });
  }

  const checkJWT: any = async (jwt: string) => {
    return await CheckToken(jwt)
  }


  // On component did mount once with the []
  React.useEffect(() => {
    checkJWT(route.params.jwt).then((res: any) => {
      if (!res) navigation.navigate("HomeLogin");
    })
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center' }}>
      <Text style={styles.title}>{post.title}</Text>
      <Image
        style={styles.image}
        source={{ uri: yourPicture }} />
      <Text style={styles.text}>cannot change image, delete post and create new one if necessary</Text>
      <Text style={styles.textError}>{error ? "Error fields" : ''}</Text>
      <TextInput
        name="title"
        placeholder="title"
        autoCapitalize={"none"}
        value={post.title}
        style={styles.inputBox}
        onChangeText={(evt) => handleChange('title', evt)}
      />
      <TextInput
        name="description"
        multiline={true}
        numberOfLines={2}
        placeholder="description"
        autoCapitalize={"none"}
        value={post.description}
        style={styles.inputBox}
        onChangeText={(evt) => handleChange('description', evt)}
      />
      <Button title="Update" onPress={updatePost} />
      <Button title="Delete" color="#ff5c5c" onPress={deletePost} />
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
  }, logo: {
    width: 66,
    height: 58,
  }, image: {
    width: 300,
    height: 300,
  }, inputBox: {
    color: "black",
    fontSize: 24,
    backgroundColor: 'white',
    borderRadius: 30,
    textAlign: 'center',
    width: "80%",
    margin: 2,
  },
});
