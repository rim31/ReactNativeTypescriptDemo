import * as React from "react";
import { View, ScrollView, Text, FlatList, TouchableOpacity, StyleSheet, AsyncStorage, Dimensions, RefreshControl } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import ImageSong from './song/ImageSong';
import DetailPost from './post/DetailPost';
import Categories from './categories/Categories';
import SplitTiles from './categories/SplitTiles';
import CheckToken from './forms/CheckToken';
import Environment from '../../Environment';

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

export default function ListPosts({ route, navigation, jwt }) {
  let token: String | null = null;
  const [isLoading, setIsLoading] = React.useState<boolean>(route.params.refresh ? route.params.refresh : false);
  const [refresh, setRefresh] = React.useState<boolean>(route.params);
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
      setIsLoading(true);
      await fetch(`${Environment.BASE_URL}myposts`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth_token": token
        }
      }).then((response: any) => response.json())
        .then((res: any) => setPosts(res))
        .finally(() => { setIsLoading(false) })
    } catch (err) {
      console.log("error", err.message)
      navigation.navigate('HomeLogin')
      throw (err);
    }
  }

  // to navigation between pages
  const postClicked = (post: any) => {
    navigation.navigate('Post', {
      post: post,
      posts: posts,
      setIsLoading: setIsLoading,
      jwt: route.params.jwt,
    });
  };

  const handleIsLoading = () => {
    setIsLoading(true),
      () => { getPosts() }
  }

  const forceUpdate = () => {
    setRefresh(!refresh);
    getPosts();
  };

  // check JWT
  const check: any = async (jwt: string) => {
    return await CheckToken(jwt)
  }

  // On component did mount once with the []
  React.useEffect(() => {
    // check JWT
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
        <Button title="⏹ " onPress={() => navigation.navigate('ListSongs', { jwt: route.params.jwt })} />
        <Button title="+"
          onPress={() => navigation.navigate('NewPost', { forceUpdate: forceUpdate, jwt: route.params.jwt })}
        />
      </View>
      )
    });
  }, [refresh]);


  return (
    <View style={{ backgroundColor: '#222f3e' }}>
      <ScrollView scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={getData}
          />} >
        <View style={{ flex: 1, backgroundColor: '#222f3e', paddingTop: 5 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 20, color: "white", backgroundColor: '#222f3e' }}>
            Horizontal
          </Text>
          <View style={{ height: 150, paddingTop: 5, backgroundColor: '#222f3e' }}>
            <ScrollView horizontal={true}
              showsHorizontalScrollIndicator={false} >
              <Categories data={{ photo: require('../../assets/A.jpg'), title: "popular" }} />
              <Categories data={{ photo: require('../../assets/B.jpg'), title: "trendy" }} />
              <Categories data={{ photo: require('../../assets/C.jpg'), title: "souvenir" }} />
              <Categories data={{ photo: require('../../assets/E.jpg'), title: "party" }} />
              <Categories data={{ photo: require('../../assets/D.jpg'), title: "vintage" }} />
              <Categories data={{ photo: require('../../assets/F.jpg'), title: "style" }} />
              <Categories data={{ photo: require('../../assets/G.jpg'), title: "future" }} />
            </ScrollView>
          </View>
          {/* <View style={{ marginTop: 40, paddingHorizontal: 20 }}> */}
          <View style={{ marginTop: 4, paddingHorizontal: 10, backgroundColor: '#222f3e' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: "white" }}>Introduction to my application</Text>
            <Text style={{ marginTop: 20, fontWeight: '100', color: "white" }}>Verical scroll</Text>


            {/* ///////////// display list DOUBLE  /////////////// */}

            <View style={{ marginTop: 40, backgroundColor: '#222f3e' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 10, color: 'white' }}>
                Split screen</Text>
            </View>
            <View style={{ paddingHorizontal: 10, marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', backgroundColor: '#222f3e' }}>

              <FlatList
                data={posts}
                ItemSeparatorComponent={
                  () => <View style={{ width: 9, backgroundColor: '#222f3e' }} />
                }
                keyExtractor={(item, index) => index + item}
                refreshing={isLoading}
                onRefresh={getData}
                numColumns={2}
                renderItem={({ item, index }) => (
                  <View>
                    <TouchableOpacity onPress={() => postClicked(item)}>
                      <View style={{ margin: 5, backgroundColor: '#222f3e' }}>
                        <SplitTiles post={item} />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

          </View>
        </View>
      </ScrollView >

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: "lightgrey",
  },
  mic: {
    position: 'relative',
    top: 50,
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: "center",
  },
  name: { fontSize: 12 },
  imageCard: {
    maxHeight: 33,
    maxWidth: 33,
  },
  image: {
    maxHeight: '33%',
  },
  flatList: {
    backgroundColor: '#333333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 4,
    maxHeight: 45,
    backgroundColor: "black",
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