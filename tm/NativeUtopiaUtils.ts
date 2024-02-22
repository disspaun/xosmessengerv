import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import { TurboModuleRegistry } from 'react-native';
import { ArrBuff } from './Types';

type ByteArray = ArrBuff | ArrBuff;

export interface Spec extends TurboModule {
  readonly makeByteArray: (base64: string) => ByteArray;
  // readonly reverseByteArray: (array: ByteArray) => ByteArray;
  // readonly sortByteArray: (array: ByteArray) => ByteArray;
  readonly stringifyByteArray: (array: ByteArray) => string;
  readonly emitDeviceEvent: (event: string) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeUtopiaUtils');
