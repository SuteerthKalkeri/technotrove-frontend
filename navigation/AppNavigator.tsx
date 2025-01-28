import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import { CartProvider } from '../context/CartContext';



export type RootStackParamList = {
    Home: undefined; 
    ProductDetail: { productId: number }; 
    Cart: undefined;
};



const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <CartProvider>
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ title: 'TechnoTrove' }} 
                />
                <Stack.Screen 
                    name="ProductDetail" 
                    component={ProductDetailScreen} 
                    options={{ title: 'TechnoTrove' }} 
                />
                <Stack.Screen
                    name="Cart"
                    component={CartScreen}
                    options={{ title: 'TechnoTrove' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
        </CartProvider>
    );
}
