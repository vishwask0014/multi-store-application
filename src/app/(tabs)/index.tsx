//     "./homepage"

import AiBanner from "@/components/home/AiBanner";
import CategoryList from "@/components/home/CategoryList";
import Header from "@/components/home/Header";
import NearbyStores from "@/components/home/NearbyStores";
import OfferCarousel from "@/components/home/OfferCarousel";
import ProductSection from "@/components/home/ProductSection";
import SearchBar from "@/components/home/SearchBar";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
    return (
        <View style={css.container}>
            <Header />
            <SearchBar />
            <AiBanner />
            <CategoryList />
            <OfferCarousel />
            <NearbyStores />
            <ProductSection />
        </View>
    )
}


const css = StyleSheet.create({
    container: {
        position: 'relative',
        paddingLeft: 16,
        paddingRight: 16,
        overflow: 'scroll',
        maxHeight: '100vh',
        paddingBottom: 32,
    }
})