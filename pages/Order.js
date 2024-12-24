import React, {useRef, useState} from "react";
import {Alert, Button, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useRoute} from "@react-navigation/native";
// import MapWithDraggableMarker from "../components/Map";
import MapView, { Marker } from "react-native-maps";
import moment from "moment";
import 'moment/dist/locale/ru';

const Order = ({navigation}) => {
    const route = useRoute()
    const orderId = route.params?.orderId;
    const total = route.params?.total;
    const mapRef = useRef(null);

    const [address, setAddress] = useState('');
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [coordinates, setCoordinates] = useState({
        latitude: 55.75222,
        longitude: 37.61556,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
    });
    // Начальные координаты
    const initialRegion = {
        latitude: 55.75222, // Широта Москвы
        longitude: 37.61556, // Долгота Москвы
        latitudeDelta: 0.1, // Увеличение области отображения для Москвы
        longitudeDelta: 0.1, // Увеличение области отображения для Москвы
    };

    // Handler для выбора даты
    const onChangeDatepicker = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === "ios");
        setDate(currentDate);
    };

    const [selectedAddress, setSelectedAddress] = useState('');

    const getAddress = async (latitude, longitude) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

        try {
            const response = await(await fetch(url, {
                headers: {
                    'User-Agent': 'CartAppLR7/1.0 (mashamango324@gmail.com)',
                    'Accept': 'application/json',
                },
            }));
            const data = await response.json();
            const address = data.display_name;
            console.log(address); // Выводите или используйте адрес
            setAddress(address); // Обновите состояние для отображения
        } catch (error) {
            console.error('Error getting address: ', error);
        }
    };

    // const handleAddressChange = (newAddress) => {
    //     setSelectedAddress(newAddress); // Обновляем адрес в родительском компоненте
    // };
    const onMarkerDragEnd = async (e) => {
        const newCoordinates = {
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
            latitudeDelta: coordinates.latitudeDelta,
            longitudeDelta: coordinates.longitudeDelta,
        };
        setCoordinates(newCoordinates);
    };

    // Подтверждение заказа
    const handleConfirmOrder = async () => {
        // Необходимые данные заказа
        const orderData = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
            total: total,
            orderId: orderId,
            deliveryDate: date.toISOString(),
            // deliveryAddress: selectedAddress,
            deliveryCoordinates: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
            },
            deliveryAddress: address,
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

    moment.locale('ru');

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
                <Text style={styles.totalDelivery}> Дата доставки: {moment(date).format("DD.MM.YYYY")}</Text>
            </View>
             {/*<MapWithDraggableMarker onAddressChange={handleAddressChange}/>*/}
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                ref={mapRef}
                onRegionChangeComplete={(region) => {setCoordinates(region); getAddress(region.latitude, region.longitude);}}
            >
                <Marker
                    coordinate={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                    }}
                    draggable
                    onDragEnd={onMarkerDragEnd}
                />
            </MapView>
            <Text style={styles.totalAddress}>{address}</Text>

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
        marginVertical: 20,
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
        fontSize: 16,
        marginTop: 10,
        marginBottom: 10,
        color: '#171717',
    },
    totalAddress: {
        fontSize: 16,
        marginTop: 3,
        marginBottom: 3,
        color: '#171717',
    },
    confirmOrderButton: {
        marginTop: 20,
        backgroundColor: '#eb8d19',
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingBottom: 7,
        paddingTop: 7,
    },
    selectDateButton: {
        marginTop: 20,
        backgroundColor: '#eb8d19',
        borderRadius: 5,
        paddingBottom: 7,
        paddingTop: 7,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default Order;
