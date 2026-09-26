declare const __DEV__: boolean

export const env = {
  apiBaseUrl: 'https://jsonplaceholder.typicode.com',
  isDev: typeof __DEV__ !== 'undefined' ? __DEV__ : true,
} as const
