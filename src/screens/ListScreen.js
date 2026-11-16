import { View, Text, Pressable } from 'react-native';

export default function ListScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Liste ekranı</Text>
      <Pressable
        onPress={() => navigation.navigate('Detay', { item: { id: 1, title: 'Test kaydı' } })}
        style={{ marginTop: 20, padding: 12, backgroundColor: '#ddd' }}
      >
        <Text>Detaya git (test)</Text>
      </Pressable>
    </View>
  );
}