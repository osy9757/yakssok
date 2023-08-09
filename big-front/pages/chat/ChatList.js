import { View,Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from "react-native"
// import Screen from "../components/Screen"
import { useCallback, useEffect, useState } from "react"
// import { AuthContext } from "../../components/AuthContext"
// import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { API_URL_CHAT_LIST } from '@env'

const user = 
    {
        "user_id" : "kyh885",
        "name" : "양진안",
    }

const ChatList = ({route, navigation}) => {
    const userInfo = route.params.userInfo
    
    // 현재 로그인 된 계정 저장 array
    // const { user } = useContext(AuthContext);
    
    // 로딩 
    const [ loading, setLoading ] = useState(false)

    // 다른 유저들 저장하는 array
    const [ users, setUsers ] = useState([]);

    // 화면 이동 컴포넌트
    const { navigate } = useNavigation();
    // 약사만 필터링 유저

    const [ djangoUsers, setDjangoUsers ] = useState([]);
    // 전체 유저

    const [ allUsers, setAllUsers ] = useState([]);

    const login = async () => {
        const requestOptions = {
            method : "GET",
            headers: {'Content-Type': 'application/json'},
        }
        try {
            await fetch(API_URL_CHAT_LIST, requestOptions) //http://3.38.94.32/user/api/login //10.0.2.2 //172.30.1.47
                    .then(response => {
                    response.json()
                        .then(data => {
                            setDjangoUsers(data.filter(u => u.admin === true ));
                            setAllUsers(data);
                            // console.log("data",data);
                        });
                })
        } catch(error) {
            console.error(error);
        }
    }
    // 유저 불러오기
    // const loadUsers = useCallback(async () => {
    //     유저 불러오기 시도
    //     try {
    //         로딩 true로 전환
    //         setLoading(true);
    //         const snapshot = await firestore().collection("users").get();
    //         console.log(snapshot)

    //         현재 로그인한 유저와 다른 유저 불러오기
    //         setUsers(
    //             snapshot.docs
    //             .map(doc => doc.data()).filter(u => u.userId !== user.userId)
    //         )
    //     } finally {
    //         setLoading(false);
    //     }
    // }, [user.userId])

    // 화면 시작될 때 유저 불러오기
    useEffect(() => {
        login();
    }, []);

    const renderLoading = useCallback(() => {
        <View>
            <ActivityIndicator />
        </View>
    }, []);

    return (
            <View style = {[styles.container, {paddingHorizontal:24, paddingTop:2, paddingBottom:24}]}>
                <View>
                    <Text style={styles.sectionTitle}>나의 정보</Text>
                    <View style={styles.userSectionContent}>
                        <View style={styles.myProfile}>
                            <Text style = {styles.myNameText}>{userInfo.name}</Text>
                            <Text style = {styles.myEamilText}>{eval(userInfo.disease).join(', ')}</Text>
                        </View>
                        <TouchableOpacity onPress={()=>{navigation.navigate('BottomTabNavigation')}}>
                            <Text style={styles.logoutText}>메인으로</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* userListSection */}
                <View style={{flex:1}}>
                    { loading ? renderLoading() : (
                        <>
                            <Text style = {styles.sectionTitle}>
                                약사님과 상담해 보세요!
                            </Text>
                            <View style={{flexGrow:1, flex:1}}>
                                <FlatList 
                                    data = { djangoUsers }
                                    renderItem={
                                        ({ item }) => (
                                            <TouchableOpacity
                                                style = {styles.userListItem}
                                                onPress = {() => {
                                                    console.log('모든유저', allUsers)
                                                    navigate("Chat", {
                                                        userIds : [userInfo.user_id, item.user_id],
                                                        allData : allUsers,
                                                        other : item,
                                                    })
                                                }}>
                                                <Text style={{fontWeight:'bold', fontSize:18}}>{item.name}</Text>
                                                <Text style = {styles.otherEmailText}>{item.phone}</Text>
                                            </TouchableOpacity>
                                        )}
                                    ItemSeparatorComponent={() => <View style={styles.separator}/>}
                                    ListEmptyComponent={() => {
                                        return <Text style={styles.emptyText}>사용자가 없습니다.</Text>
                                    }}
                                    contentContainerStyle={{flexGrow:1}}
                                />
                            </View>
                        </>
                        
                    )}
                </View>
            </View>  
)

}


const styles = StyleSheet.create({
    container : {
        flex : 1, 
        backgroundColor : "#f5f7ff"
    },
    sectionTitle : {
        fontSize : 20,
        fontWeight : "bold",
        marginBottom : 10,
        marginTop:16,
        color : "black",
    },
    userSectionContent : {
        backgroundColor : "#5471ff",
        borderRadius : 12,
        padding : 20,
        alignItems : "center",
        flexDirection : "row"
    },
    myProfile : {
        flex : 1,
    },
    myNameText : {
        color : "white",
        fontSize : 18,
        fontWeight : "bold",
        marginBottom:6
    },
    myEamilText : {
        color : "white",
        fontSize : 14,
    },
    logoutText : {
        color : "white",
        fontSize : 14,
    },
    userSection : {
        marginTop : 40,
        flex : 1,   
    },
    loadingContainer : {
        flex : 1,
        alignItems : "center",
        justifyContent : "center",
    },
    // userList : {
    //     flex : 1,
    // }, 
    userListItem : {
        backgroundColor : "white",
        borderRadius : 12,
        padding : 20,
    },
    otherNameText : {
        fontSize : 16,
        fontWeight : "bold",
        color : "black",
    },
    otherEmailText : {
        marginTop : 8,
        fontSize : 14,
        color : "black",
    },
    separator : {
        height : 10,

    },
    emptyText : {
        color : "black",
    }
});



export default ChatList;