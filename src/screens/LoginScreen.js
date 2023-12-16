import React, { useEffect, useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [Data, setData] = useState([]);
  const serverIP="http://192.168.197.55:3001/";
  const getData = async() => {
       
    fetch(serverIP + 'doctor')
    .then(response => response.json())
    .then(results => {console.log("results = ",results); setData(results);console.log(Data);});
}
useEffect(()=>{
  getData();
},[])

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value)
    const passwordError = passwordValidator(password.value)
    // var data=JSON.parse(Data)
    // var data=JSON.parse(Data)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    let f=0;
    for (const i in Data) {
      if(Data[i].email===email.value && Data[i].password===password.value){
        // Alert.alert("Email or password is not correct");
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        })
        f=1; 
      }
    }
    // if(Data[0].email!==email.value || Data[0].password!==password.value){
    //   Alert.alert("Email or password is not correct"); 
    // }
    if(f==0){
      Alert.alert("Email or password is not correct");
    }
  }

  return (
    <Background>
      
      <Logo />
      <Header>वेलकम बॅक </Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        लॉगिन 
      </Button>
      {/* <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View> */}
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
