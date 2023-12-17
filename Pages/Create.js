import React,{useState} from 'react'
import { StyleSheet } from 'react-native';
import { NativeBaseProvider,  VStack,View,Text, Button,Image} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts, Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium } from '@expo-google-fonts/poppins';
import * as ImagePicker from "react-native-image-picker";
import {useNavigation} from "@react-navigation/native";

var RNFS = require('react-native-fs');

import { LogBox } from 'react-native';
import { Alert } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function Create() {
    const navigation = useNavigation();
    const [photo,setPhoto] = useState(null);
    const [photoName,setPhotoName] = useState("");
    const [categoryName,setCategoryName] = useState("");
    const [subCategoryName,setSubCategoryName] = useState("");
    const [voiceName,setVoiceName] = useState("");
    const serverIP = "http://192.168.1.5:3001/";
    let [fontsLoaded] = useFonts({
      Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium
    });

   
  
    const handleUploadImage = (response) => {
        const data = new FormData();
        data.append("file", 'data:image/jpg;base64,' + response.assets[0].base64);
        data.append("cloud_name", "dplappado");
        data.append("upload_preset", "fluencyApp");

        console.log("data= ",data);
     fetch("https://api.cloudinary.com/v1_1/dplappado/image/upload/",{
      method : "post",
      body: data,
     }).then(res => res.json())
       .then(data => {
        console.warn(data);
             setPhotoName(data.url);
             setPhoto('data:image/jpg;base64,' + response.assets[0].base64);
          }).catch((err) => {
              console.log(err)
          })
    }
    const handleChooseImage = () => {
        const options = {
            mediaTypes: 'Images',
            quality: 0.1,
            allowsEditing:true,
            includeBase64: true
            };
          ImagePicker.launchImageLibrary(options,(response) => {
            if(response.didCancel !== true)
            { 
                    // setPhoto(response.assets[0].uri);
                    // console.log(response.assets[0].uri);
                
                
                let newFile = {
                  uri : response.assets[0].uri,
                  type : response.assets[0].type,
                  name : response.assets[0].name
                };  

                handleUploadImage(response);
            }else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
             }else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
             }
          }); 
    }
    const pull_data = (data) => {
      console.log("Data recieved from category = ",data);
      setCategoryName(data.title);
      setSubCategoryName(data.subTitle);
    }
    console.log("data received from category= ",categoryName);

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
        setVoiceName(responseData.url);
        console.log('DATA Received = ', responseData);
        console.log('audio url = ',responseData.url);
      } catch (error) {
        console.log(error);
      }
    };

    const onSubmitData =async()=>{
      const data={photoName,categoryName,subCategoryName,voiceName};
      fetch('http://192.168.1.5:3001/storeData', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        cardImg:photoName,
    
        cardAudio: voiceName,
    
        mainCategory: categoryName,

        subCategory:subCategoryName,
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
    <NativeBaseProvider>
        
        <VStack space={5} alignItems="center" style={styles.container}>
        {!photo && <View style={styles.previewTab}>

        </View>}
        {photo && <Image source={{uri : photo}} alt="Image" style={{width:250,height:250}}/> } 
        
        <Button w={250} colorScheme="blueGray" startIcon={<Icon name="camera" size={18} color="#FFF"/>} onPress={handleChooseImage}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white">Choose फोटो  </Text>
        </Button>
        <Button w={250} colorScheme="blueGray" startIcon={<Icon name="music" size={18} color="#FFF"/>} onPress={() => navigation.navigate('Voice1', {onGoBack : pull_voice})}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white">Choose ऑडिओ  </Text>
        </Button>

        <Button w={250} colorScheme="blueGray" startIcon={<Icon name="music" size={18} color="#FFF"/>} onPress={() => navigation.navigate('Category', {onGoBack : pull_data})}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white">Category  </Text>
        </Button>
   
        <Button w={250} colorScheme="blueGray"  >
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white" onPress={onSubmitData}>सबमिट </Text>
        </Button>
        </VStack>
      
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
    
    container : {
      flex:1,
      alignContent:'center',
      justifyContent:'center'
    },
   previewTab : {
    backgroundColor:"grey",
    width:250,
    height:250
   }
   
  })
export default Create;