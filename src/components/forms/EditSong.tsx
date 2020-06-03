import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from "react-native";
import Environment from '../../../Environment';

interface INavigation {
  navigation: any
}
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
export default function EditSong({ route, navigation }) {
  let token: String | null = null;
  const [value, setValue] = React.useState<string>("");
  const [songs, setSongs] = React.useState<ISong[]>(route.params)
  const [song, setSong] = React.useState<ISong | null>(null)
  const [error, showError] = React.useState<Boolean>(false);

  const pressHandler = async (id: string): Promise<void> => {
    if (song) {
      const response: Response = await fetch(`${Environment.API_URL}updatesong/${id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          "auth_token": token
        },
        body: JSON.stringify({
          title: song.title,
          url: song.url,
          kind: song.kind,
          valid: song.valid,
          author: song.author,
          ranking: song.ranking,
          alert: song.alert,
          check: song.check,
        })
      });
      const res: JSON = await response.json();
      if (response.status === 200) {
        console.log(res)
        alert("email sent");
        navigation.navigate('HomeLogin')
      } else {
        alert('Error email or username exists')
        showError(true)
        setTimeout(() => showError(false), 5000);
      }
    }
  }

  const goToLogin = (): void => {
    navigation.navigate('HomeLogin')
  }

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.text}>New</Text>
      <Text style={styles.textError}>{error ? "Error fields" : ''}</Text>
      <View style={styles.boxInput}>
        <TextInput
          placeholder="value"
          autoCapitalize={"none"}
          value={value}
          style={styles.inputBox}
          onChangeText={e => {
            setValue(e);
            showError(false);
          }}
        />
        <TouchableOpacity onPress={() => alert('lol')}>
          <View style={styles.button}>
            <Text style={styles.text}>Go</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Button title="Forget Password" onPress={goToLogin} />
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
