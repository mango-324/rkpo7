import React, {useState} from "react";
import {Button, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useRoute} from "@react-navigation/native";
import MapWithDraggableMarker from "../components/Map";

const Order = ({navigation}) => {
    const route = useRoute()
    const orderId = route.params?.orderId;
    const total = route.params?.total;

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [coordinates, setCoordinates] = useState({
        latitude: 55.75222,
        longitude: 37.61556,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });

    // Handler для выбора даты
    const onChangeDatepicker = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === "ios");
        setDate(currentDate);
    };

    const [selectedAddress, setSelectedAddress] = useState('');

    const handleAddressChange = (newAddress) => {
        setSelectedAddress(newAddress); // Обновляем адрес в родительском компоненте
    };

    // Подтверждение заказа
    const handleConfirmOrder = async () => {
        // Необходимые данные заказа
        const orderData = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            total: total,
            orderId: orderId,
            deliveryDate: date.toISOString(),
            deliveryAddress: selectedAddress,
        };

        console.log("orderData:", orderData);

        // Запись заказа в AsyncStorage
        try {
            const jsonValue = await AsyncStorage.getItem("@orders");
            let orders = jsonValue != null ? JSON.parse(jsonValue) : [];
            orders.push(orderData);
            const jsonValue2 = JSON.stringify(orders);
            await AsyncStorage.setItem("@orders", jsonValue2);
        } catch (e) {
            console.error("Ошибка сохранения заказа:", e);
        }

        navigation.navigate("История заказов");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.total}>Номер Вашего заказа: {orderId}</Text>

            <View style={styles.dateSection}>
                <TouchableOpacity style={styles.selectDateButton} onPress={() => setShow(true)}>
                    <Text style={styles.buttonText}>Выбрать дату доставки</Text>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            onChange={onChangeDatepicker}
                        />
                    )}
                </TouchableOpacity>
                <Text style={styles.totalDelivery}> Дата доставки: {date.toLocaleDateString()}</Text>
            </View>
            <MapWithDraggableMarker onAddressChange={handleAddressChange}/>

            <TouchableOpacity style={styles.confirmOrderButton} onPress={handleConfirmOrder}>
                <Text style={styles.buttonText}>Подтвердить заказ</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginVertical: 60,
    },
    map: {
        width: 300,
        height: 300,
        marginVertical: 50,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: 200,
        marginVertical: 10,
    },
    dateSection: {
        marginVertical: 10,
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        color: '#171717',
    },
    totalDelivery: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        color: '#171717',
    },
    confirmOrderButton: {
        marginTop: 20,
        backgroundColor: '#eb8d19',
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 20,
    },
    selectDateButton: {
        marginTop: 20,
        backgroundColor: '#eb8d19',
        borderRadius: 5,
        paddingVertical: 4,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
    },
});

export default Order;
