import * as React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, AsyncStorage, ScrollView, Image, Dimensions } from 'react-native'
import { Card, Button, Icon } from 'react-native-elements'
import ImageSong from './song/ImageSong';
import ImagePost from './post/ImagePost';
import Categories from './categories/Categories';
import SplitTiles from './categories/SplitTiles';
import CheckToken from './forms/CheckToken';
import Environment from '../../Environment';

// import { LinearGradient } from 'expo-linear-gradient';

interface IPost {
  title: string,
  photo: string,
  description: string,
  kind: string,
  valid: boolean,
  postedBy: Object,
  ranking: number,
  alert: number,
  check: boolean,
}

const win = Dimensions.get('window');

export default function ListSongs({ route, navigation, jwt }) {

  let token: String | null = null;
  const [refresh, setRefresh] = React.useState<boolean>(route.params);
  const [refreshList, setRefreshList] = React.useState<boolean>(false);
  const [data, setData] = React.useState<IPost | null>(null);
  const [posts, setPosts] = React.useState<IPost[] | string>([])

  // waiting for the token from the login, if not go back there
  const getData = async (): Promise<void> => {
    token = await AsyncStorage.getItem("token");
    if (token) {
      if (!getPosts()) {
        navigation.navigate('HomeLogin')
      }
    } else {
      navigation.navigate('HomeLogin')
    }
  };

  // fct get all data Song from api
  const getPosts = async (): Promise<void> => {
    try {
      setRefreshList(true);
      await fetch(`${Environment.BASE_URL}myposts`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth_token": token
        }
      }).then((response: any) => response.json())
        .then((res: any) => setPosts(res))
        .finally(() => { setRefreshList(false) })
    } catch (err) {
      console.log("error", err.message)
      navigation.navigate('HomeLogin')
      throw (err);
    }
  }

  const handleRefreshList = () => {
    setRefreshList(true),
      () => { getPosts() }
  }

  // to navigation between pages
  const postClicked = (post: any) => {
    navigation.navigate('Post', {
      post: post,
      posts: posts,
      jwt: route.params.jwt,
    });
  };


  const forceUpdate = () => {
    setRefresh(!refresh);
    getPosts();
  };

  const check: any = async (jwt: string) => {
    return await CheckToken(jwt)
  }


  // On component did mount once with the []
  React.useEffect(() => {
    check(route.params.jwt).then((res: any) => {
      if (!res) navigation.navigate("HomeLogin");
    })

    getData();
    //==========ADD RIGHT HEADER BUTTON=========
    navigation.setOptions({
      headerLeft: () => <Button title="Profile"
        onPress={() => navigation.navigate('HomeProfile', { getPosts: getPosts })}
      />
    });
    navigation.setOptions({
      headerRight: () => (<View style={{ flexDirection: "row" }}>
        <Button title="📱 " onPress={() => navigation.navigate('ListPosts', { refresh: true, jwt: route.params.jwt })} />
        <Button title="+"
          onPress={() => navigation.navigate('NewPost', { forceUpdate: forceUpdate, jwt: route.params.jwt })}
        />
      </View>
      )
    });
  }, [refresh]);


  return (
    <View style={styles.container}>
      {/* <LinearGradient colors={['yellow', 'purple']}
        style={{ flex: 1,position: 'absolute',left: 0,right: 0,top: 0,height: "100%",}}
      /> */}
      <Button title="Update" onPress={forceUpdate} />

      <ScrollView scrollEventThrottle={16} >
        <View style={{ flex: 1, backgroundColor: '#222f3e', paddingTop: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 20, color: "white" }}>
            Horizontal
          </Text>
          <View style={{ height: 150, paddingTop: 20 }}>
            <ScrollView horizontal={true}
              showsHorizontalScrollIndicator={false} >
              <Categories data={{ photo: require('../../assets/1.jpg'), title: "popular" }} />
              <Categories data={{ photo: require('../../assets/2.jpg'), title: "rock" }} />
              <Categories data={{ photo: require('../../assets/3.jpg'), title: "souvenir" }} />
              <Categories data={{ photo: require('../../assets/4.jpg'), title: "oldies" }} />
              <Categories data={{ photo: require('../../assets/5.jpg'), title: "vintage" }} />
            </ScrollView>
          </View>
          <View style={{ marginTop: 40, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: "white" }}>Introduction to my application</Text>
            <Text style={{ marginTop: 20, fontWeight: '100', color: "white" }}>Verical scroll</Text>



            {/* ///////////// display list OK /////////////// */}
            <FlatList
              style={styles.flatList}
              data={posts}
              keyExtractor={(item, index) => index + item
              }
              refreshing={refreshList}
              onRefresh={getData}
              renderItem={({ item, index }) => (
                <View>
                  <TouchableOpacity onPress={() => postClicked(item)}>
                    <View style={{ width: win.width - 20, height: 200, marginTop: 20, borderRadius: 5, borderColor: 'grey', borderWidth: 1, }}>
                      <Image
                        style={{ flex: 1, resizeMode: 'cover', width: 'auto', height: 'auto', }}
                        source={{ uri: item.photo }}
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'column', }}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.description}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>


        {/* ///////////// display list DOUBLE  /////////////// */}

        <View style={{ marginTop: 40 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 20, color: 'white' }}>
            Split screen</Text>
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', }}>
          <FlatList
            data={posts}
            ItemSeparatorComponent={
              () => <View style={{ width: 9, backgroundColor: 'pink' }} />
            }
            keyExtractor={(item, index) => index + item}
            refreshing={refreshList}
            onRefresh={getData}
            numColumns={2}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity onPress={() => postClicked(item)}>
                  <View style={{ margin: 5, }}>
                    <SplitTiles post={item} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </ScrollView >

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: "#222f3e",
  }, imageScrollH: {
    flex: 1,
    width: win.width,
    height: win.height,
    resizeMode: 'cover',
  }, myCard: {
    paddingBottom: 15,
  }, mic: {
    position: 'relative',
    top: 50,
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: "center",
  },
  name: {
    fontSize: 12
  },
  imageCard: {
    maxHeight: 33,
    maxWidth: 33,
  },
  image: {
    maxHeight: '33%',
  },
  flatList: {
    backgroundColor: "#222f3e",
  },
  item: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 4,
    height: +win.width + +45,
    backgroundColor: "#222f3e",
    justifyContent: "flex-start",
  },
  title: {
    color: "white",
    fontSize: 24,
  },
  subtitle: {
    color: "white",
    fontSize: 12,
  },
  logoImage: {
    height: 50,
    width: "100%",
    paddingTop: 5,
    resizeMode: "contain",
  },
  right: {
    color: "yellow",
    alignSelf: 'flex-end',
  },
  logo: {
    width: 66,
    height: 58,
  },
});