
// https://medium.com/@amanshharma/react-native-todo-app-using-typescript-and-hooks-bacc5db05100
import * as React from 'react';
import EditSong from './src/components/forms/EditSong';
import NewSong from './src/components/forms/NewSong';
import NewPost from './src/components/forms/NewPost';
import ListSongs from './src/components/ListSongs';
import ListPosts from './src/components/ListPosts';
import Song from './src/components/song/Song';
import Post from './src/components/post/Post';
import EditPost from './src/components/post/EditPost';
import HomeLogin from "./src/screens/HomeLogin";
import HomeRegister from "./src/screens/HomeRegister";
import HomeProfile from "./src/screens/HomeProfile";
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Image } from "react-native";
const Stack = createStackNavigator();

function LogoTitle() {
  return (
    <Image
      style={{ width: 45, height: 45 }}
      source={require('./assets/myLogo.png')}
    />
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeLogin" component={HomeLogin}
          options={{ headerTitle: props => <LogoTitle {...props} /> }}
        />
        <Stack.Screen name="HomeRegister" component={HomeRegister} options={{ title: 'Register' }} />
        <Stack.Screen name="HomeProfile" component={HomeProfile} options={{ title: 'Profile' }} />
        <Stack.Screen name="ListSongs" component={ListSongs}
          options={{ title: 'Playlist', headerLeft: () => (<Text></Text>), }} />
        <Stack.Screen name="Song" component={Song} options={{ title: 'Song Detail' }} />
        <Stack.Screen name="Post" component={Post} options={{ title: 'Post Detail' }} />
        {/* <Stack.Screen
          name="Song"
          component={Song}
          options={{
            title: 'Detail',
            // headerRight: () => (
            //   <Button onPress={() => alert('Edit')}
            //     title="Edit" color="#0AF" />
            // ),
          }}
        /> */}
        <Stack.Screen name="EditSong" component={EditSong} options={{ title: 'Edit' }} />
        <Stack.Screen name="NewSong" component={NewSong} options={{ title: 'New Song' }} />
        <Stack.Screen name="ListPosts" component={ListPosts} options={{ title: 'your Posts' }} />
        <Stack.Screen name="NewPost" component={NewPost} options={{ title: 'New Post' }} />
        <Stack.Screen name="EditPost" component={EditPost} options={{ title: 'Edit Post' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;