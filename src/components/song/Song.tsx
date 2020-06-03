import * as React from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  AsyncStorage,
} from "react-native";
import { Card, ListItem, Button, Icon } from 'react-native-elements'

interface ISong {
  title: string,
  url: string,
  kind: string,
  valid: boolean,
  author: string,
  ranking: number,
  alert: number,
  check: boolean,
}

export default function Song({ route, navigation }) {
  let token: String | null = null;
  const [song, setSong] = React.useState<ISong>(route.params)
  const [songs, setSongs] = React.useState<ISong[]>(route.params)
  const yourPicture: string = require('../../../assets/1.jpg');
  const getData = async (): Promise<void> => {
    token = await AsyncStorage.getItem("token");
    if (token) {
      async () => {
        console.log(token);
        const response: Response = await fetch(`${BASE_URL}profile`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "auth_token": token
          }
        });
        const res: string = await response.json();
        if (response.status !== 200) {
          alert('Error :-/ Sorry')
          navigation.navigate('HomeLogin')
        }
      }
    }
  };


  // On component did mount once with the []
  React.useEffect(() => {
    getData();
    //==========ADD RIGHT HEADER BUTTON=========
    navigation.setOptions({
      headerRight: () => <Button title="Edit"
        onPress={() => navigation.navigate('EditSong', { songs: songs, props: songs, })}
      />
    })
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center' }}>
      <Text style={styles.title}>{song.title}</Text>
      <Image style={{ height: '50%' }} source={yourPicture} />
      <Text style={styles.text}>{song.song.title}</Text>
      <Text style={styles.text}>{song.song.created_at}</Text>
      <Text style={styles.text}>{song.song.kind}</Text>
      <Text style={styles.text}>{song.song.ranking}</Text>
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
  }
});
