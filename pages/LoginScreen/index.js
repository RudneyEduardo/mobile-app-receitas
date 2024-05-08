import React, { useEffect, useState } from 'react'
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
const logo = require("../../assets/icon.png")


export default function LoginScreen({ navigation }) {
  const [click, setClick] = useState(false);
  const [ username, setUser ] = useState("");
  const [ password, setPassword ] = useState("");

 
  const checkLogin = (e) => {
    if (username === "" || password === "") {
      Alert.alert("Erro de Login", "Senha e/ou Usuário Inválidos")
    } else {
      navigation.setOptions({ title: `Bem vindo! ${username}!` })
      navigation.navigate('Exams', { name: username })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode='contain' />
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <TextInput style={styles.input} placeholder='EMAIL OR USERNAME' value={username} onChangeText={setUser} autoCorrect={false}
          autoCapitalize='none' />
        <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={setPassword} autoCorrect={false}
          autoCapitalize='none' />
      </View>
      <View style={styles.rememberView}>
        <View style={styles.switch}>
          <Switch value={click} onValueChange={setClick} trackColor={{ true: "green", false: "gray" }} />
          <Text style={styles.rememberText}>Manter Conectado</Text>
        </View>
        <View>
          <Pressable onPress={() => Alert.alert("Ainda não implementado!")}>
            <Text style={styles.forgetText}>Esqueceu a senha ?</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={() => {
          checkLogin(username)
        }}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </Pressable>
      </View>
      <Text style={styles.footerText}>Primeiro Acesso ?<Text style={styles.signup}>  Criar Conta</Text></Text>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
  },
  image: {
    height: 160,
    width: 170
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: "red"
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 7
  },
  rememberView: {
    width: "100%",
    paddingHorizontal: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8
  },
  switch: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    alignItems: "center"

  },
  rememberText: {
    fontSize: 13
  },
  forgetText: {
    fontSize: 11,
    color: "red"
  },
  button: {
    backgroundColor: "red",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 50
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "gray",
    fontSize: 13,
    marginBottom: 6
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23
  },
  icons: {
    width: 40,
    height: 40,
  },
  footerText: {
    textAlign: "center",
    color: "gray",
  },
  signup: {
    color: "red",
    fontSize: 13
  }
})