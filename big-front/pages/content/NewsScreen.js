import { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native"
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import styles from "../../styles";
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const NewsScreen = ({route, navigation}) => {
    // 질병 검색기능/필터기능 추가 필요
    console.log(route.params)
    
    // 상단 탭 변경 시 자동으로 refresh, 최상단 이동
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused) {
            loadNewsData();
            setRefreshing(false);
            setScrollTop(true)
        }
    }, [isFocused]);

    // 맨 위로 스크롤
    const flatlistRef = useRef();
    const [scrollTop, setScrollTop] = useState(false);

    useEffect(() => {
        if(flatlistRef.current&&scrollTop) {
            flatlistRef.current.scrollToIndex({animated:true, index:0});
            setScrollTop(false)
        }
    }, [scrollTop])


    // 출력할 뉴스 데이터 / 임시데이터 사용 안하게 되면 useState([])로 수정
    const [NewsData, setNewsData] = useState([
        {
            no: 1,
            disease: '고혈압',
            title: '뉴스1',
            content: '내용1'
        },
        {
            no: 2,
            disease: '당뇨병',
            title: '뉴스2',
            content: '내용2'
        },
        {
            no: 3,
            disease: '당뇨병',
            title: '뉴스3',
            content: '내용3'
        },
        {
            no: 4,
            disease: '천식',
            title: '뉴스4',
            content: '내용4'
        },
        {
            no: 5,
            disease: '고혈압',
            title: '뉴스5',
            content: '내용5'
        },
        {
            no: 6,
            disease: '고혈압',
            title: '뉴스6',
            content: '내용6'
        }
    ]);
    const loadNewsData = async() => {
        fetch('django링크')  // API 사용일 수도
            .then(response => response.json())
            .then(data => {
                    setRefreshing(false);
                    setNewsData(data);
                })
        .catch(error => {
            console.log(error);
        });
    }

    // 새로고침
    const [refreshing, setRefreshing] = useState(true);
    
    // Flatlist에 출력할 item
    const Item = ({item, onPress}) => (
        <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
            <View style={styles.itemHeader}>
                <Text style={qnaStyles.userId}>{item.title}</Text>
                <Text style={qnaStyles.disease}>{item.disease}</Text>
            </View>
            <Text style={qnaStyles.q}>{item.content}</Text>
        </TouchableOpacity>
    );

    const renderItem = ({item}) => {
        return (
            <Item item={item}
                onPress={() => navigation.navigate('NewsDetailScreen', {'news':item})} />
        )
    }

    return (
        <View style={styles.container}>
            {refreshing ? <ActivityIndicator color={'black'}/>:null}
                <FlatList data={NewsData} 
                        renderItem={renderItem} 
                        refreshControl={
                            <RefreshControl 
                                refreshing={refreshing} 
                                onRefresh={loadNewsData}/>}
                        ref={flatlistRef}
                        keyExtractor={item=>item.no}
                    />
            <TouchableOpacity style={styles.scrollBtn} onPress={()=>setScrollTop(true)}>
                <FontAwesome name="chevron-up" size={16} color={'white'}/>
            </TouchableOpacity>
        </View>
    )
}

const qnaStyles = StyleSheet.create({
    userId: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    disease: {
        borderWidth: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 14
    },
    q: {
        padding: 4,
        fontSize: 20
    },
})

export default NewsScreen;