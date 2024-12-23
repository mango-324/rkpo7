import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>{product.price} руб.</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
        <Text style={styles.buttonText}>Добавить в корзину</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
	width: 300,
    backgroundColor: '#fff',
	marginRight: 10,
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: '#f2a474',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#171717',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
    marginVertical: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#171717',
    marginVertical: 2,
  },
  addButton: {
    marginTop: 5,
    backgroundColor: '#eb8d19',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default ProductCard;
