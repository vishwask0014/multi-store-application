import { Image, StyleSheet, View } from "react-native";

export default function Header() {
    return (<>
        <View style={css.container}>
            <Image source={require('../assets/expo.icon/Assets/logo.svg')} />
        </View>
    </>)
}


const css = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: "space-between",
        width: '100%',
        alignItems: "center",
        paddingLeft: 16,
        paddingRight:16,
    }
})