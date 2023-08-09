import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, useWindowDimensions,Alert, Button, Pressable, Modal, TouchableOpacity} from 'react-native';
// import { DrugList } from '../DrugList';
// import { Header } from '../components/Header/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import StyledButton from '../../components/StyledButton';
import { DB_URL_USERPILLJOIN } from '@env'
import { MaterialIcons } from '@expo/vector-icons';
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

export default function InterdictScreen(props) {
  const [drugInfo, setDrugInfo] = useState(props.route.params.drugInfo)
  const {width} = useWindowDimensions();
  const user_id = props.route.params.user_id
  // const {user_id, drugInfo} = props.route.params
  console.log('Inter페이지', props.route.params)
  const interdictDrugInfo = drugInfo.filter((drug) => drug.safe_to_take === false);

  const moveToMainScreen = () => {
    const sendToModel = async() => {
      let drugNameList = ''
      for(let drug of drugInfo){
          drugNameList = drugNameList + drug.pill_name + '~'
      }
      console.log('drugNameList',drugNameList)
      console.log('보내는데이터', JSON.stringify({pill_name:drugNameList, user_id:user_id}))
      const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({pill_name:drugNameList, user_id:user_id})// 보낼 데이터
      }
      // navigation.navigate(model==='ocr'?'PrescriptionScreen': 'DrugScreen', {uri: image})
      try {
          await fetch(DB_URL_USERPILLJOIN, requestOptions) //http://3.38.94.32/user/api/login
              .then(response => {
                  response.json()
                      .then(data => {
                          console.log('통신', data)
                          props.navigation.navigate("MainScreen", {user_id:user_id, drugInfo:drugInfo})
                      });
              })
      } catch(error) {
          console.error(error);
      }
    }
    sendToModel()
    // props.navigation.navigate("interdictScreen")
  }
  const [bigImgModalVisible, setbigImgModalVisible] = useState(0)

  console.log(props.route.params)

  const openModal = (item) => {
    setbigImgModalVisible(item)
  }
  const closeModal = () => {
      setbigImgModalVisible(0)
  }
  // const [lenDrug, setLenDrug] = useState(len(drugInfos))

  // delete 함수
  const deleteImage = (pill_name) => {
    Alert.alert("이미지를 삭제하시겠어요?", "", [
      {
        style : "cancel",
        text : "아니요",
      },
      {
        text : "네",
        onPress : () => {
          const newDrugInfo = drugInfo.filter((drug) => drug.pill_name !== pill_name);
          setDrugInfo(newDrugInfo)
        }
      }
    ]) 
  }
  // 리스트 렌더링
  const renderItem = ({item}) => {
    const onLongPress = () => deleteImage(item.pill_name);
    return (
      <View>
        <Pressable onLongPress = {onLongPress} style= {item.safe_to_take ? styles.container : styles.container_2}>
          <View style = {styles.box}>
            <Image source = {{uri : item.uri}} style = {styles.image}/>
            <View style = {styles.textContainer}>
              <Text style = {[styles.nameText, item.safe_to_take?null:{color:'white'}]} numberOfLines={1}>
                {item.pill_name}
              </Text>
              <View>
                <Text style = {[styles.desName, item.safe_to_take?null:{color:'white'}]} numberOfLines={2}>{item.safe_to_take?'':item.reason}</Text>
              </View>
            </View>
          </View>
              <Modal
                animationType = "fade"
                transparent = {true}
                visible = {bigImgModalVisible===item}
                >
                <Pressable onPress = {closeModal} style = {{flex : 1, justifyContent : "center", alignItems : "center"}}>
                  <View style={{backgroundColor:'white', opacity:0.4, position:'absolute', width:'100%', height:'100%'}}/>
                  <View style={{backgroundColor:item.safe_to_take?'white':'#FFE1E1', alignItems:'center', 
                              opacity:0.9, shadowColor:'black', shadowOffset:{width:0, height:2},
                              shadowOpacity: 0.2, shadowRadius:4, elevation:5, borderRadius:6,
                              width:'80%', minHeight:'40%',}}>
                    {item.uri!==null?<Image source = {{uri : item.uri}} style = {{ width : '100%', minHeight : '26%', resizeMode:'contain', margin:10}}/>
                      :<MaterialIcons name='image-not-supported' size={100} style={{margin:30}}/>}
                    <View style={{backgroundColor:item.safe_to_take?'white':'#FFE1E1', width:'100%', padding:20, borderBottomLeftRadius:6, borderBottomRightRadius:6}}>
                      <Text style={{fontSize:22, fontWeight:'bold', marginVertical:10}}>{item.pill_name}</Text>
                      <Text style={{fontSize:16, lineHeight:26}}>{'- '+item.reason.join('\n- ')}</Text>
                    </View>
                  </View>
                </Pressable>
                <View style={{backgroundColor:'white'}}/>
              </Modal>
            
            <TouchableOpacity onPress = {()=>openModal(item)} style = { item.safe_to_take ? styles.Pressable : styles.Pressable_2}>
              <Text style = {item.safe_to_take ? {fontSize : 12,color : "white"} : {fontSize : 12,color : "#5D5F64"}}>크게보기</Text>
            </TouchableOpacity>
          </Pressable>
        <View style={{height : 10}}></View>
      </View>
    )
  }

  useEffect(() => {
    console.log(drugInfo)
  }, [])
return (
  <View style = {{flex : 1, alignItems : "center", backgroundColor : "#f5f7ff"}}>
    <View style = {{ flex :1, width : width * 0.90}}>
      {/* Header */}
      <View style = {{paddingTop : 40, paddingBottom : 20,}}>
        <Text style= {{fontSize : 24,}}>
          <Text style = {{fontSize : 26, fontWeight : "bold", color : "#5471FF"}}>{`${drugInfo.length}개`}</Text>의 알약이 인식되었습니다.
        </Text>
        <Text style= {{fontSize : 24,}}>
          <Text style = {{fontSize : 26, fontWeight : "bold", color : "#F25555"}}>{`${interdictDrugInfo.length}개`}</Text>의 약물이 충돌합니다.
        </Text>
        <Text style={{marginTop:10}}>길게 누르면 삭제할 수 있습니다.</Text>
      </View>

      {/* flatlist */}
      <View style = {{paddingVertical : 10, paddingHorizontal : 10, minHeight : "50%", backgroundColor : "white", marginBottom : 20, borderRadius : 10}}>
        <FlatList 
            data = {drugInfo}
            renderItem = {renderItem}
        />
      </View>
    {/* button */}
      <View style = {{flexDirection : "row", width : "100%", paddingHorizontal : 10, justifyContent : "space-between", marginBottom:20}} >
        <StyledButton title={'상담하기'} withBtn={true}/>
        <StyledButton title={'등록완료'} withBtn={true} onPress={moveToMainScreen}/>

      </View>
      {/* go to main */}
      <Pressable onPress={()=>props.navigation.popToTop()} style = {{justifyContent : "center", alignItems : "center", marginBottom : 5}}>
          <Text style = {{fontSize : 12, borderBottomColor : "gray", borderBottomWidth:1, paddingBottom:2, paddingHorizontal:2}}>메인으로 돌아가기</Text>
      </Pressable>
    </View>

  </View>
)
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  flexDirection : "row",
  backgroundColor: '#e6ebff',
  borderRadius : 10,
  alignItems: 'center',
  justifyContent: 'space-between',
},
container_2: {
  flex: 1,
  flexDirection : "row",
  backgroundColor: '#F25555',
  borderRadius : 10,
  alignItems: 'center',
  justifyContent: 'space-between',
},
box : {
  flexDirection : "row",
  paddingHorizontal : 10,
  paddingVertical : 10,
  borderRadius : 10,
  flex:1,
  alignItems: 'center'
},
image : {
  width : 40,
  height : 40,
  borderRadius : 10,
  backgroundColor : "gray",
},
textContainer : {
  justifyContent : "center",
  marginLeft :  10,
  flex:1,
  flexGrow:1,
},
nameText : {
  fontWeight : "bold",
  fontSize : 12,
  color : "#5D5F64",
},
desName : {
  fontSize : 11,
  color : "#5D5F64"
},
Pressable : {
  borderRadius : 5,
  backgroundColor: '#5471FF',
  paddingHorizontal: 8,
  paddingVertical : 8,
  marginRight : 10,
},
Pressable_2 : {
  borderRadius : 5,
  backgroundColor: '#FFE1E1',
  paddingHorizontal: 8,
  paddingVertical : 8,
  marginRight : 10,
}

});