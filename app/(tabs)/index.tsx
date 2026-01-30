import { Colors } from '@/constants/colors';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

const POKEAPI_GRAPHQL = "https://graphql.pokeapi.co/v1beta2";

export default function HomeScreen() {
    const [pokemons, setPokemons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [offset, setOffset] = useState(0);
    const router = useRouter();

    const LIMIT = 20;

    const fetchPokemons = async (newOffset: number, isRefreshing = false) => {
        const query = `
      query GetPokemons {
        pokemon(limit: ${LIMIT}, offset: ${newOffset}) {
          id
          name
          pokemonsprites {
            sprites
          }
        }
      }
    `;

        try {
            const res = await fetch(POKEAPI_GRAPHQL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const result = await res.json();
            const newItems = result.data.pokemon;
            setPokemons(prev => isRefreshing ? newItems : [...prev, ...newItems]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchPokemons(0); }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        setOffset(0);
        fetchPokemons(0, true);
    };

    const handleLoadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        fetchPokemons(nextOffset);
    };

    if (loading && offset === 0) {
        return <ActivityIndicator size="large" color={Colors.yellow} style={styles.center} />;
    }

    return (
        <FlatList
            data={pokemons}
            contentContainerStyle={styles.container}
            keyExtractor={(item) => item.id.toString()}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => (
                <ActivityIndicator color={Colors.yellow} style={{ margin: 20 }} />
            )}
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
                        <Text style={{ color: 'white', fontFamily: 'PixelFont', paddingTop: 10 }}>{'>>>'}</Text>
                    </TouchableOpacity>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: Colors.darkRed },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.blue,
        marginHorizontal: 16,
        marginVertical: 6,
        paddingRight: 30,
        paddingLeft: 30,
    },
    center: { flex: 1, justifyContent: 'center' },
    image: { width: 70, height: 70, marginRight: 15 },
    name: { fontSize: 16, textTransform: 'capitalize', color: Colors.yellow, fontFamily: 'PixelFont', paddingTop: 10, }
});