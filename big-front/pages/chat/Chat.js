import React, { useCallback, useEffect, useState, useMemo } from "react";
// import Screen from "../components/Screen";
import { useRoute } from "@react-navigation/native";
import { View, StyleSheet,ActivityIndicator, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
// import firestore from "@react-native-firebase/firestore";
// 정렬 pakage
import _ from "lodash";
// yarn add react-native-image-crop-picker
import ImagePicker from 'react-native-image-crop-picker';

import testuseChat from "./UseChat";
import TestMessage from "./Message";

import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import ImageMessage from "./ImageMessage";

// 로그인 계정

// 활성황 안되었을 때 스타일
const disabledSendButtonStyle = [
    styles.sendButton,
    { backgroundColor : "gray" },
];

const TestChat = () => {
    const { params } = useRoute();
    const { other, userIds, allData} = params;
    const { loadingChat, chat, sendMessage, messages, loadingMessages, sendImageMessage} = testuseChat(userIds, allData);
    const [ text, setText ] = useState("")

    // 현재 로그인된 아이디
    const user = {
        "admin": true,
        "birthdate": "1997-09-09",
        "disease": "asd",
        "dt_created": "2023-06-19",
        "dt_modified": "2023-06-19",
        "gender": "M",
        "has_surgery": true,
        "id": 14, 
        "name": "asdasdasd",
        "phone": "010-0000-0000",
        "pw":
        "pbkdf2_sha256$600000$nv3RDLqebFDXCS8mYOzuNY$E8lqPorCANasN4/lsXwtN9jZx+jDa5ljUsZGWk4nDwI=",
        "user_id":
        "asdasdasd",
        "user_pill":
        "asd",
        "user_specialnote": "asd"
    }
    
    const loading = loadingChat || loadingMessages;

    console.log("messages", messages)
    // text 길이가 0일때 
    const sendDisabled = useMemo(() => text.length === 0, [text]);

    // 버튼 눌리면 초기화 
    const onPressSendButton = useCallback(() => {
        
        // text와 user 정보 보내기
        sendMessage( text, user )
        setText('');
        
        
    }, [user,sendMessage, text] )

    // text가 바뀌었을 때
    const onChangeText = useCallback((newText) => {
        setText(newText);
    }, [])

    // 버튼이 눌렸을 때
    const onPressImageButton = useCallback(async () => {
        if (user != null) {
            const image = await ImagePicker.openPicker( { cropping : true } );
            sendImageMessage(image.path, user)
        }
    }, [user, sendImageMessage])

    const renderChat = useCallback(() => {
        if (chat == null) {
            return <ImageMessage url={require('../../assets/icon.png')}/>;
        }
        return (
            <View style={styles.chatContainer}>
                {/* 대화상대 member icon section */}
                <View style = {styles.membersSection}>
                    <Text style = {styles.membersTitleText}>대화상대</Text>
                    <FlatList 
                        data = {chat.users}
                        renderItem= {({item : user}) => (
                            <View style={styles.userProfile}>
                                <Text style={styles.userProfileText} >{ user.name[0] }</Text>
                            </View>
                        )}
                        horizontal
                    />
                </View>
                {/* 텍스트 input section */}
                <FlatList
                    inverted
                    style = {styles.messageList}
                    data = {messages}
                    renderItem={( {item : message} ) => {
                        console.log('메세지', message)
                        if (message.text != null) {
                            console.log('메세지 not null')
                            return (
                                <TestMessage
                                name = {message.user.name}
                                message = {{ text : message.text}} 
                                createdAt={message.createdAt}
                                isOtherMessage={message.user.user_id !== user.user_id}
                            />
                            )
                        }
                        if (message.imageUrl != null) {
                            console.log('url not null')
                            return (
                                <TestMessage
                                    name = {message.user.name}
                                    message = {{ url : message.imageUrl}} 
                                    createdAt={message.createdAt}
                                    isOtherMessage={message.user.user_id !== user.user_id}
                                />
                            )
                        }
                    }}
                    ItemSeparatorComponent={() => (
                        <View style = {styles.messageseparator} />
                    )}
                />

                <View style = {styles.inputContainer}>
                    <View style = {styles.textInputContainer}>
                        <TextInput 
                            style = {styles.textInput}
                            value = {text}
                            onChangeText = {onChangeText}
                            multiline
                        />
                    </View>
                    {/* 보내기 버튼 */}
                    <TouchableOpacity 
                        
                        style = {sendDisabled ? disabledSendButtonStyle : styles.sendButton}
                        disabled = {sendDisabled}
                        onPress = { onPressSendButton }
                        
                        >
                        <Ionicons name="ios-send" size={18} color="white" />
                    </TouchableOpacity>
                    {/* 이미지 보내는 버튼 */}
                    <TouchableOpacity
                        style = {styles.imageButton}
                        onPress = {onPressImageButton}
                    >
                        <Feather name="image" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [chat, onChangeText, text, sendDisabled, onPressSendButton, user, onPressImageButton])

    useEffect(() => {
        if (loadingChat == true) {
            console.log("chat", chat)
        }
    })

    return (
            <View style = {styles.container}>
                {
                    loading ? (
                        <View style = {styles.loadingContanier}>
                            <ActivityIndicator />
                        </View>
                    ) : (
                        renderChat()
                        // <>
                        // <View>
                        //     <Text>회원</Text>
                        // </View>
                        // </>
                    )
                }
            </View>
    )
    
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    loadingContanier : {
        flex : 1,
        alignItems : "center",
        justifyContent : "center",
    },
    chatContainer : {
        flex : 1,
        padding : 20,
    },
    membersSection : {

    },
    membersTitleText : {
        fontSize : 16,
        color : "black",
        fontWeight : "bold",
        marginButton : 8,
    },
    userProfile : {
        width : 34,
        height : 34,
        backgroundColor : "black",
        borderRadius : 34 / 2,
        borderWidth : 1,
        borderColor : "white",
        justifyContent : "center",
        alignItems : "center",
    },
    userProfileText : {
        color : "white",
    },
    messageList : {
        flex : 1,
        // backgroundColor : "black",
        marginVertical : 20,
    },
    inputContainer : {
        flexDirection : "row",
        alignItems : "center",
    },
    textInputContainer : {
        flex : 1,
        marginRight : 10,
        borderRadius : 24,
        borderColor : "black",
        borderWidth : 1,
        overflow : "hidden",
        padding : 10,
        minHeight : 50,
        justifyContent : "center",
    },
    textInput : {
        paddingTop : 0,
        paddingBottom : 0,
    },
    sendButton : {
        justifyContent :"center",
        alignItems : "center",
        backgroundColor : "black",
        width : 50,
        height : 50,
        borderRadius : 50 / 2,
    },
    sendText : {
        color: "white",
    },
    messageseparator : {
        height : 8,
    },
    imageButton : {
        borderWidth : 1,
        borderColor : "black",
        width : 50,
        height : 50,
        borderRadius : 8,
        marginLeft : 8,
        alignItems : "center",
        justifyContent : "center",
    }
});

export default TestChat;