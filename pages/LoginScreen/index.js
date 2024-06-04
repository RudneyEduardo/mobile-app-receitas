import React, { useEffect, useState } from 'react'
import { Alert, Image, Pressable, SafeAreaView, Switch, Text, TextInput, View } from 'react-native'
import { styles } from './style';
const logo = require("../../assets/main.png")


export default function LoginScreen({ navigation }) {
  const [click, setClick] = useState(false);
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");


  const checkLogin = (e) => {
    if (username === "" || password === "") {
      Alert.alert("Erro de Login", "Senha e/ou Usuário Inválidos")
    } else {
      fetch('https://receitas-node-app-project.onrender.com/api/account', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'username': username
        },
      }).then(response => response.json())
        .then(data => {
          if(data === null) return Alert.alert('Erro de Login!', 'Usuário inválido!')
          if (data.password === password) {
            navigation.setOptions({ title: `Bem vindo! ${username}!` })
            navigation.navigate('Exams', { name: username })
          }
          else { Alert.alert("Erro de Login", "Senha Inválida") }
        })
        .catch(error => console.error(error));
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
          <Switch value={click} onValueChange={setClick} trackColor={{ true: "blue", false: "gray" }} />
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
      <Text style={styles.footerText}>Primeiro Acesso ?<Text onPress={() => Alert.alert("Envie um e-mail para: ", "recipes.users@recipes.com")} style={styles.signup}>  Criar Conta</Text></Text>
    </SafeAreaView>
  )
}


