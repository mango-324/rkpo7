import React, { useState, useEffect } from "react";
import {View, Text, FlatList, StyleSheet, Button, Alert, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Запрос на получение всех заказов пользователя
        const fetchOrders = async () => {
            try {
                const response = await fetch("https://dummyjson.com/carts/user/1");

                console.log("Код состояния ответа:", response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // setOrders(data.carts);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // Получение заказов из AsyncStorage
        AsyncStorage.getItem("@orders")
            .then((ordersJson) => {
                let orders = null;
                console.log(ordersJson);
                if (ordersJson !== null) {
                    orders = JSON.parse(ordersJson);
                }
                console.log("Заказы:", orders);
                setOrders(orders);
            })
            .catch((error) => {
                console.error("Ошибка получения заказов:", error);
            });
    }, []);

    // Удаление заказа из истории
    const handleDeleteOrder = async (orderId) => {
        const response = await fetch(`https://dummyjson.com/carts/1`, {
        method: "DELETE",
    });

        try {
            // Запрос на удаление заказа из истории
            const response = await fetch(`https://dummyjson.com/carts/1`, {
                method: "DELETE",
            });

            console.log("Код состояния ответа:", response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Удаление заказа из стейта
            const updatedOrders = orders.filter(
                (order) => order.id !== orderId
            );
            setOrders(updatedOrders);

            // Запись заказов в AsyncStorage
            await AsyncStorage.setItem(
                "@orders",
                JSON.stringify(updatedOrders)
            );
        } catch (error) {
            Alert.alert(
                "Ошибка",
                "Не удалось удалить заказ. Попробуйте позже."
            );
            console.error("Ошибка удаления заказа:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Загрузка...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Ошибка загрузки заказов: {error.message}</Text>
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.container}>
                <Text>История заказов пуста.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.order}>
                        <Text style={styles.orderText}>ID заказа: {item.orderId}</Text>
                        <Text style={styles.orderText}>Стоимость: {item.total}</Text>
                        <Text style={styles.orderText}>
                            Дата доставки: {moment(item.deliveryDate).format("DD.MM.YYYY")}
                        </Text>
                        {/*<Text style={styles.orderText}>*/}
                        {/*    Место доставки: {item.deliveryAddress}*/}
                        {/*</Text>*/}
                        <Text style={styles.orderText}>
                            Место доставки: {item.deliveryAddress}
                        </Text>

                        <TouchableOpacity style={styles.deleteOrderButton} onPress={() => handleDeleteOrder(item.id)}>
                            <Text style={styles.buttonText}>Удалить заказ</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    order: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteOrderButton: {
        marginTop: 10,
        backgroundColor: '#eb8d19',
        borderRadius: 5,
        paddingBottom: 5,
        paddingTop: 5,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
    productText: {
        fontSize: 14,
        marginLeft: 10,
    },
});

export default OrderHistory;