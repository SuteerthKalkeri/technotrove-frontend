import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type ProductDetailScreenProps = StackScreenProps<RootStackParamList, 'ProductDetail'>;

type Variant = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  variantImage: string;
  images: string[];
};

type ProductDetail = {
  id: number;
  name: string;
  description: string;
  primaryImage: string;
  productVariants: Variant[];
};

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    // Fetch product details from API
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/api/products/${productId}`);
        setProduct(response.data);
        setSelectedVariant(response.data.productVariants[0]); // Set the first variant as the default
      } catch (error: any) {
        console.error('Error fetching product details:', error.message);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product || !selectedVariant) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Image Carousel */}
      <FlatList
        data={selectedVariant.images}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.carouselImage} />
        )}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        style={styles.carousel}
      />

      {/* Product Name and Description */}
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>

      {/* SKU Selector */}
      <Text style={styles.skuTitle}>Available Variants:</Text>
      <FlatList
        data={product.productVariants}
        horizontal
        keyExtractor={(item) => item.sku}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.variantButton,
              selectedVariant.sku === item.sku && styles.selectedVariantButton,
            ]}
            onPress={() => setSelectedVariant(item)}
          >
            <Image source={{ uri: item.variantImage }} style={styles.variantImage} />
            <Text style={styles.variantText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />

      {/* Selected Variant Details */}
      <View style={styles.variantDetails}>
        <Text style={styles.price}>${selectedVariant.price.toFixed(2)}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  carousel: { marginBottom: 16 },
  carouselImage: { width: 300, height: 200, resizeMode: 'contain', marginHorizontal: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  description: { fontSize: 16, color: '#555', marginBottom: 16 },
  skuTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
  variantButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginRight: 10,
    padding: 10,
    alignItems: 'center',
  },
  selectedVariantButton: { borderColor: '#f90', backgroundColor: '#fff8e7' },
  variantImage: { width: 60, height: 60, resizeMode: 'contain' },
  variantText: { fontSize: 12, textAlign: 'center', marginTop: 4 },
  variantDetails: { marginTop: 16, alignItems: 'center' },
  price: { fontSize: 22, fontWeight: 'bold', color: '#000', marginTop: 8 },
});

export default ProductDetailScreen;
