import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import StyledInput from "../../components/StyledInput";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import ProgressBar from "../../components/ProgressBar";

const EmailInput = ({route, navigation}) => {
    const {admin, name, gender, birthdate, user_id, pw, phone} = route.params.userInfo;
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(true);

    const onChangeText = (email) => {
        const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
        setDisabled(!regex.test(email));
        setEmail(email);
    }
    
    return (
        <View style={styles.container}>
            <ProgressBar admin={admin} currentStep={4}/>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>이메일을 입력해주세요</Text>
                <Text>xxx@xxx.xxx</Text>
            </View>
            <View style={styles.inputContainer}>
                <StyledInput value={email} onChangeText={onChangeText} placeholder='Email' borderBottomColor={disabled} inputMode='email'/>
                <Text style={styles.regexText}>{email===''?'Input your email':disabled ? '유효한 이메일 형식이 아닙니다.' : ''}</Text>
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate(admin?'PharmacyInput':'DiseaseInput', { 
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            'gender':gender,
                            'birthdate':birthdate,
                            'user_id':user_id, 
                            'pw':pw, 
                            'phone':phone,
                            email}})} 
                    title='다음' 
                    disabled={disabled} />
            </View>
        </View>
    )
}

export default EmailInput;