import * as React from 'react';
import { StyleSheet, Image, Text, View, TextInput, TouchableOpacity, Button, AsyncStorage } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Input } from 'react-native-elements';
import GetProfile from '../GetProfile';
import CheckToken from './CheckToken';
import Environment from '../../../Environment';

interface IFormData {
  uri: string,
  name: string,
  type: string,
}

export default function NewPost({ route, navigation, jwt }) {
  const forceUpdate = route.params;
  let token: String | null = null; //  check if well connected
  const [authToken, setAuthToken] = React.useState<string>("")// image display when select an image
  const [image, setImage] = React.useState<string | null>(null)// image display when select an image
  const [files, setFiles] = React.useState<IFormData | Blob | string>("");// forma data to send image to cloud storage
  const [fileWeb, setFileWeb] = React.useState<File | null>(null)
  const [url, setUrl] = React.useState<string>("");// saving url as a string for post to db
  const [post, setPost] = React.useState<Object>({
    title: "", photo: "", text: "", description: "",
  }); //for multiple Form
  const [profile, setProfile] = React.useState<Object>({}); //  to display profile, not necessary now
  const [error, showError] = React.useState<Boolean>(false);


  // waiting for the token from the login, if not go back there
  const getData = async (): Promise<void> => {
    token = await AsyncStorage.getItem("token");
    if (token) {
      if (!getProfile()) {
        navigation.navigate('HomeLogin')
      }
    } 
  }

  // verify your profile and token
  const getProfile = async () => {
    try {
      const response: Response = await fetch(`${Environment.BASE_URL}profile`, {
        method: "GET",
        headers: { "Content-type": "application/json", "auth_token": token }
      });
      const res: string = await response.json();
      if (response.status === 200) {
        setProfile(res);
        setAuthToken(token);//<!>  storing token in localstorage isn't perfect on asynStorage React native
      } else {
        alert('Error :-/ get Profile');
        navigation.navigate('HomeLogin');
      }
    } catch (err) {
      throw (err);
      navigation.navigate('HomeLogin');
    }
  }

  // Allow access to phone library
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  // select an image from library
  const _pickImage = async () => {
    try {
      let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setImage(result.uri);
        setFileWeb(result.uri)
        let newImage: IFormData = {
          uri: result.uri,
          type: `image/${result.uri.split(".")[1]}`,
          name: result.uri.substr(result.uri.lastIndexOf('/') + 1)
        }
        setFiles(newImage);
      }
    } catch (error) {
      console.log("error", error.message)
      throw (error);
    }
  };


  // Uplaod a Post============ need 
  const uploadPost = async (urlTemp: string) => {
    if (post.title && post.description && image) {
      try {
        const response: Response = await fetch(`${Environment.BASE_URL}addpost`, {
          method: "POST",
          headers: { "Content-type": "application/json", "auth_token": authToken },
          body: JSON.stringify({
            title: post.title,
            photo: urlTemp,
            description: post.description,
            postedBy: profile,
            valid: true,
            ranking: 0,
            alert: 0,
            check: false,
            token: token
          })
        });
        const res: JSON = await response.json();
        if (res.status == 200) {
          forceUpdate;
          navigation.navigate('ListPosts', { refresh: true, jwt: route.params.jwt });
        }
        forceUpdate;
        navigation.navigate('ListPosts', { refresh: true, jwt: route.params.jwt });
      } catch (error) {
        console.log("error saving image url")
        throw (error)
      }
    } else {
      showError(true);
      alert('error post');
    }
  }

  // button to send image and save url to the back end
  // TODO : need to check data left and limit upload image
  // const uploadImage = async () => {
  const uploadImage = () => {
    alert('posting');
    try {
      let responseUploadDB: Promise<string | void>;
      let urlTemp: string = "";
      if (files) {
        /// upload from mobile
        const data = new FormData();
        data.append("file", files);
        data.append('upload_preset', `${Environment.CLOUD_KEY}`);

        fetch(`${Environment.CLOUD_KEY}`, {
          method: "post",
          body: data
        }).then(res => res.json())
          .then((file) => {
            setUrl(file.secure_url);
            urlTemp = file.secure_url;
          }).then((data) => {
            if (urlTemp)
              uploadPost(urlTemp);
          })
          .catch((error) => console.log("error", error.message))

        ///////////////// Posting from web app //////////////////////
        if (fileWeb) {
          const data = new FormData();
          data.append("file", fileWeb);
          data.append('upload_preset', `${Environment.CLOUD_KEY}`);
            fetch(`${Environment.CLOUD_KEY}`, {
            method: "post",
            body: data
          }).then(response => response.json())
            .then((file) => {
              setUrl(file.secure_url);
              if (!urlTemp) {
                urlTemp = file.secure_url;
              }
            }).then((data) => {
              if (urlTemp)
                uploadPost(urlTemp);
            }).catch((error) => console.log("error", error.message))
        }
        forceUpdate;
        navigation.navigate('ListPosts', { jwt: route.params.jwt });
      }
    } catch (error) {
      throw (error)
    }
  }

  // upload image from web app and not mobile
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
    getPermissionAsync();
    getData();
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Text>{profile.username}</Text>
          <Text> 😄</Text>
        </View>
      )
    });
  }, [token])//add [profile] to see userdata but LATER :

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.text}>New Image</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Pick an image from camera roll" onPress={_pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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
        <Button
          title="upload"
          onPress={uploadImage} />
      </View>
      {/* <Text>{name}</Text> */}
    </View>
  );
}


const styles = StyleSheet.create({
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'purple',
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
  boxInput: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputBox: {
    color: "black",
    fontSize: 24,
    backgroundColor: 'white',
    borderRadius: 30,
    textAlign: 'center',
    width: "80%",
    margin: 2,
  }, button: {
    padding: 10,
    height: 50,
    backgroundColor: "black",
    justifyContent: "center",
    borderRadius: 30,
    width: "50%",
  }, text: {
    textAlign: 'center',
    color: "grey",
    fontSize: 24,
    justifyContent: "center",
  }, textError: {
    textAlign: 'center',
    color: "red",
    fontSize: 14,
    justifyContent: "center",
  }
});
