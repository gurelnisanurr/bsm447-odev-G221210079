import { View, Text } from 'react-native';

export default function DetailScreen({ route }) {
  const { item } = route.params;
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Detay: {item.title}</Text>
    </View>
  );
}