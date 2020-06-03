// @ts-ignore
import { Platform } from 'react-native';
// @ts-ignore
import {
  API_URL,
  IOS_ANALYTICS_KEY,
  ANDROID_ANALYTICS_KEY,
} from 'react-native-dotenv';

export default {
  API_URL,
  ANALYTICS_KEY: Platform.select({
    ios: IOS_ANALYTICS_KEY,
    android: ANDROID_ANALYTICS_KEY,
  }),
};