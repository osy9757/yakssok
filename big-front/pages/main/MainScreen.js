import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, Alert, TouchableOpacity, Image, FlatList, Modal, Pressable, BackHandler, TouchableWithoutFeedback, ScrollView } from "react-native";
import styles from "../../styles";
import * as ImagePicker from "expo-image-picker";
import Loading from "../../components/Loading";

import StyledButton from '../../components/StyledButton';

import { useIsFocused, useRoute } from "@react-navigation/native";

import AsyncStorage from '@react-native-async-storage/async-storage';

import {Animated} from "react-native";
import MainScreenBtn from "../../components/MainScreenBtn";
import { BASE_API_URL, DB_URL_USERPILLJOIN, API_URL_OCR, API_URL_USERPILL, API_URL_PILLNAME, API_URL_PillInFoView_inter_full } from '@env'
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const MainScreen = ({route, navigation}) => { 
    const userInfo = route.params.userInfo
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true)

    // 사용자의 알약 정보 불러옴
    const loadInfoData = async() => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id:userInfo.user_id})
        }
        
        try {
            await fetch(API_URL_PillInFoView_inter_full, requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('HTTP status ' + response.status);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('결과', data);
                    if(data.result && data.result.length > 0) {
                        const finalData = data.result.map(item => {
                            return {
                                name: item.pill_name,
                                info: item.reason,
                                warn: !item.safe_to_take,
                                uri: item.uri,
                                use: item.use,
                                effect: item.effect
                            }
                        })                                    
                        setMainData(finalData)
                        console.log('확인',finalData)
                    } else {
                        setMainData([])
                    }
                    setLoading(false)
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        } catch(error) {
            console.error(error);
            setLoading(false);
        }
    }
    
            

    // 현재 페이지에서 뒤로가기 누르면 앱 종료
    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            const backAction = () => {
                Alert.alert('종료', '정말 종료하시겠습니까?', [
                    {
                    text: '취소',
                    onPress: () => null,
                    style: 'cancel',
                    },
                    {text: '종료', onPress: () => BackHandler.exitApp()},
                ], {cancelable: true});
                return true;
            };
            
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            
            if(!userInfo.admin) {
                loadInfoData();
            }
            return () => backHandler.remove();
        }
      }, [isFocused]);
    
    
    const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
    const [modalVisibleInfo, setModalVisibleInfo] = useState(-1);
    const [modalVisibleWarn, setModalVisibleWarn] = useState(false);
 
    const checkPermission = async() => {
        const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
        setHasGalleryPermission(galleryStatus.status === "granted")

        if (setHasGalleryPermission === false) return <View />
    }
    
    const pickImage = async(model) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [1, 1],
            quality: 1
        });
    
        if (!result.canceled) {
            // API URL 값 설정하기
            let apiUrl = '';
            if (model === 'pill') {
                apiUrl = BASE_API_URL + API_URL_PILLNAME;
            } else if (model === 'ocr') {
                apiUrl = BASE_API_URL + API_URL_OCR;
            }
            
            // PhotoPreview 화면으로 이동하면서 이미지의 URI, 모델, API URL 전달
            navigation.navigate('PhotoPreview', {'user_id':userInfo.user_id, 'image': result.uri, 'model': model, 'apiUrl': apiUrl, 'source': 'gallery', 'pickImage': pickImage});
        }
    }

    const deleteItem = async (itemId) => {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id:userInfo.user_id, item_id:itemId})
        }
        
        try {
            const response = await fetch(API_URL_PillInFoView_inter_full, requestOptions)
            const data = await response.json();
            if(data.result.status === 200) {
                console.log('Item successfully deleted');
            } else {
                console.error('An error occurred while deleting the item');
            }
        } catch(error) {
            console.error(error);
        }
    }
    
    

    const selectAlert = (model) => {
        Alert.alert((model==='ocr'?'처방전':'알약')+' : 촬영 / 갤러리', '사진을 촬영할지 갤러리에서 찾을지 선택해주세요.', [
            {
                text: '촬영',
                onPress: () => {
                    console.log(model, 'camera')
                    navigation.navigate('CameraScreen', {'user_id':userInfo.user_id, 'model': model, 'source': 'camera'})
                }

            },
            {
                text: '갤러리',
                onPress: () => {
                    console.log(model, 'pick');

                    pickImage(model);
                }
            }
        ], {cancelable: true});
    }

    const [mainData, setMainData] = useState([])

    const deleteImage = ([item, index]) => {
        Alert.alert("해당 알약을 삭제하시겠어요?", '>>'+item, [
          {
            style : "cancel",
            text : "아니요",
          },
          {
            text : "네",
            onPress : () => {
                // const newDrugInfo = mainData.filter((drug) => drug !== name); // 해당 이름 전체 삭제
                const newDrugInfo = mainData.filter((drug, idx) => idx !== index)
                console.log('삭제시 > ', newDrugInfo)

                let drugNameList = ''
                for(let d of newDrugInfo){
                    drugNameList = drugNameList + d + '~'
                }
                
                const updateUserPill = async() => {
                    console.log('보내는데이터', JSON.stringify({pill_name:drugNameList, user_id:userInfo.user_id}))
                    const requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({pill_name:drugNameList, user_id:userInfo.user_id})// 보낼 데이터, user_id:user_id
                    }

                    try {
                        await fetch(DB_URL_USERPILLJOIN, requestOptions)
                            .then(response => {
                                response.json()
                                    .then(data => {
                                        console.log('통신', data)
                                        // setSuccess(data.result)
                                        loadInfoData()
                                        // setLoading(false)
                                    });
                            })
                    } catch(error) {
                        console.error(error);
                    }
                }
                setLoading(true)
                setMainData(newDrugInfo)  // 다른 페이지 갔다오면 새로 load 해서 삭제 전으로 돌아감
                setLoading(false)
                // updateUserPill() // request 값으로 바꾸는 게 아니라 추가하는 것..
            }
          }
        ],) 
      }
    
    const Item = ({item, index, onLongPress}) => {
        // 버튼 애니메이션
        const animValue = useRef(new Animated.Value(0)).current

        const onPressIn = useCallback(()=>{
            Animated.timing(animValue, {
                duration: 100,
                toValue: 1,
                useNativeDriver:false ,
            }).start()
        })

        const onPressOut = useCallback(()=>{
            Animated.timing(animValue, {
                duration: 200,
                toValue: 0,
                useNativeDriver:false,
            }).start()
        })

        const scale = animValue.interpolate({
            inputRange:[0, 1],
            outputRange:[1.0, 0.8]
        })
        
        return (
            <Pressable onLongPress={onLongPress} style={{flexDirection:'row', backgroundColor:(item.warn?'#f25555':'#f5f7ff'), borderRadius:10, paddingHorizontal:10, paddingVertical:6, marginVertical:6, alignItems:"center", elevation:2}}>
                <View style={{flexDirection:'row', flex:3, alignItems:'center'}}>
                    <Image source={{uri:item.uri}} style={{width:50, height:50, resizeMode:'contain'}}/>
                    <View style={{marginLeft: 10, flex:1}}>
                        <Text key={item+'_name'} style={{fontSize:16, color:item.warn?'white':'black'}} numberOfLines={1}>{item.name}</Text>
                        <Text key={item+'_info'} style={{fontSize:14, color:item.warn?'white':'black'}} numberOfLines={1}>{item.effect}</Text>
                    </View>
                </View>
                <Animated.View style={{transform:[{scale:scale}]}}>
                    <TouchableOpacity style={{paddingVertical:6, 
                                                paddingHorizontal:14, 
                                                borderRadius:6, 
                                                backgroundColor:item.warn?'white':'#5471ff',
                                                opacity:item.warn?0.8:1,
                                                }} 
                                    onPress={()=>{setModalVisibleInfo(index)}}
                                    onPressIn={onPressIn}
                                    onPressOut={onPressOut}
                                    >
                        <Text style={{color:item.warn?'black':'white'}}>자세히</Text>
                    </TouchableOpacity>
                </Animated.View>
                <Modal animationType='fade'
                    transparent={true}
                    visible={modalVisibleInfo===index}
                    onRequestClose={()=>{setModalVisibleInfo(-1)}}>
                    <Pressable style={{flex:1, justifyContent:'center', alignItems:'center'}} onPress={()=>{setModalVisibleInfo(-1)}}>
                        <View style={{backgroundColor:'white', opacity:0.4, position:'absolute', width:'100%', height:'100%'}}/>
                        <View style={{backgroundColor:'white', alignItems:'center', justifyContent:'center',
                                    shadowColor:'black', shadowOffset:{width:0, height:2},
                                    shadowOpacity: 0.2, shadowRadius:4, elevation:5, borderRadius:6,
                                    width:'80%', maxHeight:'60%'}}>
                            <Image source={{uri:item.uri}} style={{minHeight:'30%', width:'100%', margin:10, resizeMode:'contain'}}/>
                            
                            <View style={{backgroundColor:'white', width:'100%', paddingTop:0, padding:20, maxHeight:'70%', borderRadius:6}}>
                                <Text style={{fontSize:18, fontWeight:'bold', marginBottom:10}}>{item.name}</Text>
                                <ScrollView>
                                    <View onStartShouldSetResponder={() => true}>
                                        {item.warn?<View>
                                                        <Text style={{fontWeight:'bold'}}>복용금기</Text>
                                                        <Text>{item.info.join('\n')}</Text>
                                                    </View>:null}
                                        <View style={{marginVertical:10}}>
                                            <Text style={{fontWeight:'bold'}}>효능</Text>
                                            <Text>{item.effect}</Text>
                                        </View>
                                        <View>
                                            <Text style={{fontWeight:'bold'}}>복용법</Text>
                                            <Text>{item.use}</Text>
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            </Pressable> 
        )
    };
    const renderItem = ({item, index}) => {
        // no로 각각 데이터 구분, 삭제 시 중복되는 이름이나 사진 있어도 상관없게
        const onLongPress = () => deleteImage([item, index]);
        return (
            <Item item={item} index={index} onLongPress={onLongPress}/>
        )
    }


    checkPermission();
    
    
    const printGeneral = () => {
        return (
            <View style={{flex: 1,
                        backgroundColor: '#f5f7ff',
                        alignItems: 'stretch',
                        justifyContent: 'space-between',
                        padding: '4%'}}>
                <View style={{backgroundColor:'white', padding:14, borderRadius: 6, elevation:2}}>
                    <Text style={{fontWeight:'bold', fontSize:24}}>{userInfo.name}님 {'\n'}무엇을 도와드릴까요?</Text>
                    <View style={{flexDirection:'row', paddingTop:20, justifyContent:'space-around'}}>
                        <MainScreenBtn model={'ocr'} onPress={() => selectAlert('ocr')}/>
                        <MainScreenBtn model={'pill'} onPress={() => selectAlert('pill')}/>
                    </View>
                </View>
                <View style={{flex:1, padding:14, backgroundColor:'white', borderRadius:6, elevation:2, marginTop:20, height:'100%'}}>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom:20}}>
                        <View>
                            <Text style={{fontWeight:'bold', fontSize:22}}><Text style={{color:'#5471ff'}}>{mainData.length?mainData.length:0}개의</Text> 약을 등록하셨습니다</Text>
                            <Text style={{fontWeight:'bold', fontSize:22}}><Text style={{color:'#f25555'}}>{(()=>{
                                        let count = 0;
                                        // console.log(mainData)
                                        for(d of mainData) {
                                            if(d.warn) {count++}
                                        }
                                        return count
                                    })()}개의</Text> 약물이 충돌합니다</Text>
                        </View>
                        <View>
                            {/* <Text>여기 편집 버튼 만들어서 한 번에 여러 개 삭제할 수 있게?</Text> */}
                        </View>
                    </View>
                    <View style={{flex:1, flexGrow:1}}>
                        <Loading show={loading}/>
                        {mainData.length>0?
                        <FlatList windowSize={2}
                                contentContainerStyle={{flexGrow:1}} 
                                data={mainData} 
                                renderItem={renderItem} 
                                keyExtractor={(item, index)=>index.toString()}/>
                        :<Text>아직 등록된 알약이 없습니다.</Text>}
                    </View>
                </View>
            </View>
        )
    }



    //////////////////////////////////////////// 여기부터 약사
    const [record, setRecord] = useState(
        {
            count: 5,
            set: ['알약A, 알약B', '알약A, 알약D', '알약B, 알약C', '알약E, 알약F', '알약A, 알약F']
        }
    )
    useEffect(() => {
        if(userInfo.admin) {
            // 기록 받아오기
            const loadRecordData = async() => {
                fetch('django링크')  // detection_record
                    .then(response => response.json())
                    .then(data => {
                            setRecord(data);
                        })
                .catch(error => {
                    console.log(error);
                });
            }
            loadRecordData();
            setLoading(false)
        }
    }, [])

    const printAdmin = () => {
        return (
            <View style={{flex: 1,
                        backgroundColor: '#f5f7ff',
                        alignItems: 'stretch',
                        justifyContent: 'space-between',
                        padding: '4%'}}>
                <View style={{backgroundColor:'white', padding:14, borderRadius: 6, elevation:2}}>
                    <Text style={{fontWeight:'bold', fontSize:24, marginBottom:6}}>{userInfo.name}님 안녕하세요.</Text>
                    <Text>1:1 상담 혹은 Q&A로 이동해 복약 지도가 필요한 분들을 도와주세요.</Text>
                    {/* <View style={{flexDirection:'row', paddingTop:20, justifyContent:'space-around'}}>
                    <MainScreenBtn />
                    </View> */}
                </View>
                <View style={{paddingTop:20, backgroundColor:'white', borderRadius:6, elevation:2, padding:16, marginTop:20, flex:1}}>
                    <View style={{marginBottom:10}}>
                        <Text style={{fontSize:18, fontWeight:'bold'}}>상담 목록</Text>
                    </View>
                    <View>
                        <Text>아직 들어온 상담 요청이 없습니다. {'\n'}상담 요청이 들어오면 이 곳에 표시됩니다.</Text>
                        <FlatList/>
                    </View>
                </View>
                <Loading show={loading}/>
            </View>
        )
    }

    // printAdmin 수정해서 바꾸기
    return (
        userInfo.admin?printAdmin():printGeneral()
    )
}

export default MainScreen;