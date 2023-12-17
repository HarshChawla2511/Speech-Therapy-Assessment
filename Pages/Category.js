import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { NativeBaseProvider, VStack, Button } from 'native-base';
import { Dropdown } from 'react-native-element-dropdown';
import { LogBox, Alert } from 'react-native';

LogBox.ignoreLogs(['EventEmitter.removeListener']);

function Category(props) {
  const [text, setText] = useState('');
  const [subText, setSubText] = useState('');
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [data, setData] = useState([]);
  const [subData, setSubData] = useState([]);
  const obj = { title: '', subTitle: '' };
  const serverIP = 'http://192.168.197.55:3001/';

  const onTextChange = (txt) => {
    setText(txt);
  };

  const onSubTextChange = (text) => {
    setSubText(text);
  };

  const insertData = () => {
    obj.title = text;
    obj.subTitle = subText;
    Alert.alert(
      'Data Submitted',
      'Categories Added Successfully',
      [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ]
    );
  };

  const getCategoryData = () => {
    fetch(serverIP + 'getCategory')
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  const getSubCategoryData = () => {
    fetch(serverIP + 'getSubData')
      .then((response) => response.json())
      .then((data) => setSubData(data));
  };

  useEffect(() => {
    getCategoryData();
    getSubCategoryData();
  }, []);

  const ontxtChange = (data) => {
    setText(data);
  };

  const onSubTxtChange = (data) => {
    setSubText(data);
  };

  useEffect(() => {
    obj.title = text;
    obj.subTitle = subText;
    props.route.params.onGoBack(obj);
  }, [text, subText]);

  return (
    <NativeBaseProvider>
      <VStack space={3} alignItems="center" style={styles.container}>
        <View>
          <View>
            <TextInput
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                paddingHorizontal: 100,
                marginVertical: 20,
                color: 'black', // Updated text color to black
              }}
              placeholder="Add Category"
              value={text}
              onChangeText={(text) => onTextChange(text)}
              placeholderTextColor={'black'}
            />

            <TextInput
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                color: 'black', // Updated text color to black
                paddingHorizontal: 100,
              }}
              placeholder="Add Sub Category"
              value={subText}
              onChangeText={(text) => onSubTextChange(text)}
              placeholderTextColor={'black'}
            />
          </View>

        </View>
      </VStack>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  containerType: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  button1: {
    margin: 20,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
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
    placeholderTextColor: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});

export default Category;
