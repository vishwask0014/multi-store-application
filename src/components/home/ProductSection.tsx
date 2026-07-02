import { useRouter } from 'expo-router';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BLACK_COLOR, PRIMARY_COLOR, WHITE_COLOR } from '../theme';

const { width } = Dimensions.get('window');

const recommendedProducts = [
    {
        id: 1,
        name: "Lays Classic Potato Chips",
        image: "https://picsum.photos/id/20/200/200",
        price: 28,
        unit: "200g",
        originalPrice: 35,
    },
    {
        id: 2,
        name: "Amul Taaza Milk",
        image: "https://picsum.photos/id/1080/200/200",
        price: 68,
        unit: "1L",
        originalPrice: null,
    },
    {
        id: 3,
        name: "Maggi 2-Minute Noodles",
        image: "https://picsum.photos/id/292/200/200",
        price: 15,
        unit: "70g",
        originalPrice: 18,
    },
    {
        id: 4,
        name: "Parle-G Biscuits",
        image: "https://picsum.photos/id/431/200/200",
        price: 10,
        unit: "100g",
        originalPrice: null,
    },
    {
        id: 5,
        name: "Haldiram's Bhujia",
        image: "https://picsum.photos/id/669/200/200",
        price: 45,
        unit: "200g",
        originalPrice: 55,
    },
    {
        id: 6,
        name: "Kissan Fresh Tomato Ketchup",
        image: "https://picsum.photos/id/870/200/200",
        price: 85,
        unit: "500g",
        originalPrice: 99,
    },
];

export default function ProductSection() {
    const router = useRouter();

    const renderProduct = ({ item }: { item: typeof recommendedProducts[0] }) => (
        <View style={css.productCard}>
            <Image source={{ uri: item.image }} style={css.productImage} />

            <View style={css.productInfo}>
                <Text style={css.productName} numberOfLines={2}>{item.name}</Text>

                <View style={css.priceRow}>
                    <Text style={css.currentPrice}>₹{item.price}</Text>
                    {item.originalPrice && (
                        <Text style={css.originalPrice}>₹{item.originalPrice}</Text>
                    )}
                    <Text style={css.unit}>{item.unit}</Text>
                </View>

                <TouchableOpacity style={css.addButton}>
                    <Text style={css.addButtonText}>ADD</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View>
            <View style={css.header}>
                <Text style={css.heading}>Recommended Products</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
                    <Text style={css.seeAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={recommendedProducts}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={css.row}
                contentContainerStyle={css.gridContainer}
                scrollEnabled={false} // Disable scroll if inside a bigger ScrollView
            />
        </View>
    );
}

const css = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        marginTop: 42,
    },
    heading: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111",
        letterSpacing: -0.3,
    },
    seeAll: {
        fontSize: 13,
        color: PRIMARY_COLOR,
        fontWeight: "600",
    },

    gridContainer: {
        paddingBottom: 16,
    },

    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 10,
    },

    productCard: {
        backgroundColor: WHITE_COLOR,
        borderRadius: 16,
        width: width * 0.46, // Slightly less than 50% for spacing
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },

    productImage: {
        width: '100%',
        height: 130,
        resizeMode: 'cover',
    },

    productInfo: {
        padding: 12,
    },

    productName: {
        fontSize: 13,
        fontWeight: '600',
        color: BLACK_COLOR,
        lineHeight: 18,
        marginBottom: 8,
        height: 40,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },

    currentPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: BLACK_COLOR,
    },

    originalPrice: {
        fontSize: 13,
        textDecorationLine: 'line-through',
        color: '#999',
    },

    unit: {
        fontSize: 12,
        color: '#666',
        marginLeft: 'auto',
    },

    addButton: {
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 8,
        paddingVertical: 9,
        alignItems: 'center',
    },

    addButtonText: {
        color: WHITE_COLOR,
        fontSize: 13,
        fontWeight: '600',
    },
});