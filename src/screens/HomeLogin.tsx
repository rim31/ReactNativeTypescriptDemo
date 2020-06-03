import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, AsyncStorage } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Environment from '../../Environment';


export default function HomeLogin({ navigation }) {
  const [email, setEmail] = React.useState<String>("")
  const [token, setToken] = React.useState<String>("")
  const [password, setPassword] = React.useState<String>("")
  const [error, showError] = React.useState<Boolean>(false);

  const pressHandler = async (): Promise<void> => {
    if (email && password) {
      try {
        const response: Response = await fetch(`${Environment.BASE_URL}signin`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: email, password: password }),
        });
        const res: JSON | boolean = await response.json();
        console.log(res.token);
        if (res === "invalid password" || res === false) {
          showError(true);
        }
        if (res.token) {
          setToken(res.token);
          saveData(res.token);
        } else {
          showError(true);
          setTimeout(() => showError(false), 5000);
          AsyncStorage.clear();
          console.log("error delay");
        }
      } catch (err) {
        showError(true);
        alert("wrong login/password");
        console.log("error", err.message);
      }
    } else {
      saveData("");
      showError(true)
      setTimeout(() => showError(false), 5000);
    }
  }

  const goToRegister = (): void => {
    AsyncStorage.clear();
    navigation.navigate('HomeRegister')
  }

  const saveData = async (token: string) => {
    await AsyncStorage.setItem("token", token);
  };

  const getData = async () => {
    let jwt: string | null = await AsyncStorage.getItem("token");
    if (jwt) {
      navigation.navigate('ListPosts', { jwt: jwt })
    }
  };

  React.useEffect(() => {
    getData();
  }, [token]);
  return (
    <View style={styles.inputWrapper}>
      <LinearGradient
        colors={['yellow', 'purple']}
        style={styles.gradient}
      />
      <Text style={styles.text}
      >Home - Login </Text>
      <Text style={styles.textError}>{error ? "Error fields" : ''}</Text>
      <View style={styles.boxInput}>
        <TextInput
          placeholder="Email"
          value={email}
          type="email"
          style={styles.inputBox}
          autoCapitalize={"none"}
          onChangeText={e => {
            setEmail(e);
            showError(false);
          }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          type="password"
          style={styles.inputBox}
          autoCapitalize={"none"}
          onChangeText={e => {
            setPassword(e);
            showError(false);
          }}
        />
        <TouchableOpacity onPress={pressHandler}>
          <View style={styles.button}>
            <Text style={styles.text}>Go</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Button title="Register" onPress={goToRegister} />
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
    minWidth: 50,
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
