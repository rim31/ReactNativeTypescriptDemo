import * as React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';
import Environment from '../../Environment';

interface INavigation {
  navigation: any
}

export default function HomeRegister({ navigation }) {
  const [email, setEmail] = React.useState<String>("")
  const [username, setUsername] = React.useState<String>("")
  const [password, setPassword] = React.useState<String>("")
  const [error, showError] = React.useState<Boolean>(false);

  const pressHandler = async (): Promise<void> => {
    if (email && password) {
      const response: Response = await fetch(`${Environment.BASE_URL}signup`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ username: username, email: email, password: password }),
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
    } else {
      showError(true)
      setTimeout(() => showError(false), 5000);
    }
  }

  const goToLogin = (): void => {
    navigation.navigate('HomeLogin')
  }

  const onEmailChange = (e: any) => {
    const value = e.nativeEvent.text;
    setEmail(value);
  }
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.text}
      >Welcome - Login</Text>
      <Text style={styles.textError}>{error ? "Error fields" : ''}</Text>
      <View style={styles.boxInput}>
        <TextInput
          placeholder="Username"
          autoCapitalize={"none"}
          value={username}
          style={styles.inputBox}
          onChangeText={e => {
            setUsername(e);
            showError(false);
          }}
        />
        <TextInput
          placeholder="Email"
          autoCapitalize={"none"}
          value={email}
          type="email"
          style={styles.inputBox}
          onChangeText={e => {
            setEmail(e);
            showError(false);
          }}
        />
        <TextInput
          placeholder="Password"
          autoCapitalize={"none"}
          value={password}
          type="password"
          style={styles.inputBox}
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
