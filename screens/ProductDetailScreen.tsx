import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

// Type for the route prop of ProductDetail screen
type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

// Type for the ProductDetail screen props
type ProductDetailScreenProps = StackScreenProps<RootStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
    const { productId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Product Detail</Text>
            <Text style={styles.subtitle}>Product ID: {productId}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 18, marginTop: 10 },
});

export default ProductDetailScreen;
