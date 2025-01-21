import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import api from '../services/api';

type ProductDetailScreenProps = StackScreenProps<RootStackParamList, 'ProductDetail'>;

type Variant = {
  sku: string;
  name: string;
  price: number;
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await api.get(`/api/products/${productId}`);
        const productData: ProductDetail = response.data;

        const sortedVariants = productData.productVariants.sort((a, b) => a.price - b.price);
        setProduct({ ...productData, productVariants: sortedVariants });
        setSelectedVariant(sortedVariants[0]);
        setCurrentImageIndex(0);
      } catch (error: any) {
        console.error('Error fetching product details:', error.message);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleNextImage = () => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedVariant.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePreviousImage = () => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? selectedVariant.images.length - 1 : prevIndex - 1
      );
    }
  };

  const toggleDescription = () => setIsExpanded((prev) => !prev);

  if (!product || !selectedVariant) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading product details...</Text>
      </View>
    );
  }

  const getCacheBustedUrl = (url: string) => `${url}?timestamp=${new Date().getTime()}`;

  return (
    <View style={styles.container}>
      {isPortrait ? (
        // Portrait Layout
        <>
          <View style={styles.carouselContainer}>
            <TouchableOpacity onPress={handlePreviousImage} style={styles.carouselButton}>
              <Text style={styles.carouselButtonText}>‹</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: getCacheBustedUrl(selectedVariant.images[currentImageIndex]) }}
              style={styles.carouselImage}
            />
            <TouchableOpacity onPress={handleNextImage} style={styles.carouselButton}>
              <Text style={styles.carouselButtonText}>›</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>{product.name}</Text>
            <View>
              <Text
                style={styles.description}
                numberOfLines={isExpanded ? undefined : 2}
              >
                {product.description}
              </Text>
              {product.description.length > 100 && (
                <TouchableOpacity onPress={toggleDescription}>
                  <Text style={styles.readMoreButton}>
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.skuTitle}>Available Variants:</Text>
            <View style={styles.skuContainer}>
              {product.productVariants.map((variant) => (
                <TouchableOpacity
                  key={variant.sku}
                  style={[
                    styles.variantButton,
                    selectedVariant.sku === variant.sku && styles.selectedVariantButton,
                  ]}
                  onPress={() => {
                    setSelectedVariant(variant);
                    setCurrentImageIndex(0);
                  }}
                >
                  <Image
                    source={{ uri: getCacheBustedUrl(variant.variantImage) }}
                    style={styles.variantImage}
                  />
                  <Text style={styles.variantText}>{variant.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${selectedVariant.price.toFixed(2)}</Text>
          </View>
        </>
      ) : (
        // Landscape Layout
        <View style={styles.landscapeContainer}>
          <View style={styles.landscapeCarousel}>
            <TouchableOpacity onPress={handlePreviousImage} style={styles.carouselButton}>
              <Text style={styles.carouselButtonText}>‹</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: getCacheBustedUrl(selectedVariant.images[currentImageIndex]) }}
              style={[styles.carouselImage, { width: '90%' }]}
            />
            <TouchableOpacity onPress={handleNextImage} style={styles.carouselButton}>
              <Text style={styles.carouselButtonText}>›</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.landscapeDetails}>
            <Text style={styles.title}>{product.name}</Text>
            <View>
              <Text
                style={styles.description}
                numberOfLines={isExpanded ? undefined : 2}
              >
                {product.description}
              </Text>
              {product.description.length > 100 && (
                <TouchableOpacity onPress={toggleDescription}>
                  <Text style={styles.readMoreButton}>
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.skuTitle}>Available Variants:</Text>
            <View style={styles.skuContainer}>
              {product.productVariants.map((variant) => (
                <TouchableOpacity
                  key={variant.sku}
                  style={[
                    styles.variantButton,
                    selectedVariant.sku === variant.sku && styles.selectedVariantButton,
                  ]}
                  onPress={() => {
                    setSelectedVariant(variant);
                    setCurrentImageIndex(0);
                  }}
                >
                  <Image
                    source={{ uri: getCacheBustedUrl(variant.variantImage) }}
                    style={styles.variantImage}
                  />
                  <Text style={styles.variantText}>{variant.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  landscapeCarousel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  landscapeDetails: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  carouselButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  carouselButtonText: { fontSize: 24, fontWeight: 'bold' },
  carouselImage: { width: 300, height: 200, resizeMode: 'contain' },
  scrollContainer: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  description: { fontSize: 16, color: '#555', marginBottom: 4 },
  readMoreButton: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  skuTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 8 },
  skuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  variantButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    margin: 5,
    padding: 8,
    width: 100,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedVariantButton: { borderColor: '#f90', backgroundColor: '#fff8e7' },
  variantImage: { width: 50, height: 50, resizeMode: 'contain' },
  variantText: { fontSize: 13, textAlign: 'center', marginTop: 4 },
  priceContainer: {
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  price: { fontSize: 22, fontWeight: 'bold', color: '#000' },
});

export default ProductDetailScreen;
