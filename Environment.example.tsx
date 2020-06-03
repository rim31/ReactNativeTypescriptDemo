// .env is not working well with typescript and react native, so i do myself this export environment
// don't put in .ignore

import { Platform } from 'react-native';

var _Environments: any = {
  production: { BASE_URL: 'abc.xyz', API_KEY: '1234' },
  development: { BASE_URL: 'abc.xyz', API_KEY: '1234', CLOUD_DB: 'abc.xyz', CLOUD_KEY: '1234' },
}

// have to choose later Platform.OS === "android" ? "android" : "ios";

function getEnvironment() {
  // Insert logic here to get the current platform (e.g. staging, production, etc)
  var platform: string = "development";

  // ...now return the correct environment
  return _Environments[platform]
}

const Environment = getEnvironment()

export default Environment;