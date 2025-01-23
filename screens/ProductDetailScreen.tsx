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

const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [cacheBustedImages, setCacheBustedImages] = useState<string[]>([]);
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
      } catch (error: any) {
        console.error('Error fetching product details:', error.message);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Generate cache-busted URLs when the selected variant changes
  useEffect(() => {
    if (selectedVariant) {
      const updatedImages = selectedVariant.images.map(
        (url) => `${url}?timestamp=${new Date().getTime()}`
      );
      setCacheBustedImages(updatedImages);
      setCurrentImageIndex(0); // Reset the image index when variant changes
    }
  }, [selectedVariant]);

  const handleNextImage = () => {
    if (cacheBustedImages.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === cacheBustedImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePreviousImage = () => {
    if (cacheBustedImages.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? cacheBustedImages.length - 1 : prevIndex - 1
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

  return (
      <View style={styles.container}>
      {/* Header with Cart Button */}
      <View style={styles.headerContainer}>
  <Text style={styles.hierarchyText}>
    {`${product.name} > ${selectedVariant?.name.replace(product.name, '').trim()}`}
  </Text>
  <TouchableOpacity
    style={styles.cartButton}
    onPress={() => navigation.navigate('Cart')}
  >
    <Image
      source={require('../assets/cart.png')} // Ensure cart.png is in your assets folder
      style={styles.cartIcon}
    />
  </TouchableOpacity>
</View>



      {isPortrait ? (
        <>
          <View style={styles.carouselContainer}>
            <TouchableOpacity onPress={handlePreviousImage} style={styles.carouselButton}>
              <Text style={styles.carouselButtonText}>‹</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: cacheBustedImages[currentImageIndex] }}
              style={styles.carouselImage}
            />
            <TouchableOpacity onPress={handleNextImage} style={styles.carouselButton}>
              <Text style={styles.carouselButtonText}>›</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>{product.name}</Text>
            <View>
              <Text style={styles.description} numberOfLines={isExpanded ? undefined : 2}>
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
                  onPress={() => setSelectedVariant(variant)}
                >
                  <Image source={{ uri: variant.variantImage }} style={styles.variantImage} />
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
        <View style={styles.landscapeContainer}>
  {/* Left Section: Image Carousel */}
  <View style={styles.landscapeCarouselContainer}>
    <TouchableOpacity onPress={handlePreviousImage} style={styles.carouselButton}>
      <Text style={styles.carouselButtonText}>‹</Text>
    </TouchableOpacity>
    <Image
      source={{ uri: cacheBustedImages[currentImageIndex] }}
      style={styles.carouselImageLandscape}
    />
    <TouchableOpacity onPress={handleNextImage} style={styles.carouselButton}>
      <Text style={styles.carouselButtonText}>›</Text>
    </TouchableOpacity>
  </View>

  {/* Right Section: Product Details */}
  <ScrollView contentContainerStyle={styles.landscapeDetailsContainer}>
    <Text style={styles.title}>{product.name}</Text>
    <View>
      <Text style={styles.description} numberOfLines={isExpanded ? undefined : 3}>
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
            selectedVariant?.sku === variant.sku && styles.selectedVariantButton,
          ]}
          onPress={() => setSelectedVariant(variant)}
        >
          <Image source={{ uri: variant.variantImage }} style={styles.variantImage} />
          <Text style={styles.variantText}>{variant.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={styles.priceContainer}>
      <Text style={styles.price}>${selectedVariant?.price.toFixed(2)}</Text>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  header: { fontSize: 24, fontWeight: 'bold' },
  cartButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  cartIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  landscapeContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  landscapeCarouselContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  landscapeDetailsContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  carouselImageLandscape: {
    width: '90%',
    height: 200,
    resizeMode: 'contain',
  },
  hierarchyText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Ensures the text takes available space
    marginRight: 10,
    color: '#333',
  },
  
  
});

export default ProductDetailScreen;
