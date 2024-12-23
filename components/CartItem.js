import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CartItem = ({ item, onMoveToCart, onMoveToWishlist, onDelete, onIncrease, onDecrease }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{item.name}</Text>
    <Text style={styles.description}>{item.description}</Text>
    <Text style={styles.price}>Цена за штуку: {item.price} руб.</Text>

    <View style={styles.actions}>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {onMoveToCart && (
        <TouchableOpacity style={styles.moveButton} onPress={onMoveToCart}>
          <Text style={styles.moveButtonText}>В корзину</Text>
        </TouchableOpacity>
      )}
      {onMoveToWishlist && (
        <TouchableOpacity style={styles.moveButton} onPress={onMoveToWishlist}>
          <Text style={styles.moveButtonText}>В отложенные</Text>
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.buttonText}>Удалить</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 5,
	marginTop: 5,
	marginBottom: 5,
	marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#171717',
  },
  description: {
    color: '#171717',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#171717',
  },
  actions: {
    paddingBottom: 4,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f2a474',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  quantity: {
    color: '#171717',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  moveButton: {
    backgroundColor: '#d1c46f',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 30,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ab3727',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 9,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CartItem;
