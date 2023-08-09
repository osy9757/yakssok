import React, { useCallback } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
// 시간 전처리 패키지
import moment from "moment";
// import ImageMessage from "./ImageMessage";

// 일반 스타일
const styles = StyleSheet.create({
    container : {
        marginBottom : 10,
        alignItems : "flex-end",
    },
    nameText : {
        fontSize : 12,
        color : "gray",
        marginBottom : 4,
    },
    renderMessageContainer : {
        flexDirection : "row",
        alignItems : "flex-end",
    },
    timeText : {
        fontSize : 12,
        color : "gray",
        marginRight : 4,
    },
    bubble : {
        backgroundColor : "black",
        borderRadius : 12,
        padding : 12,
        flexShrink : 1,
    },
    messageText : {
        fontSize : 14,
        color : "white",
    }
});
// 다른 유저일 때 사용되는 STYLE
const otherNessageStyles = {
    container : [styles.container, { alignItems : "flex-start" }],
    bubble : [styles.bubble, { backgroundColor : "lightgray"}],
    messageText : [styles.messageText, {color : "black"}],
    timeText : [styles.timeText, {marginRight : 0, marginLeft : 4}],
};


const TestMessage = ({name, message, createdAt, isOtherMessage}) => {
    const messageStyles = isOtherMessage ? otherNessageStyles : styles; 

    const renderMessage = useCallback(() => {
        console.log(message)
        if ("text" in message) {
            return <Text style = {messageStyles.messageText}>{message.text}</Text>
        }
        if ("url" in message ) {
            return <Image style = {{width : 100, height : 100}} source = {{uri : message.url}} />
        }
    }, [message, messageStyles.messageText] )

    const components = [
        <Text key = "timeText" style = {messageStyles.timeText}>{moment(createdAt).format("HH:mm")}</Text>,
        <View key = "message" style = {messageStyles.bubble}>
            {renderMessage()}
        </View>,
    ];

    const renderMessageContainer = useCallback(() => {
        return isOtherMessage ? components.reverse() : components;
    
    }, [createdAt, renderMessage, messageStyles, isOtherMessage])
    return (
        <View style = {messageStyles.container}>
            <Text style = {styles.nameText}>{name}</Text>
            <View style = {styles.renderMessageContainer}>
                {renderMessageContainer()}
            </View>

        </View>
    )
};

export default TestMessage;