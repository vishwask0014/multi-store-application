import { LocationIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Image, StyleSheet, Text, View } from "react-native";
import logo from '../../../assets/expo.icon/Assets/logo.svg';
import NotificationAlert from './NotificationAlert.tsx';

export default function Header() {
    return (<>
        <View style={css.container}>
            <Image source={logo} />
            <View style={css.locationWrapper}>
                <HugeiconsIcon icon={LocationIcon} />

                <View>
                    <Text style={css.label}>current Location</Text>
                    <Text>8B Mohali, Punjab</Text>
                </View>

            </View>

            <NotificationAlert />
        </View>
    </>)
}

const css = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: "space-between",
        flexDirection: 'row',
        width: '100%',
        alignItems: "center",
        position: 'sticky',
        top: 0,
        backgroundColor: '#fff',
        zIndex: 10,
        paddingTop: 16,
        paddingBottom: 16,
    },

    locationWrapper: {
        position: 'relative',
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    label: {
        fontSize: 12,
        lineHeight: 10,
        fontWeight: 300,
        color: '#6c6c6cff',
    }
})