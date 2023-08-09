import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet, Image } from "react-native";
import styles from "../../styles";
import { FontAwesome, Ionicons, Fontisto } from "@expo/vector-icons";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const UserInfoScreen = ({route, navigation}) => {
    // const {admin, name, gender, user_id, pw, phone, birthdate, disease='', has_surgery='', etcInfo='', pharmacy=''} = route.params.userInfo;
    const [showPw, setShowPw] = useState(false);
    const userInfo = route.params.userInfo
    const list = {name:'이름', gender:'성별', user_id:'ID', pw:'비밀번호', phone:'전화번호', birthdate:'생년월일', disease:'질병', has_surgery:'수술이력', user_specialnote:'특이사항'}

    const printUserInfo = () => {
        let array = [];
        
        console.log('정보', userInfo)
        for(let val in userInfo) {
            if(val==='id'||val==='admin'||val==='user_pill'||val==='dt_created'||val==='dt_modified'||val==='pw') {
                continue
            }
            console.log(val)
            // if(val==='pw') {
            //     array.push(
            //         <View key={val+'_container'} style={{flexDirection:'row', justifyContent: 'space-between'}}>
            //             <Text key={val} style={infoStyles.infoText}>
            //                 {list[val]} : {showPw?userInfo[val]:'*******'}
            //             </Text>
            //             <TouchableOpacity key={val+'_view'} onPress={() => setShowPw((current)=>(!current))}>
            //                 <Ionicons key={val+'_view_icon'} name={showPw?"eye-outline":"eye-off-outline"} size={22}/>
            //             </TouchableOpacity>
            //         </View>
            //     )
            // } else 
            if(val==='gender') {
                array.push(
                    <Text key={val} style={infoStyles.infoText}>{list[val]} : {userInfo[val]==='M'?'남성':'여성'}</Text>
                )
            } else if(val==='disease') {
                array.push(
                    <Text key={val} style={infoStyles.infoText}>{list[val]} : {eval(userInfo[val]).length>0?eval(userInfo[val]).join(', '):'없음'}</Text>
                )
            } else if(val==='disease'||val==='user_specialnote') {
                array.push(
                    <Text key={val} style={infoStyles.infoText}>{list[val]} : {userInfo[val].length>0?eval(userInfo[val]).join(', '):'없음'}</Text>
                )
            
            } else {
                array.push(
                    <Text key={val} style={infoStyles.infoText}>{list[val]} : {userInfo[val]?userInfo[val]:'없음'}</Text>
                )
            }
        }
        return array;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.inputInfo}>내 정보</Text>
            <View style={styles.dummyView}/>
            <View style={styles.logoContainer}>
                <View style={{backgroundColor:'white', borderRadius:100, width:180,height:180, justifyContent:'center', alignItems:'center'}}>
                    {userInfo.admin?<FontAwesome name="user-md" size={150}/>:<FontAwesome name='user' size={100}/>}
                </View>
            </View>
            <View style={styles.dummyView} />
            <View style={styles.inputContainer}>
                <View style={{backgroundColor:'white', paddingVertical:16, paddingHorizontal:22, borderRadius:10, elevation:1}}>
                {(() => (printUserInfo()))()}
                </View>
            </View>
        </View>
    )

}

const infoStyles = StyleSheet.create({
    infoText: {
        fontSize: 20,
        marginVertical: 6,
    }
})

export default UserInfoScreen;