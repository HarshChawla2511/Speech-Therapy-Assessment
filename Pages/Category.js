import React,{useEffect, useState} from 'react'
import { StyleSheet,TextInput,TouchableHighlight,Text,View} from 'react-native';
import { NativeBaseProvider,  VStack,Icon, addTextAndPropsToStrings} from "native-base";
import { Dropdown } from 'react-native-element-dropdown';
import { Button } from 'react-native-paper';
import {LogBox,Alert} from "react-native";


// import axios from "axios" ;
LogBox.ignoreLogs(["EventEmitter.removeListener"]);
function Category(props) {
  
  const [text,setText] = useState("");
  const [subText,setSubText] = useState("");
  const [value, setValue] = useState(null);
  const [value1,setValue1] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [data,setData] = useState([]); 
  const [subData,setSubData] = useState([]); 
  const obj = {title : "",subTitle : ""};
  const serverIP = "http://192.168.197.55:3001/";
  const onTextChange = (txt) => {
    setText(txt);
  }
  const onSubTextChange = (text) => {
    setSubText(text);
  }
  const insertData = () => {
    obj.title=text;
    obj.subTitle=subText;
    Alert.alert(
      "Data Submitted",
      "Categories Added Successfully",
      [
        {
          text: "Ok",
          style: "cancel"
        },                     
      ]
    );
  //   console.log("text= "+JSON.stringify(text));
  //   fetch(serverIP+'insert',{
  //     method:'POST',
  //       body:JSON.stringify({
  //         title:text,
  //         subTitle:subText
  //       }),
  //       mode: 'no-cors',
  //       headers: {
  //         "Content-type": "application/json; charset=UTF-8"
  //     } 
  //   })
  //   .then(response => response.json())
  //   .then(() => getData());
  }

  const getCategoryData = () => {
    console.log("text= "+JSON.stringify(text));
    fetch(serverIP + 'getCategory')
    .then(response => response.json())
    .then(data => setData(data))
  }
  
  const getSubCategoryData = () => {
    fetch(serverIP + 'getSubData')
    .then(response => response.json())
    .then(data => setSubData(data));
  }
  
  useEffect(() => {
    getCategoryData();
    getSubCategoryData();
  },[]);


  const ontxtChange = (data) => {
    // props.route.params.onGoBack(data);
     setText(data);
  }
  const onSubTxtChange = (data) => {
    setSubText(data);
  }

  useEffect(() => {
    obj.title = text;
    obj.subTitle = subText;
    props.route.params.onGoBack(obj);
  },[text,subText]);

  console.log("DATA = ",data);
  
  return (
    <NativeBaseProvider>
         <VStack space={3} alignItems="center" style={styles.container}>
        <View >
            <View >
            <TextInput
                style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',paddingHorizontal: 100,marginVertical:20,}} 
                placeholder = 'Add Category'
                value={text}
                onChangeText={(text) => onTextChange(text)}
                placeholderTextColor={'black'}
              />
            
             <TextInput
                style={{alignItems:'center',justifyContent:'center',backgroundColor:'white',color:'black',paddingHorizontal: 100}} 
                placeholder = 'Add Sub Category'
                value={subText}
                onChangeText={(text) => onSubTextChange(text)}
                placeholderTextColor={'black'}
              />
            </View>
            <View style={styles.button1}>
              <Button
                mode="outlined"
                icon="plus-circle"
                onPress={insertData}>
                Add Records
              </Button>
            </View>
            <View style={{flexDirection:'row'}}>

              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue'},styles.containerType]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField="label"
                valueField="val"
                placeholder={!isFocus ? 'Category' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                ontxtChange(item.label);
                setValue(item.label);
                setIsFocus(false);
                    }}       
                />
                
            </View>
            <View style={{flexDirection:'row', marginTop:10}}> 
                <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' },styles.containerType]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={subData}
                search
                maxHeight={300}
                labelField="subLabel"
                valueField="val"
                placeholder={!isFocus ? 'Sub Category' : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                onSubTxtChange(item.subLabel);
                setValue(item.subLabel);
                setIsFocus(false);
                
                    }}       
                />
                </View>
           
        </View>
        </VStack>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
    
    container : {
      // paddingVertical:100,
      // marginHorizontal:15,
      flex:1,
      alignContent:'center',
      justifyContent:'center',
    },
    containerType : {
        flex:1,
        alignContent:'center',
        justifyContent:'center'
    },
   button : {
      marginTop:100,
   },button1 : {
      margin: 20,
   }
   ,dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    placeholderTextColor:'black'
  },
  selectedTextStyle: {
    fontSize: 16,
    color:'black'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color:'black'
  },
})
export default Category;