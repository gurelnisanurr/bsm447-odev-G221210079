import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, Pressable, ActivityIndicator, TextInput, ScrollView, StyleSheet,
} from 'react-native';
import { loadRecent, addRecent } from '../storage';

const API_URL = 'https://dummyjson.com/products/category/kitchen-accessories';

export default function ListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.log('Veri çekilemedi:', err);
        setLoading(false);
      });
    loadRecent().then(setRecent);
  }, []);

  async function runSearch(term) {
    setQuery(term);
    const next = await addRecent(term);
    setRecent(next);
  }

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Yükleniyor…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.search}
        placeholder="Ürün ara"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={(e) => runSearch(e.nativeEvent.text)}
        returnKeyType="search"
      />

      {recent.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {recent.map((term) => (
            <Pressable key={term} style={styles.chip} onPress={() => runSearch(term)}>
              <Text>{term}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.empty}>Sonuç bulunamadı</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('Detay', { item })}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            <View style={styles.texts}>
              <Text style={styles.title}>{item.title}</Text>
              <Text>{item.price} $</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  search: { margin: 12, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  chipRow: { paddingHorizontal: 12, marginBottom: 8, maxHeight: 40 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderRadius: 16, backgroundColor: '#e3e3e3' },
  row: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  thumb: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
  texts: { flex: 1 },
  title: { fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40 },
});