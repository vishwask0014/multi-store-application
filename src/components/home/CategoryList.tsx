import { Image, StyleSheet, Text, View } from "react-native"
import CakeIcon from '../../../assets/expo.icon/Assets/category-icons/cake-slice.png'
import Medicine02Icon from '../../../assets/expo.icon/Assets/category-icons/drugs.png'
import VegetarianFoodIcon from '../../../assets/expo.icon/Assets/category-icons/fruits-and-vegetables.png'
import ElectricPlugsIcon from '../../../assets/expo.icon/Assets/category-icons/headphones.png'
import ServingFoodIcon from '../../../assets/expo.icon/Assets/category-icons/serving-dish.png'


const categoryList = [
    {
        id: '1',
        slug: 'vegetables-Fruits',
        label: 'Produce',
        img: VegetarianFoodIcon,
    },
    {
        id: '2',
        slug: 'dish',
        label: 'Dish',
        img: ServingFoodIcon,
    },
    {
        id: '3',
        slug: 'pharma',
        label: 'Pharma',
        img: Medicine02Icon,
    },
    {
        id: '4',
        slug: 'celebration',
        label: 'Celebration',
        img: CakeIcon,
    },
    {
        id: '5',
        slug: 'electronics',
        label: 'Electronics',
        img: ElectricPlugsIcon,
    },
]


export default function CategoryList() {
    return (
        <>
            <View style={css.categoryListWrapper}>
                {
                    categoryList.map((i, index) => {
                        return (
                            <>
                                <View key={i.id} style={css.item}>
                                    <Image source={i.img} style={css.icon} />
                                    <Text style={css.label}>{i.label}</Text>
                                </View>
                            </>
                        )
                    })
                }

            </View>
        </>
    )

}


const css = StyleSheet.create({
    categoryListWrapper: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll',
        alignItems: 'flex-start',
        width: '100%',
        gap: 20,
        paddingBottom: 12,
    },

    item: {
        maxWidth: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },

    label: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 18,
    },

    icon: {
        width: 32,
        height: 32,
    }
})