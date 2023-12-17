

import React, {useEffect, useState} from 'react';
import { LogBox } from "react-native";
import {Image, FlatList} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Video from 'react-native-video';
import Controls from './Controls';
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



function Display(props){
    
    const category = props.route.params[0];
    const subCategory = props.route.params[1];
    const [imageURL,setImageURL] = useState();
    const [audioURL,setAudioURL] = useState();
    const [objData,setObjData] = useState();
    const serverIP = "http://192.168.1.5:3001/";
    const data = new FormData();
    data.append("category",category);
    data.append("subCategory",subCategory);
    const config = {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
                 },
        body: data
       };
    // //    console.log("Config",config);
    const getData = () => {
        fetch(serverIP + "getImageAudio",config)
        .then(res => res.json())
        .then((data) => {console.log("DATA = ",data),setImageURL(data[0].imageURL),setAudioURL(data[0].audioURL)})
        .catch((err) => {console.log(err)});
    }
    useEffect(() => {
        getData();
        // console.log("Obj data= ",objData[0].imageURL);
    },[]);
    let [fontsLoaded] = useFonts({
      Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium
    });
    console.log("IMage url = ",imageURL);
    console.log("Audio url = ",audioURL);
   
    const [pause,setPause] = useState(false);
    function togglePlayPause(){
      setPause(!pause);
    }
    console.log("Pause = ",pause);
   
  LogBox.ignoreLogs(["EventEmitter.removeListener"]);
  return(
    
    <NativeBaseProvider>      
        <Center flex={1}>
            <Image source={{uri : imageURL}} alt="Image" style={{width:250,height:250,marginBottom:20}}/>

            
            <View style={styles.playPause}>
            {pause ? <Button onPress={togglePlayPause} w={250} style={styles.button} startIcon={<Icon name="play-circle" size={30} color="#FFF"/>}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14}}  color="white"> Play </Text>
            </Button> : 
             <Button onPress={togglePlayPause} w={250} startIcon={<Icon name="pause-circle" size={30} color="#FFF"/>}>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14}}  color="white">Pause</Text>
              </Button>}
            <Video source={{uri : audioURL}} audioOnly paused={pause}/>
            </View>
        </Center>
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
export default Display;