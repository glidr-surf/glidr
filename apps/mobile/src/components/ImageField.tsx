import { useState } from 'react';
import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Camera } from 'phosphor-react-native';
import { GText } from './GText';
import { pickImage, type PickedImage } from '../lib/pickImage';
import { colors } from '../theme/colors';

interface ImageFieldProps {
  initialUrl?: string;
  label?: string;
  height?: number;
  testID?: string;
  onPicked: (img: PickedImage) => void;
}

export function ImageField({ initialUrl, label = 'ADD PHOTO', height = 180, testID, onPicked }: ImageFieldProps) {
  const [preview, setPreview] = useState<string | undefined>(initialUrl);

  return (
    <Pressable
      testID={testID}
      style={[styles.box, { height }]}
      onPress={async () => {
        const img = await pickImage();
        if (img) {
          setPreview(img.uri);
          onPicked(img);
        }
      }}
    >
      {preview ? (
        <Image source={{ uri: preview }} style={styles.img} />
      ) : (
        <View style={styles.empty}>
          <Camera size={28} color={colors.textMid} weight="bold" />
          <GText variant="label" color={colors.textMid}>{label}</GText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 2, borderColor: colors.text, backgroundColor: colors.surface, overflow: 'hidden' },
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
});
