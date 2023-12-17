import { Button, Center } from "native-base";
import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,TextInput} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts, Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium } from '@expo-google-fonts/poppins';
import {useNavigation} from "@react-navigation/native";
import { Alert } from "react-native";
import { json } from "body-parser";
import * as ImagePicker from "react-native-image-picker";
var RNFS = require('react-native-fs');
import { white } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
const serverIP = "http://192.168.1.5:3001/";
// import TextInput from "../src/components/TextInput";

const Assessment=()=>{
  const navigation = useNavigation();
    const [audio,setaudio]=useState();
    const [CorrectOption,setCorrectOption]=useState("");
    const [Info,setInfo]=useState({});
    const [photo1,setPhoto1] = useState("");
    const [photo2,setPhoto2] = useState("");
    const [photo3,setPhoto3] = useState("");
    const [photoName,setPhotoName] = useState("");
   
    const onTextChange4 = (txt) => {
      setCorrectOption(txt);
    }
    const handleUploadImage = (response) => {
      const data = new FormData();
     
      data.append("file", 'data:image/jpg;base64,' + response.assets[0].base64);
      // data.append("file",response);
      data.append("cloud_name", "dplappado");
      data.append("upload_preset", "fluencyApp");
              
   fetch("https://api.cloudinary.com/v1_1/dplappado/image/upload",{
    method : "post",
    body: data,
   }).then(res => res.json())
     .then(data => {
      console.log("results of assessment=",data);
      // console.log(data.url);
            if(photo1==="")setPhoto1(data.url);
            else if(photo2==="")setPhoto2(data.url);
            else if(photo3==="")setPhoto3(data.url);
            console.log("photo1=",photo1);
        }).catch((err) => {
            console.log("error=",err)
        })
  }
    const handleChooseImage = () => {
      const options = {
          mediaTypes: 'Images',
          allowsEditing:true,
          quality: 0.1,
          includeBase64: true
          };
        ImagePicker.launchImageLibrary(options,(response) => {
          if(response.didCancel !== true)
          { 
              if (response.didCancel !== true) {

              
                let newFile = {
                  uri : response.assets[0].uri,
                  type : response.assets[0].type,
                  name : response.assets[0].name
                };
              
                handleUploadImage(response);
              }
          }else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
           }else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
           }
        }); 
     }
    const pull_voice = async (data) => {
      try {
        const tempData = await RNFS.readFile(data.toString(), 'base64');
        const fd = new FormData();
        fd.append('file', `data:audio/mpeg;base64,${tempData}`);
        fd.append('upload_preset', 'fluencyApp');
        fd.append('cloud_name', 'dplappado');
        fd.append('resource_type', 'auto');
    
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dplappado/video/upload',
          {
            method: 'POST',
            body: fd
          }
        );
        if (!response.ok) {
          throw new Error('Failed to upload audio');
        }
        const responseData = await response.json();
        setaudio(responseData.url);
        console.log('DATA Received = ', responseData);
      } catch (error) {
        console.log(error);
      }
    };
    

      const onSubmit =async()=>{
        const data={audio,photo1,photo2,photo3,CorrectOption};
        setInfo(data);
        console.log("audio=",audio);
        // alert(Option1);
        fetch('http://192.168.1.5:3001/assess', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

          audio:audio,
      
          option1: photo1,
      
          option2: photo2,

          option3:photo3,

          correct_option:CorrectOption,
        })
      }).then(response => response.json())
        .then(json=>console.log(json))
        .catch(error => console.error(error))

        Alert.alert(
          "Data Submitted",
          "Record added successfully",                   
          [
            {
              text: "Ok",
              style: "cancel"
            },                     
          ]
        );
      }
    return (
        <View style={styles.container}>
            <Text style={{marginBottom:8}}>Welcome to Assessment</Text>
            <Button w={250} style={styles.btn} startIcon={<Icon name="music" size={18} color="#FFF"/>} onPress={() =>navigation.navigate('Voice1', {onGoBack : pull_voice})}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12,color:"white"}}> Choose ऑडिओ  </Text>
            </Button>
              <Button w={250} style={{paddingHorizontal: 100,marginVertical:10}} colorScheme="blueGray" startIcon={<Icon name="camera" size={18} color="#FFF"/>} onPress={handleChooseImage}>
                 <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white">{photo1===""?"Choose फोटो 1":"uploaded"}</Text>
              </Button>
              <Button w={250} style={{paddingHorizontal: 100,marginVertical:10}} colorScheme="blueGray" startIcon={<Icon name="camera" size={18} color="#FFF"/>} onPress={handleChooseImage}>
                 <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white"> {photo2===""?"Choose फोटो 2":"uploaded"} </Text>
              </Button>
              <Button w={250} style={{paddingHorizontal: 100,marginVertical:10}} colorScheme="blueGray" startIcon={<Icon name="camera" size={18} color="#FFF"/>} onPress={handleChooseImage}>
                 <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white"> {photo3===""?"Choose फोटो 3":"uploaded"}  </Text>
              </Button>

              <TextInput
                style={{alignItems:'center',justifyContent:'center',color:'black',backgroundColor:'white',paddingHorizontal: 100,marginVertical:15}} 
                placeholder = 'Add CorrectOption'
                value={CorrectOption}
                onChangeText={(text) => onTextChange4(text)}
              />

              <Button w={250} style={{backgroundColor:"green",paddingHorizontal: 100,marginVertical:10}} onPress={onSubmit}>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12,color:"white"}}> Submit  </Text>
              </Button>

        </View>
    );
}

const styles=StyleSheet.create({
    container:{
        flex:1,
        alignContent:"center",
        justifyContent:"center",
        alignItems:"center"
    },
    btn:{
        marginBottom:8,
        backgroundColor:"purple"
    }
})
export default Assessment;