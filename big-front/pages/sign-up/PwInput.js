import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import StyledInput from "../../components/StyledInput";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import ProgressBar from "../../components/ProgressBar";

const PwInput = ({route, navigation}) => {
    const [pw, setPw] = useState('');
    const [pwChk, setPwChk] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [condition, setCondition] = useState(true);
    const {admin, name, gender, user_id} = route.params.userInfo;

    useEffect(() => {
        const regex = /^[0-9a-zA-Z#?!@$%^&*-]*$/
        const reChk = regex.test(pw);
        if(!reChk) {
            setCondition(reChk);
            return
        }

        if(pw!==pwChk) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }

        if(pw.length<8) {
            setDisabled(true)
        }

    }, [pw, pwChk])

    useEffect(() => {
        if(!condition) {
            setDisabled(true)
        }
    }, [condition])
    
    return (
        <View style={styles.container}>
            <ProgressBar admin={admin} currentStep={4}/>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>Password를 입력해주세요</Text>
                <Text>최소 8자, 최대 20자</Text>
                <Text>영문/숫자/특수문자(#?!@$%^&*-) 조합 가능</Text>
            </View>
            <View style={styles.inputContainer}>
                <StyledInput value={pw} onChangeText={setPw} placeholder='Password' secureTextEntry={true} maxLength={20}/>
                <StyledInput value={pwChk} onChangeText={setPwChk} placeholder='Password Check' secureTextEntry={true} borderBottomColor={disabled} maxLength={20}/>
                <Text style={styles.regexText}>{pw.length<8?'Pw는 최소 8자 이상입니다.':condition?disabled?'비밀번호와 비밀번호 확인이 일치하지 않습니다.':'':'입력 불가능한 문자가 포함되어있습니다.'}</Text>
            </View>
            <View style={styles.dummyView} />
            <StyledButton
                onPress={() =>
                    navigation.navigate('PhoneInput', {
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            'gender':gender,
                            'user_id':user_id,
                            pw}})} 
                title='다음' 
                disabled={disabled}/>
        </View>
    )
}

export default PwInput;