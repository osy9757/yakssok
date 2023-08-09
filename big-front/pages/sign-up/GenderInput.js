import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import styles from "../../styles";
import StyledButton from "../../components/StyledButton";
import { AntDesign } from "@expo/vector-icons";
import ProgressBar from "../../components/ProgressBar";

const SelectGender = ({route, navigation}) => {
    const {admin, name} = route.params.userInfo;
    const [gender, setGender] = useState('M');

    /* 
    <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.selectBtn} onPress={() => navigation.navigate('IdInput', {admin, name, 'gender':'M'})}>
            <Image source={require('../../assets/favicon.png')} style={styles.selectIcon} />
            <Text style={styles.selectBtnText}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectBtn} onPress={() => navigation.navigate('IdInput', {admin, name, 'gender':'F'})}>
            <Image source={require('../../assets/favicon.png')} style={styles.selectIcon} />
            <Text style={styles.selectBtnText}>Female</Text>
        </TouchableOpacity>
    </View>
    <View style={styles.dummyView} />*/
    return (
        <View style={styles.container}>
            <ProgressBar admin={admin} currentStep={2}/>
            <View style={styles.inputInfoContainer}>
                <Text style={styles.inputInfo}>성별을 선택해주세요.</Text>
            </View>
            <View style={styles.inputContainer}>
                <TouchableOpacity style={gender==='M'?selectStyles.btn2:selectStyles.btn} onPress={() => setGender('M')}>
                    <Text style={gender==='M'?selectStyles.btnText2:selectStyles.btnText}>Male</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity style={gender==='F'?selectStyles.btn2:selectStyles.btn} onPress={() => setGender('F')}>
                    <Text style={gender!=='M'?selectStyles.btnText2:selectStyles.btnText}>Female</Text>
                    <AntDesign name='check' size={30} color='white' />
                </TouchableOpacity>
            </View>
            <View style={styles.dummyView} />
            <View style={styles.bottomBtn}>
                <StyledButton 
                    onPress={() => navigation.navigate('IdInput', { 
                        userInfo:{
                            'admin':admin, 
                            'name':name,
                            gender}})} 
                    title='다음' />
            </View>
        </View>
    )
}

const selectStyles = StyleSheet.create({
    btn: {
        borderWidth: 1,
        backgroundColor: 'white',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 20,
        marginVertical: 10,
        justifyContent: 'space-between'
    },
    btn2: {
        borderWidth: 1,
        backgroundColor: 'black',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        padding: 20,
        marginVertical: 10,
        justifyContent: 'space-between'
    },
    btnText: {
        textAlign: 'center',
        fontSize: 20,
        color: 'black',
        paddingHorizontal: 10
    },
    btnText2: {
        textAlign: 'center',
        fontSize: 20,
        color: 'white',
        paddingHorizontal: 10
    },
});
export default SelectGender;