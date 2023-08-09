import { FontAwesome } from "@expo/vector-icons";
import { View } from "react-native";

const ProgressBar = ({admin, currentStep}) => {
    const printStep = () => {
        let array = []
        const totalStep = admin?6:7;  // 약사면 6단계, 일반회원이면 7단계

        for(let i=1; i<currentStep; i++) {  // 진행 완료 단계는 검은 원
            array.push(
                <View key={i}>
                    <FontAwesome key={i} name='circle' size={20} />
                </View>
            )
        }

        // 진행 중인 단계는 가운데 점 있는 원
        array.push(
            <View key={currentStep}>
                <FontAwesome key={currentStep} name='dot-circle-o' size={(20, 30)} />
            </View>
        )

        for(let i=currentStep+1; i<=totalStep; i++) {  // 앞으로 남은 단계는 빈 원
            array.push(
                <View key={i}>
                    <FontAwesome key={i} name='circle-o' size={20} />
                </View>
            )
        }
        return array
    }
    return (
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', height:80}}>
            {(()=>(printStep()))()}
        </View>
    )
}


export default ProgressBar;