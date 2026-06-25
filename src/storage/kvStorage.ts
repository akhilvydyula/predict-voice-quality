import AsyncStorage from '@react-native-async-storage/async-storage';

import type { KeyValueStorage } from './kvStorage.types';

const kvStorage: KeyValueStorage = AsyncStorage;

export default kvStorage;
