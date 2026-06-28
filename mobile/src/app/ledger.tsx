import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { fetchTransactions, Transaction } from '../utils/api';

export default function LedgerScreen() {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchLedger = async () => {
      if (!session?.access_token) {
        setTransactions([]);
        setErrorMessage('Cần đăng nhập Supabase để xem sổ thu chi pilot.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchTransactions(session.access_token);
        setTransactions(data);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Không tải được sổ thu chi');
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [session]);

  const renderItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === 'INCOME';
    return (
      <View className="flex-row justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 mb-3">
        <View className="flex-row items-center flex-1">
          <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${isIncome ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
            <Ionicons name={isIncome ? 'arrow-down' : 'arrow-up'} size={24} color={isIncome ? '#4ade80' : '#f87171'} />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg mb-1">{item.category}</Text>
            <Text className="text-gray-400">{new Date(item.transaction_date).toLocaleDateString('vi-VN')}</Text>
          </View>
        </View>
        <Text className={`font-bold text-lg ${isIncome ? 'text-green-400' : 'text-white'}`}>
          {isIncome ? '+' : '-'}{item.amount.toLocaleString('vi-VN')} đ
        </Text>
      </View>
    );
  };

  const isEmpty = !loading && transactions.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <Stack.Screen options={{ title: 'Sổ thu chi', headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: '#fff' }} />

      <View className="flex-1 px-4 pt-4">
        {errorMessage ? (
          <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-4">
            <Text className="text-amber-200">{errorMessage}</Text>
          </View>
        ) : null}

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#60a5fa" />
          </View>
        ) : isEmpty ? (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="receipt-outline" size={64} color="#475569" className="mb-4" />
            <Text className="text-gray-400 text-lg text-center">Chưa có giao dịch nào.</Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
