import React,{useEffect, useState} from 'react'
import { StyleSheet } from 'react-native';
import { NativeBaseProvider,  VStack,View,Text,Image,FlatList} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts, Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium } from '@expo-google-fonts/poppins';

import {useNavigation} from "@react-navigation/native";
import { LogBox } from 'react-native';
import { Center } from 'native-base';
import { Button } from 'react-native-paper';


LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function ChooseSubDelete() {
  
  const navigation = useNavigation();
  const [data,setData] = useState([]);
  
  const serverIP = "http://192.168.197.55:3001/";
  const getCategoryData = () => {
    // console.log("text= "+JSON.stringify(text));
    fetch(serverIP + 'getCategory')
    .then(response => response.json())
    .then(data => setData(data))
  }
  
  useEffect(() => {
    getCategoryData();
  },[]);
  
  const renderItem = ({item}) =>{
    // console.log("ITEM = ",item);
    return(
      <Button mode='outlined' style={{paddingHorizontal:20,margin:10}} onPress={() => navigation.navigate('DeleteSubCategory',item.label) }>
        {item.label}
      </Button>
    );
  }

  return (
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
      justifyContent:'center'
    },
   previewTab : {
    backgroundColor:"grey",
    width:250,
    height:250
   }
   
  })
export default ChooseSubDelete;