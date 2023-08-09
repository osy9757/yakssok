import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import StyledInput from "../../components/StyledInput";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import DateTimePicker from '@react-native-community/datetimepicker';
import ProgressBar from "../../components/ProgressBar";

const BirthInput = ({route, navigation}) => {
    const {admin, name, gender, user_id, pw, phone, email} = route.params.userInfo;
    const [birthdate, setBirth] = useState(new Date());
    const [disabled, setDisabled] = useState(true);
    const [show, setShow] = useState(false);
    
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setBirth(currentDate);
        setDisabled(false);
    }

    return (
        <View style={styles.container}>
            <ProgressBar admin={admin} currentStep={7}/>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>생년월일을 입력해주세요</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={{fontSize:20, marginTop:20, marginBottom:12}}>선택된 날짜 : {birthdate.toLocaleDateString()}</Text>
                <StyledButton title='날짜 선택' onPress={()=>setShow(true)}/>
                {show&&(<DateTimePicker value={birthdate} onChange={onChange} maximumDate={new Date()} mode='date' display="spinner"/>)}
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => (
                        navigation.navigate(admin?'PharmacyInput':'DiseaseInput', { 
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            'gender':gender,
                            'user_id':user_id, 
                            'pw':pw, 
                            'phone':phone,
                            'email':email,
                            'birthdate':birthdate.toLocaleDateString()}}))} 
                    title='다음' 
                    disabled={disabled}/>
            </View>
        </View>
    )
}

export default BirthInput;