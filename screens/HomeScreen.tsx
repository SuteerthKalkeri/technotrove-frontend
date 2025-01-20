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

      // Generate unique category names dynamically
      const uniqueCategories = [
        'All',
        ...new Set(fetchedProducts.map((product) => product.category.name)),
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

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((product) => product.category.name === selectedCategory);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={[styles.card, isPortrait ? styles.portraitCard : styles.landscapeCard]}
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
      <View style={styles.container}>
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
        style={[styles.categoryList, isPortrait ? styles.portraitCategoryList : styles.landscapeCategoryList]}
      />

      {/* Product Grid */}
      <FlatList
  key={isPortrait ? 'portrait' : 'landscape'} // Fix: Ensure FlatList re-renders on orientation change
  data={filteredProducts}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderProduct}
  numColumns={isPortrait ? 3 : 5} // Adjust number of columns based on orientation
  columnWrapperStyle={styles.row}
  showsVerticalScrollIndicator={false}
  contentContainerStyle={[
    styles.productList,
    isPortrait ? styles.portraitProductList : styles.landscapeProductList,
  ]}
/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 10 },
  header: { fontSize: 24, fontWeight: 'bold', marginVertical: 16 },

  // Category list styling
  categoryList: {
    marginBottom: 16,
    height: 50,
  },
  portraitCategoryList: {
    marginBottom: 0,
  },
  landscapeCategoryList: {
    marginBottom: 10,
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
  },
  portraitProductList: {
    marginTop: 16,
  },
  landscapeProductList: {
    marginTop: 32,
  },

  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
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
  portraitCard: {
    height: 160,
  },
  landscapeCard: {
    height: 120,
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
