import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';


// Define type for stack parameters
export type RootStackParamList = {
    Home: undefined; // No parameters for Home screen
    ProductDetail: { productId: number }; // ProductDetail requires a productId parameter
    Cart: undefined;
};


// Create Stack Navigator with proper typing
const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ title: 'TechnoTrove' }} // Set title for Home screen
                />
                <Stack.Screen 
                    name="ProductDetail" 
                    component={ProductDetailScreen} 
                    options={{ title: 'TechnoTrove' }} // Set title for ProductDetail screen
                />
                <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
