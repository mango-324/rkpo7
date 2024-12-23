import React, {useCallback, useEffect, useRef, useState} from "react";
import {StyleSheet, View} from "react-native";
import * as maptilersdk from "@maptiler/sdk"
;
const styles = StyleSheet.create({
    container: {
        position: "relative",
        width: "90vw",
        flex: 1,
        overflow: "hidden",
        marginBottom: 5
    },
    map: {
        flex: 1,
        overflow: "hidden"
    },
    infoContainer: {
        bottom: 20,
        left: 20,
        backgroundColor: 'white',
        padding: 0,
        borderRadius: 5,
    },
    infoText: {
        fontSize: 16,
    },
});


export default function Map({onAddressChange}) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [marker, setMarker] = useState(null);
    const initialRegion = {
        latitude: 55.75222, // Широта Москвы
        longitude: 37.61556, // Долгота Москвы
        latitudeDelta: 0.1, // Увеличение области отображения для Москвы
        longitudeDelta: 0.1, // Увеличение области отображения для Москвы
    };
    const [address, setAddress] = useState('');
    const handleMapClick = useCallback(
        async (e) => {
            const {lng, lat} = e.lngLat;
            /*
            если вдруг поймешь шо делать
            if (marker)
                marker.current.remove()
            setMarker(
                new maptilersdk.Marker()
                    .setLngLat([lng, lat])
                    .addTo(map.current)
            );*/
            try {
                // Reverse geocoding to get address
                const results = await maptilersdk.geocoding.reverse([lng, lat],
                    {
                        language: 'ru',
                    }
                );
                if (results.features && results.features.length > 0) {
                    // Get the first feature's place name
                    const placeName = results.features[0].place_name;
                    setAddress(placeName);
                    onAddressChange?.(placeName);
                } else {
                    setAddress('Адрес не найден');
                    onAddressChange?.('Адрес не найден');
                }
            } catch (error) {
                console.error('Ошибка получения адреса:', error);
                setAddress('Ошибка получения адреса');
                onAddressChange?.('Ошибка получения адреса');
            }
        }
    );
    const zoom = 13;
    maptilersdk.config.apiKey = 'gElDs1NHVVWDBM9wkb5f';
    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
        map.current = new maptilersdk.Map({
            dragRotate: false, // Disable rotation
            touchZoomRotate: true, // Disable zoom and rotate
            scrollZoom: true, // Disable zooming with scroll
            dragPan: true, // Allow dragging the map itself
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: [initialRegion.longitude, initialRegion.latitude],
            zoom: zoom
        });

        map.current.setLanguage(
            maptilersdk.Language['RUSSIAN']
        )

        if (map) {
            map.current.on('click', handleMapClick);
            return () => {
                map.current.off('click', handleMapClick);
            };
        }
    }, [map]);

    return (
        <View style={styles.container}>
            <div ref={mapContainer} id="map" style={
                {
                    height: '100%',
                    width: '100%',
                    position: 'relative'
                }
            }/>
            <View style={styles.infoContainer}>
                <div id="address-display" style={{marginBottom: '10', fontSize: '16px', width: '100%'}}>
                    <strong>Адрес:</strong> {address}
                </div>
            </View>
        </View>
    );
}

