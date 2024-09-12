import {MMKV, Mode} from 'react-native-mmkv';
import {Platform} from 'react-native';
import {Dirs} from 'react-native-file-access';

export const storage = new MMKV();

export const encryptedStorage = new MMKV({
  id: 'encrypted-storage',
  mode: Platform.OS === 'ios' ? Mode.SINGLE_PROCESS : undefined,
  path: Dirs.MainBundleDir,
  encryptionKey: 'yuri',
});
