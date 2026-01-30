import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const POKEAPI_GRAPHQL = "https://graphql.pokeapi.co/v1beta2";

const fetchRandomPokemon = async (id: number) => {
    const query = `
    query GetRandomPokemon($id: Int!) {
      pokemon(where: {id: {_eq: $id}}) {
        id
        name
        pokemonsprites {
          sprites
        }
        pokemontypes {
            type {
            name
          }
        }
      }
    }
  `;

    try {
        const response = await fetch(POKEAPI_GRAPHQL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query,
                variables: { id },
            }),
        });

        const result = await response.json();
        console.log("Fetched Pokemon:", result);
        return result.data.pokemon[0];
    } catch (error) {
        console.error("Error fetching random Pokemon:", error);
        return null;
    }
};

export default function MapScreen() {

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsAt={-1}
                appearsAt={0}
                opacity={0.3}
            />
        ),
        []
    );
    const [markers, setMarkers] = useState<any[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<any>(null);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);

    const handleLongPress = async (e: any) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        const randomId = Math.floor(Math.random() * 1025) + 1;

        const pokemon = await fetchRandomPokemon(randomId);

        const newMarker = {
            id: Date.now(),
            latitude,
            longitude,
            pokemon
        };

        setMarkers([...markers, newMarker]);
    };

    const handleMarkerPress = (pokemon: any) => {
        setSelectedPokemon(pokemon);
        bottomSheetRef.current?.expand();
    };


    console.log(selectedPokemon?.pokemonsprites[0].sprites.front_default);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                onLongPress={handleLongPress}
                initialRegion={{
                    latitude: 52.2297,
                    longitude: 21.0122,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        onPress={() => handleMarkerPress(marker.pokemon)}
                    />
                ))}
            </MapView>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
            >
                <BottomSheetView style={styles.sheetContent}>
                    {selectedPokemon ? (
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.pokemonName}>{`A wild ${selectedPokemon.name} appeared!`.toUpperCase()}</Text>
                            <Image
                                source={{ uri: selectedPokemon.pokemonsprites[0].sprites.front_default }}
                                style={styles.sheetImage}
                            />
                        </View>
                    ) : (
                        <Text>Select a Pokemon from the map</Text>
                    )}
                </BottomSheetView>
            </BottomSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { ...StyleSheet.absoluteFillObject },
    sheetContent: { flex: 1, alignItems: 'center', padding: 20, justifyContent: 'center' },
    pokemonName: { fontSize: 24, fontFamily: 'PixelFont' },
    sheetImage: { width: 250, height: 250 }
});