import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import CartItem from '../components/CartItem';
import ProductCard from '../components/ProductCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = ({navigation}) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'Чай Чёрный Ассам',
            description: 'Упаковка 300 г чая чёрного, сорт классический ассам, вкус насыщенный, крепкий и терпкий, страна производства Индия',
            price: 410
        },
        {
            id: 2,
            name: 'Чай Зелёный Улун',
            description: 'Упаковка 200 г чая зелёного, сорт молочный улун, вкус нежный, молочный и сливочный, страна производства Китай',
            price: 460
        },
        {
            id: 3,
            name: 'Чай Чёрный Эрл Грей',
            description: 'Упаковка 400 г чая чёрного, сорт Эрл Грей с бергамотом, вкус терпкий, насыщенный и цитрусовый, страна производства Индия',
            price: 290
        },
        {
            id: 4,
            name: 'Чай Красный Каркаде',
            description: 'Упаковка 300 г чая красного, сорт фруктовый каркаде, вкус сладкий и кисловатый, страна производства Япония',
            price: 310
        },
    ]);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            const savedCart = await AsyncStorage.getItem('cart');
            const savedWishlist = await AsyncStorage.getItem('wishlist');
            const savedProducts = await AsyncStorage.getItem('products');
            const savedDiscount = await AsyncStorage.getItem('discount');

            if (savedCart) setCart(JSON.parse(savedCart));
            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
            if (savedProducts && (savedWishlist || savedCart)) setProducts(JSON.parse(savedProducts));
            if (savedDiscount) setDiscount(parseFloat(savedDiscount));
        };

        loadData();
    }, []);

    useEffect(() => {
        const saveData = async () => {
            await AsyncStorage.setItem('cart', JSON.stringify(cart));
            await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
            await AsyncStorage.setItem('products', JSON.stringify(products));
            await AsyncStorage.setItem('discount', JSON.stringify(discount));
        };

        saveData();
    }, [cart, wishlist, products, discount]);

    const applyPromoCode = () => {
        switch (promoCode.trim()) {
            case 'promokod15':
                setDiscount(0.15);
                alert('Применён промокод на скидку 15%');
                break;
            case 'promokod30':
                setDiscount(0.3);
                alert('Применён промокод на скидку 30%');
                break;
            case 'del':
                setDiscount(0);
                alert('Скидка отменена');
                break;
            default:
                alert('Неверный промокод');
        }
    };

    const moveToCart = (product, fromWishlist = false) => {
        setCart([...cart, {...product, quantity: 1}]);
        if (fromWishlist) {
            setWishlist(wishlist.filter((item) => item.id !== product.id));
        } else {
            setProducts(products.filter((item) => item.id !== product.id));
        }
    };

    const moveToWishlist = (item) => {
        setCart(cart.filter((cartItem) => cartItem.id !== item.id));
        setWishlist([...wishlist, item]);
    };

    const deleteItem = (id, fromWishlist = false) => {
        if (fromWishlist) {
            const itemToDelete = wishlist.find((item) => item.id === id);
            if (itemToDelete) {
                setWishlist(wishlist.filter((item) => item.id !== id));
                setProducts([...products, itemToDelete]);
            }
        } else {
            const itemToDelete = cart.find((item) => item.id === id);
            if (itemToDelete) {
                setCart(cart.filter((item) => item.id !== id));
                setProducts([...products, itemToDelete]);
            }
        }
    };

    const increaseQuantity = (id) => {
        setCart(cart.map((item) =>
            item.id === id ? {...item, quantity: item.quantity + 1} : item
        ));
    };

    const decreaseQuantity = (id) => {
        setCart(cart.map((item) =>
            item.id === id && item.quantity > 1
                ? {...item, quantity: item.quantity - 1}
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * (1 - discount);
    };

    // Отправка запроса оформления заказа
    const handlePlaceOrder = async () => {
        const transformedCart = [];
        const cartMap = new Map();

        for (const item of cart) {
            const id = parseInt(item.id);
            if (cartMap.has(id)) {
                cartMap.set(id, cartMap.get(id) + item.quantity);
            } else {
                cartMap.set(id, item.quantity);
            }
        }

        for (const [id, quantity] of cartMap) {
            transformedCart.push({id, quantity});
        }

        const total = calculateTotal();

        const orderData = {
            userId: 1,
            products: transformedCart,
        };

        try {
            const response = await fetch("https://dummyjson.com/carts/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            console.log("Код состояния ответа:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage =
                    errorData.message || `Ошибка. Статус: ${response.status}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Заказ оформлен!", `Номер заказа: ${data.id}`);
            Alert.alert("Заказ оформлен!", `Номер заказа: ${data.id}`);
            navigation.navigate('Заказ', { orderId: data.id, total: total });

        } catch (error) {
            Alert.alert("Ошибка при оформлении заказа", error.message);
            console.error("Ошибка при оформлении заказа:", error);
        }
    };

    return (
        <FlatList
            data={[{key: 'mainContent'}]}
            keyExtractor={(item) => item.key}
            contentContainerStyle={styles.scrollView}
            renderItem={() => (
                <View style={styles.container}>

                    <Text style={styles.sectionHeader}>Товары, рекомендованные для Вас</Text>
                    <View style={styles.productsContainer}>
                        <FlatList
                            data={products}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.container}
                            renderItem={({item}) => (
                                <ProductCard
                                    product={item}
                                    onAddToCart={() => moveToCart(item)}
                                />
                            )}
                        />
                    </View>

                    <Text style={styles.sectionHeader}>Промокод</Text>
                    <View style={styles.promoCodeContainer}>
                        <TextInput
                            style={[styles.input, styles.promoCodeInput]}
                            placeholder="Введите промокод..."
                            placeholderTextColor='#6c757d'
                            value={promoCode}
                            onChangeText={setPromoCode}
                        />
                        <TouchableOpacity style={styles.applyButton} onPress={applyPromoCode}>
                            <Text style={styles.buttonText}>Применить</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionHeader}>Корзина</Text>
                    <View style={styles.cartContainer}>
                        <DraggableFlatList
                            data={cart}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item, drag}) => (
                                <CartItem
                                    item={item}
                                    onDelete={() => deleteItem(item.id)}
                                    onIncrease={() => increaseQuantity(item.id)}
                                    onDecrease={() => decreaseQuantity(item.id)}
                                    onMoveToWishlist={() => moveToWishlist(item)}
                                />
                            )}
                            onDragEnd={({data}) => setCart(data)}
                        />
                    </View>

                    <Text style={styles.sectionHeader}>Отложенные товары</Text>
                    <View style={styles.wishlistContainer}>
                        <DraggableFlatList
                            data={wishlist}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item, drag}) => (
                                <CartItem
                                    item={item}
                                    onDelete={() => deleteItem(item.id, true)}
                                    onMoveToCart={() => moveToCart(item, true)}
                                />
                            )}
                            onDragEnd={({data}) => setWishlist(data)}
                        />
                    </View>

                    <Text style={styles.total}>
                        Итоговая стоимость: {calculateTotal().toFixed(2)} руб.
                    </Text>

                    <TouchableOpacity style={styles.orderButton} onPress={handlePlaceOrder}>
                        <Text style={styles.buttonText}>Оформить заказ</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#171717',
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
        color: '#171717',
    },
    productsContainer: {
        minHeight: 150,
        backgroundColor: '#fcdfcc',
        borderColor: '#f2a474',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
    },
    cartContainer: {
        minHeight: 220,
        backgroundColor: '#f0c3a8',
        borderColor: '#f2a474',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 0,
    },
    wishlistContainer: {
        minHeight: 220,
        backgroundColor: '#f0c3a8',
        borderColor: '#f2a474',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 0,
    },
    promoCodeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 0,
    },
    promoCodeInput: {
        flex: 1,
        marginRight: 4,
        backgroundColor: '#fff',
        borderColor: '#f2a474',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    },
    applyButton: {
        backgroundColor: '#f2a474',
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    orderButton: {
        marginTop: 20,
        backgroundColor: '#eb8d19',
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 20,
    }
});

export default Cart;
