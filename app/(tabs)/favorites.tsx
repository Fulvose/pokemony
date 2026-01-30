import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any>([]);
  const router = useRouter();

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem('favorite_pokemons');
    setFavorites(data ? JSON.parse(data) : []);
    console.log('Loaded favorites:', data);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nie masz jeszcze ulubionego Pokémona!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      contentContainerStyle={styles.container}
      style={{ backgroundColor: Colors.darkRed }}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const sprites = item.pokemonsprites[0].sprites;
        const imageUrl = typeof sprites === 'string' ? JSON.parse(sprites).front_default : sprites.front_default;

        return (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/pokemon/${item.id}`)}
          >
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
            />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: Colors.darkRed, gap: 20, paddingTop: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 200, height: 200 },
  name: { fontSize: 24, fontWeight: 'bold', fontFamily: 'PixelFont', color: Colors.yellow, textTransform: 'capitalize' },
  card: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.blue,
    width: 350,
    paddingBottom: 20,
  },
});