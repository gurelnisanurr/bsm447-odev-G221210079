import { useCallback, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { loadSaved } from '../storage';

export default function SavedScreen({ navigation }) {
  const [saved, setSaved] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadSaved().then(setSaved);
    }, [])
  );

  if (saved.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Henüz kayıt yok</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={saved}
      keyExtractor={(item) => String(item.id)}
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
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  thumb: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
  texts: { flex: 1 },
  title: { fontWeight: 'bold' },
});