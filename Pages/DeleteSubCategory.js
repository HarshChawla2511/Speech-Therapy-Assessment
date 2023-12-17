import React,{useEffect, useState} from 'react'
import { StyleSheet } from 'react-native';
import { NativeBaseProvider,  VStack,View,Text,FlatList} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFonts, Poppins_600SemiBold,Poppins_400Regular,Poppins_500Medium } from '@expo-google-fonts/poppins';

import { LogBox,Alert } from 'react-native';
import { Center } from 'native-base';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function DeleteSubCategory(props) {
  const navigation = useNavigation();
  const [objData,setobjData] = useState();
  const label = props.route.params;
  console.log("Sub label = ",label);
  const serverIP = "http://192.168.1.5:3001/";
  const data = new FormData();
  data.append("subCategory",label);
  const config = {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
               },
      body: data
     };
  //    console.log("Config",config);
  const getData = () => {
      fetch(serverIP + "getSubCategoryData",config)
      .then(res => res.json())
      .then((data) => {console.log("data recieved  = ",data),setobjData(data)})
      .catch((err) => {console.log(err)});
  }
  useEffect(() => {
      console.log("calling get data");
      getData();
      console.log("Obj data= ",objData);
  },[]);

  const deleteSubCategory = (value) => {
    console.log("In delete sub category subvalue = ",value);
    const tempData = new FormData();
    tempData.append("subValue",value);
    const config = {
      method: 'POST',
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
               },
      body: tempData
     };
    

      Alert.alert(
        "Are you sure?",
        "Confirm if you want to delete",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => {
              fetch(serverIP + "deleteSubCategory",config)
              .then(res => res.json())
              .then((data) => {console.log("data in delete = ",data)})
              .catch((err) => {console.log(err)});
              navigation.navigate('ChooseSubDelete');
          } }
        ]
      );
    // navigation.navigate('Delete');
    
  }
  const renderItem = ({item}) =>{
    // console.log("ITEM = ",item);
    return(
      <Button mode='outlined' style={{paddingHorizontal:20,margin:10}} onPress={() => deleteSubCategory(item.subLabel)}>
        {item.subLabel}
      </Button>
    );
  }

  return (
    <NativeBaseProvider>
        <Center flex={1}>
            {objData && <FlatList data={objData} renderItem={renderItem} keyExtractor={(item) => item.val.toString()} />}
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
export default DeleteSubCategory;