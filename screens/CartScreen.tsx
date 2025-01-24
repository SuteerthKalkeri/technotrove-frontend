import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';

const CartScreen: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useCart();

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.variantImage }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() =>
              item.quantity > 1
                ? updateQuantity(item.sku, item.quantity - 1)
                : removeFromCart(item.sku)
            }
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.sku, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      `Your bill: $${calculateTotal().toFixed(2)}. Thank you for shopping!`
    );
  };

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.sku}
        renderItem={renderCartItem}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  image: { width: 60, height: 60, marginRight: 16, borderRadius: 8 },
  details: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 14, color: '#555' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#ddd',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityButtonText: { fontSize: 18, fontWeight: 'bold' },
  quantityText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  totalContainer: { marginTop: 16, alignItems: 'center' },
  totalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  checkoutButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CartScreen;
