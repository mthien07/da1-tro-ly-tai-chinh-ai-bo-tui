import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { uploadReceipt } from '../utils/api';

const previewScreenOptions = {
  title: 'Xác nhận ảnh',
  headerStyle: { backgroundColor: '#0f172a' },
  headerTintColor: '#fff',
} as const;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900 px-4">
        <Text className="text-white text-center mb-4">Chúng tôi cần quyền truy cập camera để quét hoá đơn</Text>
        <Button onPress={requestPermission} title="Cấp quyền Camera" />
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) {
      return;
    }

    const result = await cameraRef.current.takePictureAsync({ base64: true });
    if (result?.uri) {
      setPhoto(result.uri);
    }
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  const handleUpload = async () => {
    if (!photo) return;

    setIsProcessing(true);
    try {
      const { full_text } = await uploadReceipt(photo);
      router.push({
        pathname: '/review',
        params: {
          fullText: full_text,
          photoUri: photo,
        },
      });
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi đọc ảnh. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (photo) {
    return (
      <SafeAreaView className="flex-1 bg-slate-900">
        <Stack.Screen options={previewScreenOptions} />
        <View className="flex-1 p-4">
          <View className="flex-1 rounded-2xl overflow-hidden border border-slate-700">
            <Image source={{ uri: photo }} className="flex-1" resizeMode="contain" />
          </View>

          <View className="flex-row justify-between mt-6 gap-x-4">
            <TouchableOpacity
              className="flex-1 bg-slate-800 border border-slate-700 p-4 rounded-xl items-center"
              onPress={handleRetake}
              disabled={isProcessing}
            >
              <Text className="text-white font-semibold">Chụp lại</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 p-4 rounded-xl items-center ${isProcessing ? 'bg-blue-800' : 'bg-blue-600'}`}
              onPress={handleUpload}
              disabled={isProcessing}
            >
              <Text className="text-white font-semibold">
                {isProcessing ? 'Đang phân tích...' : 'Tiếp tục'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View className="flex-1 justify-between p-6">
          <View className="flex-row justify-between items-center mt-4">
            <TouchableOpacity
              className="w-12 h-12 bg-black/50 rounded-full items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full">
              Quét Hóa Đơn
            </Text>
            <View className="w-12 h-12" />
          </View>

          <View className="items-center mb-8">
            <View className="border-2 border-white rounded-xl w-64 h-96 mb-8 opacity-50" />

            <TouchableOpacity
              className="w-20 h-20 bg-white rounded-full items-center justify-center border-4 border-blue-500"
              onPress={takePicture}
            >
              <View className="w-16 h-16 bg-white rounded-full" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});
