import * as Font from 'expo-font'
import { useState, useEffect } from 'react'
import { Text } from 'react-native'

const DefaultText = ({children, style, onPress=null}) => {
    const [fontLoad, setFontLoad] = useState(false)

    // font 불러오기 
    useEffect(() => {
        Font.loadAsync({
            'NotoSans': require('../assets/fonts/NotoSansKR-Regular.otf')
        })
        setFontLoad(true)
    }, [])

    let lineHeight

    if(style.fontSize==undefined) {
        lineHeight = 14 + 3
    } else {
        lineHeight = style.fontSize + 3
    }

    // 배열 형식으로 폰트 fontStyle 변수에 담기 
    let fontStyle = [{ fontFamily: 'NotoSans', lineHeight: lineHeight }]
    if (style) {
        // style 이 Array 라면 concat으로 합치기 
        if (Array.isArray(style)) {
            fontStyle = fontStyle.concat(style)
        } else {
            // Array가 아니라면 push하기 
            fontStyle.push(style)
        }
    }

    return (
        <Text style={fontStyle} onPress={onPress}>
            {children}
        </Text>
    )
}

export default DefaultText