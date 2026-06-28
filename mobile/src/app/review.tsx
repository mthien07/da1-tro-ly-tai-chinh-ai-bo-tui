import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { parseTransaction } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ReviewScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { session } = useAuth();

  const initialText = typeof params.fullText === 'string' ? params.fullText : '';
  const [text, setText] = useState(initialText);
  const [isParsing, setIsParsing] = useState(false);

  const handleParse = async () => {
    if (!text.trim()) {
      alert('Vui lòng nhập văn bản hoá đơn');
      return;
    }

    setIsParsing(true);
    try {
      if (!session?.access_token) {
        alert('Cần đăng nhập Supabase để lưu giao dịch.');
        return;
      }

      const result = await parseTransaction(text, session.access_token);

      const saveNote = result.saved ? 'Đã lưu.' : 'Đã phân tích, chưa lưu DB pilot.';
      alert(`${saveNote} Giao dịch: ${result.parsed_data.amount.toLocaleString('vi-VN')}đ`);
      router.dismissAll();
      router.replace('/');
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Lỗi phân tích hoá đơn.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <Stack.Screen options={{ title: 'Kiểm tra thông tin', headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: '#fff' }} />

      <ScrollView className="flex-1 px-4 pt-4">
        <View className="bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-6">
          <View className="flex-row items-center mb-4">
            <Ionicons name="document-text" size={24} color="#60a5fa" />
            <Text className="text-white text-lg font-bold ml-2">Văn bản nhận diện (OCR)</Text>
          </View>

          <Text className="text-gray-400 mb-4 text-sm">
            Bạn có thể chỉnh sửa lại các thông tin nhận diện bị sai trước khi hệ thống AI phân tích tự động.
          </Text>

          <TextInput
            className="bg-slate-900 text-white p-4 rounded-xl min-h-[200px]"
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
            placeholder="Nội dung hoá đơn..."
            placeholderTextColor="#64748b"
          />
        </View>
      </ScrollView>

      <View className="p-4 bg-slate-900 border-t border-slate-800">
        <TouchableOpacity
          className={`p-4 rounded-xl items-center flex-row justify-center ${isParsing ? 'bg-blue-800' : 'bg-blue-600'}`}
          onPress={handleParse}
          disabled={isParsing}
        >
          {isParsing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg ml-2">Phân tích bằng AI</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
