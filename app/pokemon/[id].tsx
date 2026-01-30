import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const POKEAPI_GRAPHQL = "https://graphql.pokeapi.co/v1beta2";

export default function PokemonDetails() {
    const { id } = useLocalSearchParams();
    const [pokemon, setPokemon] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showBack, setShowBack] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Funkcja sprawdzająca status w AsyncStorage
    const checkIfFavorite = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favorite_pokemons');
            const favorites = jsonValue != null ? JSON.parse(jsonValue) : [];

            const found = favorites.some((p: any) => p.id === parseInt(id as string));
            setIsFavorite(found);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        checkIfFavorite();
    }, [id]);


    useEffect(() => {
        const interval = setInterval(() => {
            setShowBack(prev => !prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const query = `
          query GetPokemonDetail {
            pokemon(where: {id: {_eq: ${id}}}) {
              id
              name
              pokemonstats {
                base_stat
              }
              height
              weight
              pokemonsprites {
                sprites
              }
            }
          }
        `;

        fetch(POKEAPI_GRAPHQL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        })
            .then(res => res.json())
            .then(result => {
                setPokemon(result.data.pokemon[0]);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    const toggleFavorite = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favorite_pokemons');
            let favorites = jsonValue != null ? JSON.parse(jsonValue) : [];

            if (isFavorite) {
                favorites = favorites.filter((p: any) => p.id !== pokemon.id);
            } else {
                favorites.push(pokemon);
            }

            await AsyncStorage.setItem('favorite_pokemons', JSON.stringify(favorites));
            setIsFavorite(!isFavorite);
        } catch (e) {
            console.error("Error", e);
        }
    };

    if (loading || !pokemon) return <ActivityIndicator style={styles.center} color={Colors.yellow} />;

    const sprites = pokemon.pokemonsprites[0].sprites;
    const imageUrl = sprites.back_default;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{
                title: pokemon.name.toUpperCase(),
                headerTitleStyle: { fontFamily: 'PixelFont', color: Colors.yellow },
                headerStyle: { backgroundColor: Colors.red }
            }} />

            <View style={styles.card}>
                <Image
                    source={{ uri: showBack ? sprites.back_default : sprites.front_default }}
                    style={styles.image}
                />
                <Text style={[styles.text, styles.name]}>{pokemon.name.toUpperCase()}</Text>

                <View style={styles.stats}>
                    <Text style={styles.text}>Stats: {pokemon.pokemonstats[0].base_stat}</Text>
                    <Text style={styles.text}>Height: {pokemon.height}</Text>
                    <Text style={styles.text}>Weight: {pokemon.weight}</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={toggleFavorite}>
                    <Ionicons name="heart" size={40} color={isFavorite ? "gray" : Colors.red} />
                    <Text style={[styles.text, styles.buttonText]}>{isFavorite ? "REMOVE FROM FAVORITES" : "ADD TO FAVORITES"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.red, padding: 20 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: {
        backgroundColor: Colors.blue,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        elevation: 5
    },
    image: { width: 200, height: 200 },
    text: {
        fontFamily: 'PixelFont',
        color: Colors.yellow,
    },
    name: { fontSize: 20, marginVertical: 10 },
    stats: { marginVertical: 20, alignItems: 'center' },
    button: {
        backgroundColor: Colors.yellow,
        padding: 8,
        borderRadius: 10,
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: { color: Colors.blue, fontSize: 12, paddingTop: 5 }
});