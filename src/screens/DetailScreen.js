import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { loadSaved, writeSaved } from '../storage';

export default function DetailScreen({ route }) {
  const { item } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const indirimliFiyat = item.price * (1 - item.discountPercentage / 100);
  const reviews = item.reviews || [];

  useEffect(() => {
    loadSaved().then((list) => setIsSaved(list.some((x) => x.id === item.id)));
  }, [item.id]);

  async function toggleSave() {
    const list = await loadSaved();
    const next = isSaved
      ? list.filter((x) => x.id !== item.id)
      : [item, ...list];
    await writeSaved(next);
    setIsSaved(!isSaved);
  }

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal pagingEnabled>
        {item.images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.brand}>{item.brand}</Text>
      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.oldPrice}>{item.price.toFixed(2)} $</Text>
        <Text style={styles.newPrice}>{indirimliFiyat.toFixed(2)} $</Text>
        <Text style={styles.discount}>%{Math.round(item.discountPercentage)} indirim</Text>
      </View>

      <Text style={styles.rating}>★ {item.rating}</Text>

      {item.stock < 10 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Son {item.stock} ürün</Text>
        </View>
      )}

      <Pressable
        onPress={toggleSave}
        style={[styles.saveButton, isSaved && styles.saveButtonActive]}
      >
        <Text style={styles.saveText}>
          {isSaved ? 'Kaydedildi ✓' : 'Kaydet'}
        </Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Yorumlar ({reviews.length})</Text>
      {reviews.map((r, i) => (
        <View key={i} style={styles.review}>
          <Text style={styles.reviewer}>{r.reviewerName} · ★ {r.rating}</Text>
          <Text>{r.comment}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: 320, height: 240, resizeMode: 'contain', margin: 8 },
  title: { fontSize: 22, fontWeight: 'bold', marginHorizontal: 16, marginTop: 8 },
  brand: { fontSize: 16, color: '#666', marginHorizontal: 16, marginTop: 2 },
  description: { fontSize: 15, marginHorizontal: 16, marginVertical: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, gap: 10 },
  oldPrice: { textDecorationLine: 'line-through', color: '#999' },
  newPrice: { fontSize: 20, fontWeight: 'bold', color: '#d00' },
  discount: { color: '#080' },
  rating: { marginHorizontal: 16, marginTop: 6 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#fa0', borderRadius: 6, marginHorizontal: 16, marginTop: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontWeight: 'bold' },
  saveButton: { marginHorizontal: 16, marginTop: 16, padding: 14, borderRadius: 8, backgroundColor: '#1e88e5', alignItems: 'center' },
  saveButtonActive: { backgroundColor: '#2e7d32' },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginTop: 20, marginBottom: 8 },
  review: { marginHorizontal: 16, marginBottom: 12, padding: 10, backgroundColor: '#f2f2f2', borderRadius: 8 },
  reviewer: { fontWeight: 'bold', marginBottom: 4 },
});