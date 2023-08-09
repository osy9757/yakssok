import { useEffect } from "react";
import { View, Text, ScrollView } from "react-native"
import styles from "../../styles";
import { useIsFocused } from "@react-navigation/native";

const NewsDetailScreen = ({route, navigation}) => {
    const NewsData = route.params.news;
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            navigation.pop()
        }
      }, [isFocused]);

    console.log(NewsData)

    return (
        <View style={styles.container}>
            <View style={styles.inputInfoContainer}>
                <Text>{NewsData.disease}</Text>
                <Text style={{fontSize:24, fontWeight:'bold',marginVertical:20}}>{NewsData.title}</Text>
                <ScrollView>
                    <Text>{NewsData.content}</Text>
                </ScrollView>
            </View>
        </View>
    )
}

export default NewsDetailScreen;