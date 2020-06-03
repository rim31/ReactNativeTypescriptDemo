import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, AsyncStorage } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';
import Environment from '../../Environment';


export default function HomeProfile({ navigation }) {
  const [email, setEmail] = React.useState<String>("")
  const [username, setUsername] = React.useState<String>("")
  let token: String | null = null;


  // waiting for the token from the login, if not go back there
  const getData = async (): Promise<void> => {
    token = await AsyncStorage.getItem("token");
    if (token) {
      getSongs();
    } else {
      navigation.navigate('HomeLogin')
    }
  };

  // fct get all data Song from api
  const getSongs = async (): Promise<void> => {
    const response: Response = await fetch(`${Environment.BASE_URL}profile`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "auth_token": token
      }
    });
    const res: string = await response.json();
    if (res.length === 0) {
      navigation.navigate('HomeLogin')
    }
    if (response.status === 200) {
      console.log(res)
      setUsername(res.username)
      setEmail(res.email)
    }
  }

  // to navigation between pages
  const disconnectClicked = (): void => {
    AsyncStorage.clear();
    navigation.navigate('HomeLogin');
  };

  // On component did mount once with the []
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.text}
      >Profile</Text>
      <View style={styles.boxInput}>
        <Text style={styles.text}>{username}</Text>
        <Text style={styles.text}>{email}</Text>
        <TouchableOpacity onPress={disconnectClicked}>
          <View style={styles.button}>
            <Text style={styles.text}>Change</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Button title="disconnect" onPress={disconnectClicked} />
      <Button title="Close Account" onPress={() => alert(':-X')} />
      <Button title="Change password" onPress={() => alert('email send')} />
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


