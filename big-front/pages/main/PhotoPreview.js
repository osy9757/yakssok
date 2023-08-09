import React, { useEffect, useState } from "react";
import { View, Image, Button, ActivityIndicator, Alert, Pressable } from 'react-native';
import StyledButton from "../../components/StyledButton";
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { BASE_API_URL, API_URL_PILL, API_URL_OCR } from '@env'
import { useIsFocused } from "@react-navigation/native";
import { BackHandler } from "react-native";
import Loading from "../../components/Loading";

import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const PhotoPreview = ({route, navigation}) => {
    console.disableYellowBox = true;
    const { image, model, apiUrl, source, pickImage, user_id } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused()
    console.log(user_id)
    useEffect(()=>{
      if(isFocused)
        setIsLoading(false)
    }, [])

  useEffect(()=>{
      if(isLoading) {
          const backAction = () => {
              return true;
          };
          const backHandler = BackHandler.addEventListener(
              'hardwareBackPress',
              backAction,
          );
          
          return () => backHandler.remove();
      }
  }, [isLoading])

  useEffect(()=>{
      if(isFocused) {
          navigation.getParent().setOptions({tabBarStyle: {display:'none'}});
          navigation.getParent().getParent().setOptions({headerShown:false})
      }
      else{
          navigation.getParent().setOptions({tabBarStyle: {display:'flex'}});
          navigation.getParent().getParent().setOptions({headerShown:true})
      }
  }, [isFocused, isLoading])

  useEffect(()=>{
      if(isFocused) {
          navigation.getParent().setOptions({tabBarStyle: {display:'none'}});
          navigation.getParent().getParent().setOptions({headerShown:false})
      }
      else{
          navigation.getParent().setOptions({tabBarStyle: {display:'flex'}});
          navigation.getParent().getParent().setOptions({headerShown:true})
      }
  }, [])

  useEffect(()=>{
      const backAction = () => {
          Alert.alert('취소', '사진 촬영을 취소하시겠습니까?', [
              {
              text: '아니오',
              onPress: () => null,
              style: 'cancel',
              },
              {text: '네', onPress: () => navigation.navigate('MainScreen')},
          ], {cancelable: true});
          return true;
      };
      
      const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
      );
      
      return () => backHandler.remove();
  }, [isFocused])


    console.log(apiUrl)
    // 이미지 업로드 함수
    const uploadImage = async () => {
      setIsLoading(true);
      try {
        const imageData = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });

        let response = await axios.post(apiUrl, {
          pill_image: imageData,
        });

        if (response.status == 200) {
          console.log('이미지 업로드 성공');
          console.log('응답 데이터:', response.data);
          if(response.data.results=='처방전 사진을 제대로 인식하지 못했습니다.') {
            Alert.alert('오류', '처방전 사진을 제대로 인식하지 못했습니다. 다시 촬영해주세요.')
          } else if (response.data.pill_img_info.length===0) {
            Alert.alert('오류', '인식된 알약이 없습니다. 다시 촬영해주세요.')
          } else {
            // 조건에 따라 다른 화면으로 이동
            if (model === 'pill') {
              navigation.navigate('DrugScreen', { user_id:user_id, responseData: response.data, source: source, pickImage:pickImage });
            } else if (model === 'ocr') {
              navigation.navigate('PrescriptionScreen', { user_id:user_id, responseData: response.data, source: source, image: image, pickImage:pickImage });
            }
          }
        } else {
          console.log('이미지 업로드 실패');
          console.log('응답 코드:', response.status);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <View style={{flex:1}}>
          <View style={{backgroundColor:'black'}}>
            <Image source={{uri: image}} style={{width:'100%', height:'100%', resizeMode:'contain'}}/>
          </View>
          <View style={{flexDirection:'row', 
                        justifyContent:'space-between', 
                        alignItems:"center",
                        height:'12%', 
                        bottom:0, 
                        width:'100%',
                        position:'absolute',
                        backgroundColor:'white', 
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20,
                        paddingHorizontal:20,}}>
            <StyledButton 
              title={source==='gallery'?'재선택':'재촬영'} 
              withBtn={true}
              onPress={()=> {
                if(source === 'gallery') {
                  pickImage(model);  // 같은 model로 다시 이미지 선택
                } else {
                  navigation.replace('CameraScreen', {model:model})
                }
              }}
              isCancle={true}
            />
            <StyledButton title='확인' onPress={uploadImage} withBtn={true}/> 
          </View>
          <Loading show={isLoading}/>
      </View>
  );
  
};

export default PhotoPreview;