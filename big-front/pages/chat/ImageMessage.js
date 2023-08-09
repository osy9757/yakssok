import React from "react";

import { StyleSheet } from "react-native";
import { Image } from "react-native";

const styles = StyleSheet.create({
    image : {
        width : 200,
        height : 200,
    }
});

const ImageMessage = ({url}) => {
    console.log('url', url)
    return (
    <Image style = {styles.image} source = {{url :url}} resizeMode = "contain" />
    )
};

export default ImageMessage;