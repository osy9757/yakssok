import React from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet, Image } from "react-native";
import styles from "../../styles";
import { FontAwesome, Ionicons, Fontisto } from "@expo/vector-icons";
import StyledButton from "../../components/StyledButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const SettingScreen = ({route, navigation}) => {
    const {admin, name, gender, user_id, pw, phone, email, birthdate, disease='', has_surgery='', etcInfo='', pharmacy=''} = route.params.userInfo;
    console.log(route.params)
    const logout = () => {
        const removeUser = async() => {
            await AsyncStorage.removeItem('userInfo')
        };
        removeUser();
        navigation.replace('FirstScreen');
    }
    
    const deleteUser = async() => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id:user_id})// 보낼 데이터
        }
        try {
            await fetch('http://localhost:8000/user/api/login', requestOptions) //http://3.38.94.32/user/api/login
                .then(response => {
                    response.json()
                        .then(data => {
                            console.log(data)
                            if(data.status===200) {
                                Alert.alert('회원탈퇴 완료', '탈퇴가 완료되었습니다. 첫 화면으로 이동합니다.')
                            } else {
                                /*
                                회원탈퇴에서 error 발생하는 경우
                                */
                               Alert.alert('Error', '문제가 발생했습니다. 잠시후 다시 시도해주세요.')
                            }
                        });
                })
        } catch(error) {
            console.error(error);
        }
        
        // django연결되면 마지막 then 안으로
        logout()
    }

    return (
        <View style={styles.container}>
            <Text style={styles.inputInfo}>설정</Text>
            <View style={styles.dummyView}/>
            <StyledButton title={'로그아웃'} onPress={() => {
                Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
                        {
                            text: '취소',
                        },
                        {
                            text: '확인',
                            onPress: () => {logout()/* 로그인 세션 해제 */}
                        }
                    ])
                }} />
            <StyledButton title={'회원탈퇴'} onPress={() => {
                Alert.alert('회원탈퇴', '정말 탈퇴하시겠습니까?', [
                        {
                            text: '취소',
                        },
                        {
                            text: '확인',
                            onPress: () => {deleteUser()/* DB에서 해당 ID 회원 제거 */}
                        }
                    ])
                }} />
        </View>
    )
}

const infoStyles = StyleSheet.create({
    infoText: {
        fontSize: 20,
        marginVertical: 6
    }
})

export default SettingScreen;