import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import StyledInput from "../../components/StyledInput";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import ProgressBar from "../../components/ProgressBar";

const PhoneInput = ({route, navigation}) => {
    const {admin, name, gender, birthdate, user_id, pw} = route.params.userInfo;
    const [phone, setPhone] = useState('');
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        const regex = /^\d{3}-\d{4}-\d{4}$/;
        setDisabled(!regex.test(phone))
    }, [phone])

    const onChangeText = (text) => {
        let phNum = text;
        if (phNum.length > 3 && phNum.length < 9) {
            setPhone(phNum.replace(/(\d{3})(\d)/, "$1-$2"));
            return
        }
        if (phNum.length === 10) {
            setPhone(phNum.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"));
            return;
        }
        if (phNum.length === 13) {
            setPhone(phNum.replace(/-/g, "") .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3"));
            return;
        }
        return setPhone(phNum);
    }

    return (
        <View style={styles.container}>
            <ProgressBar admin={admin} currentStep={3}/>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>전화번호를 입력해주세요.</Text>
                <Text>xxx-xxxx-xxxx ( - 포함 13자)</Text>
            </View>
            <View style={styles.inputContainer}>
                <View style={{flexDirection:'row'}}>
                    <StyledInput value={phone} onChangeText={onChangeText} placeholder='Phone' inputMode="numeric" borderBottomColor={disabled} maxLength={13} flex={4}/>
                    <StyledButton title='인증' flex={1}/>
                </View>
                <Text style={styles.regexText}>{disabled ? 'Input your phone number' : ''}</Text>
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate('EmailInput', { 
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            'gender':gender,
                            'birthdate':birthdate,
                            'user_id':user_id, 
                            'pw':pw, 
                            phone}})} 
                    title='다음' 
                    disabled={disabled}/>
            </View>
        </View>
    )
}

export default PhoneInput;