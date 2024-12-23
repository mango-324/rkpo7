import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Cart from './pages/Cart';
import Order from "./pages/Order";
import {NavigationContainer} from "@react-navigation/native";
import {SafeAreaView, StyleSheet} from "react-native";
import OrderHistory from "./pages/OrderHistory";

const Stack = createNativeStackNavigator()

export function MyStack() {
  return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen name="Корзина" component={Cart} options={{headerShown:false}}/>
              <Stack.Screen name="Заказ" component={Order} />
              <Stack.Screen name="История заказов" component={OrderHistory} />
          </Stack.Navigator>
      </NavigationContainer>
  );
}

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaView style={styles.container}>
        <MyStack/>
    </SafeAreaView>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: '#f9f7f3',
  },
});

export default App;
