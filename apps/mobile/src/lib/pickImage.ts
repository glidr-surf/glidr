import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export interface PickedImage {
  uri: string;
  blob: Blob;
  ext: 'jpg';
  contentType: 'image/jpeg';
}

/** Launches the library picker, resizes to max 1600px wide, compresses to JPEG, returns a Blob. */
export async function pickImage(): Promise<PickedImage | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) return null;

  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
  if (res.canceled || !res.assets?.[0]) return null;

  const manipulated = await ImageManipulator.manipulateAsync(
    res.assets[0].uri,
    [{ resize: { width: 1600 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
  );

  const blob = await (await fetch(manipulated.uri)).blob();
  return { uri: manipulated.uri, blob, ext: 'jpg', contentType: 'image/jpeg' };
}
