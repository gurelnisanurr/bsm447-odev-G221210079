import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

export default function DetailScreen({ route }) {
  const { item } = route.params;
  const indirimliFiyat = item.price * (1 - item.discountPercentage / 100);
  const reviews = item.reviews || [];

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

      <Text>★ {item.rating}</Text>

      {item.stock < 10 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Son {item.stock} ürün</Text>
        </View>
      )}

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
  badge: { alignSelf: 'flex-start', backgroundColor: '#fa0', borderRadius: 6, marginHorizontal: 16, marginTop: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginTop: 20, marginBottom: 8 },
  review: { marginHorizontal: 16, marginBottom: 12, padding: 10, backgroundColor: '#f2f2f2', borderRadius: 8 },
  reviewer: { fontWeight: 'bold', marginBottom: 4 },
});