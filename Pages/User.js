

import React, {useEffect, useState} from 'react';
import { LogBox } from "react-native";
import {Image, FlatList,Text} from "native-base";
import { useFonts, Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium } from '@expo-google-fonts/poppins';


import {
  
  StyleSheet,

} from 'react-native';

import { NativeBaseProvider,  VStack} from "native-base";


import {useNavigation} from "@react-navigation/native";


// import { Button } from "native-base";
import { Center } from 'native-base';
import { Button } from 'react-native-paper';


function User(){
    const navigation = useNavigation();
    let [fontsLoaded] = useFonts({
      Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium
    });
    const [data,setData] = useState([]);
    var [imageURL,setURL] = useState("");
    const serverIP = "http://192.168.197.55:3001/";
    const getData = async() => {
       
        fetch(serverIP + 'getCategory')
        .then(response => response.json())
        .then(results => {console.log("results = ",results); setData(results); setURL(results[0].imageURL)});
        // imageURL = await data[0].imageURL;
    }
    useEffect(() => {
        getData();
    },[])
   
    
    // console.log("data = ",imageURL);
    const renderItem = ({item}) =>{
      // console.log("ITEM = ",item);
      return(
        <Button mode='outlined' style={{paddingHorizontal:20,margin:10}} onPress={() => navigation.navigate('SubCategory',item.label) }>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14}}  color="black"> {item.label} </Text>
        </Button>
      );
    }
  LogBox.ignoreLogs(["EventEmitter.removeListener"]);
  return(
    <NativeBaseProvider>
      
      <Center flex={1}>
        {data && <FlatList data={data} renderItem={renderItem} keyExtractor={(item) => item.val.toString()} />}
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
 
 
})
export default User;