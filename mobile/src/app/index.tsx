import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { fetchReportSummary, ReportSummary } from '../utils/api';

const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    fromDate: firstDay.toISOString().slice(0, 10),
    toDate: lastDay.toISOString().slice(0, 10),
  };
};

export default function Dashboard() {
  const router = useRouter();
  const { session } = useAuth();
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      if (!session?.access_token) {
        setSummary(null);
        setErrorMessage('Cần đăng nhập Supabase để xem báo cáo pilot.');
        return;
      }

      try {
        const { fromDate, toDate } = getCurrentMonthRange();
        const nextSummary = await fetchReportSummary(session.access_token, fromDate, toDate);
        setSummary(nextSummary);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Không tải được báo cáo');
      }
    };
    loadSummary();
  }, [session]);

  const displayName = session?.user?.email?.split('@')[0] || 'User';
  const totalExpense = summary?.total_expense || 0;
  const transactionCount = summary?.transaction_count || 0;
  const recentTransactions = summary?.recent_transactions.slice(0, 3) || [];

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-gray-400 text-lg">Xin chào,</Text>
            <Text className="text-white text-2xl font-bold">{displayName}</Text>
          </View>
          <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center">
            <Ionicons name="person" size={24} color="white" />
          </View>
        </View>

        {/* Balance Card */}
        <View className="bg-slate-800 rounded-3xl p-6 mb-8 border border-slate-700 shadow-lg">
          <Text className="text-gray-400 text-base mb-2">Tổng chi tiêu tháng này</Text>
          <Text className="text-white text-4xl font-bold mb-4">{totalExpense.toLocaleString('vi-VN')} đ</Text>
          <View className="flex-row items-center">
            <Ionicons name="trending-down" size={20} color="#ef4444" />
            <Text className="text-red-400 ml-2">{transactionCount} giao dịch đã ghi nhận</Text>
          </View>
        </View>

        {errorMessage ? (
          <View className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6">
            <Text className="text-amber-200">{errorMessage}</Text>
          </View>
        ) : null}

        {/* Quick Actions */}
        <Text className="text-white text-xl font-bold mb-4">Thao tác nhanh</Text>
        <View className="flex-row justify-between mb-8 gap-x-4">
          <TouchableOpacity
            className="flex-1 bg-blue-600 rounded-2xl p-4 items-center justify-center"
            onPress={() => router.push('/camera')}
          >
            <Ionicons name="scan" size={32} color="white" className="mb-2" />
            <Text className="text-white font-semibold mt-2">Quét hoá đơn</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-4 items-center justify-center"
            onPress={() => router.push('/ledger')}
          >
            <Ionicons name="list" size={32} color="#60a5fa" className="mb-2" />
            <Text className="text-blue-400 font-semibold mt-2">Sổ thu chi</Text>
          </TouchableOpacity>
        </View>
        {/* Recent Transactions placeholder */}
        <Text className="text-white text-xl font-bold mb-4">Giao dịch gần đây</Text>
        <View className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
          {recentTransactions.length ? (
            recentTransactions.map((item) => (
              <View key={item.id} className="flex-row justify-between py-3 border-b border-slate-700">
                <Text className="text-white">{item.category}</Text>
                <Text className={item.type === 'INCOME' ? 'text-green-400' : 'text-red-300'}>
                  {item.type === 'INCOME' ? '+' : '-'}{item.amount.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-400 text-center italic py-4">Chưa có giao dịch nào.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
