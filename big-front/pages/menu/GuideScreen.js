import { View, Text } from "react-native-animatable"
import { LogBox } from "react-native";
LogBox.ignoreAllLogs();

const GuideScreen = () => {
    return (
        <View>
            <Text>사용 가이드</Text>
            <View>
                <Text>메인 화면 기능</Text>
                <View>
                    <Text>1. 처방전 등록</Text>
                    <Text>업로드 하는 처방전 사진은 상단에 '처방전'이라는 글자가 보여야합니다.</Text>
                    <Text>또한 처방전 내의 알약 명이 선명하게 보여야 합니다.</Text>
                </View>
                <View>
                    <Text>2. 알약 등록</Text>
                    <Text>업로드 하는 알약 사진은 크게 나올 수록, 찍힌 알약이 적을 수록 정확도가 높아집니다.</Text>
                    <Text>또한 알약의 표면에 있는 문자나 그림이 잘 보일 수록 더 정확한 결과를 얻을 수 있습니다.</Text>
                </View>
            </View>
            <View>
                <Text>뉴스 및 QnA 화면 기능</Text>
                <View>
                    <Text>1. 뉴스</Text>
                    <Text>기본적으로는 회원가입 시 등록한 질병들과 관련된 뉴스 기사를 불러옵니다.</Text>
                    <Text>검색을 통해 원하는 뉴스 키워드를 검색할 수 있습니다.</Text>
                </View>
                <View>
                    <Text>2. QnA</Text>
                    <Text>질문 등록 시 약사에게 답변을 받을 수 있습니다.</Text>
                    <Text>다른 사람들의 질문과 답변 또한 확인할 수 있습니다.</Text>
                    <Text>검색 및 답변 받은 질문 필터링을 통해 원하는 정보를 얻을 수 있습니다.</Text>
                    <Text>QnA에 등록했던 글은 메뉴 화면의 '내가 쓴 글 보기'에서 다시 검색해서 답변을 확인할 수 있습니다.</Text>
                </View>
            </View>
            <View>
                <Text>메뉴 화면 기능</Text>
                <View>
                    <Text>1. 내 정보</Text>
                    <Text>회원가입 시 입력한 정보들을 확인할 수 있는 화면입니다.</Text>
                </View>
                <View>
                    <Text>2. 내가 쓴 글 보기</Text>
                    <Text>QnA에 등록한 질문과 그에 대한 답변을 확인할 수 있습니다.</Text>
                </View>
                <View>
                    <Text>3. 내 처방전 보기</Text>
                    <Text>메인화면 하단부에서 볼 수 있는 정보와 같음</Text>
                </View>
            </View>
        </View>
    )
}

export default GuideScreen