
import { PRIMARY_COLOR } from '@/components/theme';
import { Cart, Home01Icon, Profile, SearchList01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Tabs } from "expo-router";

const tabMenu = [
    {
        name: 'index',
        title: 'Home',
        iconName: Home01Icon,
    },
    {
        name: 'profile',
        title: 'Profile',
        iconName: Profile,
    },
    {
        name: 'products',
        title: 'Products',
        iconName: SearchList01Icon,
    },
    {
        name: 'cart',
        title: 'Cart',
        iconName: Cart,
    },
]

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: PRIMARY_COLOR
        }}>
            {
                tabMenu.map((i, indxe) => (
                    <Tabs.Screen name={i.name} options={{
                        title: i.title,
                        tabBarIcon: ({ color, size }) => (
                            <HugeiconsIcon icon={i.iconName} size={size} color={color} />
                        )
                    }} />
                ))
            }
        </Tabs>
    )
}