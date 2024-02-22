/**
 * @format
 */
import { AppRegistry } from 'react-native'
import 'reflect-metadata'

import App from '@src/App'

import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)
