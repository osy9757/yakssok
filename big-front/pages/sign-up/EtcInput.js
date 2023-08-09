import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import { AntDesign } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL_JOIN } from '@env'

const EtcInput = ({route, navigation}) => {
    const {admin, name, gender, user_id, pw, phone, email, birthdate, disease, has_surgery} = route.params.userInfo;
    const [user_specialnote, setUserSpecialnote] = useState(['없음']);
    const [etcLen, setEtcLen] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(()=>{
        if(success&&!loading) {
            navigation.navigate('BottomTabNavigation');
        }
    }, [success, loading])
    
    const selectEtc = (value) => {
        const idx = user_specialnote.indexOf(value)
        const newData = user_specialnote;
        if(newData.indexOf('없음')!==-1) {
            newData.pop();
        }

        if(idx===-1) {
            newData.push(value);
            setUserSpecialnote(newData)
            setEtcLen(user_specialnote.length)
        } else {
            newData.splice(idx, 1);
            setUserSpecialnote(newData)
            setEtcLen(user_specialnote.length)
        }
        if(newData.length===0) {
            newData.push('없음')
        }
        printEtc();
    }

    useEffect(() => {
        printEtc();
    }, [etcLen])

    const printEtc = () => {
        let array = [];
        const list = ['임신', '흡연', '음주'];
        for(let val of list) {
            if (val==='임신'&&gender==='M') {
                continue
            }
            array.push(
                <TouchableOpacity key={val} style={user_specialnote.indexOf(val)===-1?selectStyles.btn:selectStyles.btn2} onPress={() => selectEtc(val)}>
                    <Text key={val} style={user_specialnote.indexOf(val)===-1?selectStyles.btnText:selectStyles.btnText2}>{val}</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
            )
        }
        return array;
    }

    const signIn = async () => {
        setLoading(true)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({admin, name, gender, user_id, pw, phone, birthdate, disease, has_surgery, user_specialnote: user_specialnote.join(", ")})// 보낼 데이터
        }
        console.log(requestOptions.body)
        try {
            // await fetch('http://3.38.94.32/user/api/join', requestOptions) //django 링크
            await fetch(API_URL_JOIN, requestOptions) //django 링크

                .then(response => {
                    response.json()
                        .then(data => {
                            console.log('성공! ', data);
                            loginSession()
                                
                            setLoading(false)
                            setSuccess(true)
                        });
                        //, {userInfo:{admin, name, gender, user_id, pw, phone, birthdate, disease, has_surgery, etcInfo:etcInfo}}
                })
        } catch(error) {
            console.error('실패! ', error);
        }
    };

    const loginSession = async() => {
        await AsyncStorage.setItem('userInfo', JSON.stringify(route.params.userInfo))

    }
    
    return (
        <View style={styles.container}>
            <View style={{height:60}}>
                <ProgressBar progress={1} theme={{colors:{primary:'#5471FF'}}}/>
            </View>   
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>해당 사항을 체크해 주세요.</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputTitle}>특이사항</Text>

                <TouchableOpacity style={user_specialnote.indexOf('없음')===-1?selectStyles.btn:selectStyles.btn2} onPress={() => setUserSpecialnote(['없음'])}>
                    <Text style={user_specialnote.indexOf('없음')===-1?selectStyles.btnText:selectStyles.btnText2}>없음</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
                {(() => (printEtc()))()}
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => { signIn() /*
                        navigation.navigate('BottomTabNavigation', { 
                            userInfo:{
                                'admin':admin, 
                                'name':name,
                                'gender':gender,
                                'user_id':user_id, 
                                'pw':pw, 
                                'phone':phone,
                                'email':email,
                                'birthdate':birthdate,
                                'disease':disease,
                                'has_surgery':has_surgery,
                                user_specialnote}}) */
                            }}
                    title='완료' />
                <Text style={styles.link} onPress={()=>navigation.pop()}>이전화면</Text>
            </View>
        </View>
    )
}

const selectStyles = StyleSheet.create({
    btn: {
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 6,
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginVertical: 10,
        justifyContent: 'space-between',
        borderColor: '#5471ff',
        alignItems:'center'
    },
    btn2: {
        borderWidth: 1,
        borderColor: '#5471ff',
        backgroundColor: '#5471ff',
        borderRadius: 6,
        flexDirection: 'row',
        paddingVertical: 14,
        paddingHorizontal: 10,
        marginVertical: 10,
        justifyContent: 'space-between',
        alignItems:'center'
    },
    btnText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#5D5F64',
        paddingHorizontal: 10
    },
    btnText2: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
        paddingHorizontal: 10,
    },
});
export default EtcInput;
