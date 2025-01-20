import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import api from '../services/api';

// Define Category type
type Category = 'Electronics' | 'Mobile' | 'Accessories';

// Extend Product type to include category
export type Product = {
  id: number;
  name: string;
  category: Category;
  primaryImage: string;
};

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories,setCategories] = useState<(Category | 'All')[]>(['All', 'Electronics', 'Mobile', 'Accessories']);
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>('All');

  const { width, height } = Dimensions.get('window');
  const isPortrait = height > width;

  useEffect(() => {
    fetchProducts();

  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products');
      const fetchedProducts: Product[] = response.data;
      setProducts(fetchedProducts);
      const uniqueCategories = [
        'All',
        ...new Set(fetchedProducts.map((product) => product.category.name)),
      ];
      setCategories(uniqueCategories);
  
      // Log categories after setting products
      console.log('Product categories:', fetchedProducts.map((product) => product.category));
    } catch (error: any) {
      console.error('Error fetching products:', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCategorySelect = (category: 'All' | Category) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
  selectedCategory === 'All'
    ? products
    : products.filter(
        (product) =>
          product.category.name.toLowerCase() === selectedCategory.toLowerCase()
      );


  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.card, { height: isPortrait ? 160 : 200 }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.primaryImage }} style={styles.image} />
        <Ionicons name="heart-outline" size={20} color="#f00" style={styles.favoriteIcon} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.name}
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
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Home</Text>

      {/* Category Filter */}
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item}
        renderItem={renderCategory}
        showsHorizontalScrollIndicator={false}
        style={[styles.categoryList, { marginBottom: isPortrait ? 1 : 16 }]}
      />

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={3}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.productList, { paddingTop: isPortrait ? 0 : 10 }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 16 },

  // Category list styling
  categoryList: {
    marginTop: 0,
    height: 0,
    marginBottom: 0,
  },

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

  selectedCategoryButton: {
    backgroundColor: '#333',
  },

  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },

  selectedCategoryText: {
    color: '#fff',
  },

  // Product grid styling
  productList: {
    paddingBottom: 16,
    marginTop: 0,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 40,
    marginTop: 0,
  },

  card: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'hidden',
  },

  imageContainer: {
    width: '100%',
    height: '65%',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  },

  image: { width: '100%', height: '100%', resizeMode: 'contain' },

  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },

  title: {
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 10,
    marginTop: 5,
    color: '#333',
  },

  price: {
    fontSize: 12,
    fontWeight: '500',
    marginHorizontal: 10,
    marginBottom: 10,
    color: '#f00',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
