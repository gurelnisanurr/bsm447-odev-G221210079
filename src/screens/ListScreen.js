import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, Pressable, ActivityIndicator, TextInput, ScrollView,
  RefreshControl, StyleSheet,
} from 'react-native';
import { loadRecent, addRecent } from '../storage';

const API_URL = 'https://dummyjson.com/products/category/kitchen-accessories';

export default function ListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState([]);

  const fetchProducts = useCallback(() => {
    setError(false);
    return fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((data) => {
        setProducts(data.products);
      })
      .catch((err) => {
        console.log('Veri çekilemedi:', err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
    loadRecent().then(setRecent);
  }, [fetchProducts]);

  function onRefresh() {
    setRefreshing(true);
    fetchProducts();
  }

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

  const errorBox = error ? (
    <View style={styles.errorBox}>
      <Text style={styles.errorTitle}>Bağlantı yok</Text>
      <Text style={styles.errorText}>İnternet bağlantınızı kontrol edin.</Text>
      <Pressable style={styles.retry} onPress={() => { setLoading(true); fetchProducts().then(() => setLoading(false)); }}>
        <Text style={styles.retryText}>Tekrar dene</Text>
      </Pressable>
    </View>
  ) : null;

  return (
    <View style={{ flex: 1 }}>
      {errorBox}

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorBox: { margin: 12, padding: 14, borderRadius: 8, backgroundColor: '#fdecea', alignItems: 'center' },
  errorTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  errorText: { color: '#666', marginBottom: 10 },
  retry: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8, backgroundColor: '#1e88e5' },
  retryText: { color: '#fff', fontWeight: 'bold' },
  search: { margin: 12, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  chipRow: { paddingHorizontal: 12, marginBottom: 8, maxHeight: 40 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderRadius: 16, backgroundColor: '#e3e3e3' },
  row: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  thumb: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
  texts: { flex: 1 },
  title: { fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 40 },
});