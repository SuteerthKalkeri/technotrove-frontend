import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import api from '../services/api';
import { ScrollView } from 'react-native-gesture-handler';

type Category = 'Electronics' | 'Mobile' | 'Accessories' | 'Favorites';

export type Product = {
  id: number;
  name: string;
  category: {
    id: number;
    name: Category;
  };
  primaryImage: string;
};

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<(Category | 'All')[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');
  const [favorites, setFavorites] = useState<number[]>([]);

  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      const fetchedProducts: Product[] = response.data;

      const productsWithPrices = fetchedProducts.map((product) => {
        const lowestPrice = product.productVariants?.reduce((minPrice, variant) => {
          return variant.price < minPrice ? variant.price : minPrice;
        }, Infinity);
        return { ...product, lowestPrice };
      });

      setProducts(productsWithPrices);

      const uniqueCategories = [
        'All',
        ...new Set(fetchedProducts.map((product) => product.category.name)),
        'Favorites', // Add Favorites category
      ];
      setCategories(uniqueCategories);
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: 'All' | Category) => {
    setSelectedCategory(category);
  };

  const handleFavoriteToggle = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const filteredProducts =
    selectedCategory === 'Favorites'
      ? products.filter((product) => favorites.includes(product.id))
      : selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category.name === selectedCategory);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.card, isPortrait ? styles.portraitCard : styles.landscapeCard]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.primaryImage }} style={styles.image} />
        <TouchableOpacity
          style={styles.favoriteIconContainer}
          onPress={() => handleFavoriteToggle(item.id)}
        >
          <Image
            source={
              favorites.includes(item.id)
                ? require('../assets/heart-filled.png') // Path to the filled heart
                : require('../assets/heart-outline.png') // Path to the outlined heart
            }
            style={styles.favoriteIcon}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.price}>
        ${item.lowestPrice?.toFixed(2) ?? 'N/A'}
      </Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategoryButton,
      ]}
      onPress={() => handleCategorySelect(item as 'All' | Category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      {/* Category Filter */}
      <View>
        <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item}
        renderItem={renderCategory}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        />
      </View>
      

      {/* Product Grid */}
      
        <FlatList
        key={isPortrait ? 'portrait' : 'landscape'}
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={isPortrait ? 3 : 5}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
        />
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 16 },
  categoryList: { marginBottom: 16 },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  selectedCategoryButton: { backgroundColor: '#333' },
  categoryText: { fontSize: 14, fontWeight: '500', color: '#333' },
  selectedCategoryText: { color: '#fff' },
  productList: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Align items to the top
    paddingBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap' },
  card: {
    flex: 1,
    marginHorizontal: '1.5%',
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 10,
    flexGrow: 1,
    maxWidth: '31%',
    flexBasis: '30%',
  },
  portraitCard: { height: 200 },
  landscapeCard: { height: 180 },
  imageContainer: {
    width: '100%',
    height: '60%',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: { width: '100%', height: '100%', resizeMode: 'contain' },
  favoriteIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  favoriteIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#333',
    width: '100%',
  },
  price: { fontSize: 16, fontWeight: 'bold', color: '#000', marginTop: 5, textAlign: 'center' },
});

export default HomeScreen;
