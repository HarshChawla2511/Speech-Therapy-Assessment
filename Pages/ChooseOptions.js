

import React, {useEffect, useState} from 'react';
import { LogBox } from "react-native";
import {Image, FlatList} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

import * as ImagePicker from "react-native-image-picker";
var RNFS = require('react-native-fs');
import { View } from 'native-base';
import { useFonts, Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium } from '@expo-google-fonts/poppins';


import {
  
  StyleSheet,

} from 'react-native';

import { NativeBaseProvider,  VStack} from "native-base";


import {useNavigation} from "@react-navigation/native";

// import { Button } from "native-base";
import { Center } from 'native-base';
import { Button,Text } from 'native-base';
// import { Button } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';



function ChooseOptions(props){
    
    const navigation = useNavigation();
    const category = props.route.params[0];
    const subCategory = props.route.params[1];
    console.log("Category = " + category + " sub category = "+subCategory);
    var tempData = "";
    const [photo,setPhoto] = useState(null);
    
    const [isImage,isSetImage] = useState(false);
    const [isVoice,isSetVoice] = useState(false);
    
    const [photoName,setPhotoName] = useState("");
    const [voiceName,setVoiceName] = useState("");
    
    const serverIP = "http://192.168.197.55:3001/";
    // const data = new FormData();
    // data.append("category",category);
    // data.append("subCategory",subCategory);
    // const config = {
    //     method: 'POST',
    //     headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'multipart/form-data',
    //              },
    //     body: data
    //    };

    // const getData = () => {
    //     fetch(serverIP + "getImageAudio",config)
    //     .then(res => res.json())
    //     .then((data) => {console.log("DATA = ",data)})
    //     .catch((err) => {console.log(err)});
    // }

    // useEffect(() => {
    //     getData();
    //     // console.log("Obj data= ",objData[0].imageURL);
    // },[]);

    let [fontsLoaded] = useFonts({
      Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium
    });

    const handleUploadImage = (response) => {
        const data = new FormData();
       
        data.append("file", 'data:image/jpg;base64,' + response.assets[0].base64);
        data.append("cloud_name", "bhavesh07");
        data.append("upload_preset", "fluencyApp");
                
       
     fetch("https://api.cloudinary.com/v1_1/bhavesh07/image/upload",{
      method : "post",
      body: data,
     }).then(res => res.json())
       .then(data => {
             setPhotoName(data.url);
             isSetImage(true);
          }).catch((err) => {
              console.log(err)
          })
    }

    const handleChooseImage = () => {
        const options = {
            mediaTypes: 'Images',
            quality: 0.1,
            includeBase64: true
            };
          ImagePicker.launchImageLibrary(options,(response) => {
            if(response.didCancel !== true)
            { 
                if (response.didCancel !== true) {
                    setPhoto(response.assets[0].uri);
             
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
        tempData = await RNFS.readFile(data.toString(),'base64'); // r is the path to the .wav file on the phone
        const fd = new FormData();
            fd.append("file","data:audio/mpeg;base64,"+tempData);
            fd.append("upload_preset", "fluencyApp");
            fd.append("cloud_name","bhavesh07");
            fd.append("resource_type", "video");
    
            fetch('https://api.cloudinary.com/v1_1/bhavesh07/auto/upload', {
            method: 'POST',
            body: fd
            }).then(res => res.json())
            .then(data => {
                setVoiceName(data.url);
                isSetVoice(true);
            }).catch((err) => {
                console.log(err)
            })
    }

    const onSubmitData = () => {
        console.log("Submit button pressed");
        const fd = new FormData();
        fd.append("category",category);
        fd.append("subCategory",subCategory);
        if(isImage)
        {
            console.log("In image response");
            console.log("Image url = ",photoName);
            fd.append("imageURL",photoName);
        }        
        if(isVoice)
        {
            console.log("in voice response");
            console.log("Voice URL = ",voiceName);            
            fd.append("audioURL",voiceName);              
        }
        
        const config = {
                method: 'POST',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
                         },
                body: fd
               };
        
               
        fetch(serverIP + "updateData",config)
        .then(res => res.json())
        .then((data) => {console.log("DATA = ",data)})
        .catch((err) => {console.log(err)});
        
          
      }
    
  
   
  LogBox.ignoreLogs(["EventEmitter.removeListener"]);
  return(
    
    <NativeBaseProvider>      
        <VStack space={5} alignItems="center" style={styles.container}>
        {!photo && <View style={styles.previewTab}>

        </View>}
        {photo && <Image source={{uri : photo}} alt="Image" style={{width:250,height:250}}/> } 
        
        <Button w={250} colorScheme="blueGray" startIcon={<Icon name="camera" size={18} color="#FFF"/>} onPress={handleChooseImage}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white"> Choose फोटो  </Text>
        </Button>
        <Button w={250} colorScheme="blueGray" startIcon={<Icon name="music" size={18} color="#FFF"/>} onPress={() => navigation.navigate('Voice1', {onGoBack : pull_voice})}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white"> Choose ऑडिओ  </Text>
        </Button>
   
        <Button w={250} colorScheme="blueGray"  >
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12}}  color="white" onPress={onSubmitData}>सबमिट  </Text>
        </Button>

        </VStack>
      
     </NativeBaseProvider>
  
  )
}

const styles = StyleSheet.create({
  container : {
    flex:1,
    alignContent:'center',
    justifyContent:'center',
  },
  playPause : {
  
  },button : {

    paddingHorizontal:15,
  }
 
 
})
export default ChooseOptions;