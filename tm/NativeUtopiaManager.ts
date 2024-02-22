import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';
import { ArrBuff, BigNum, StatusUser } from './Types';

type U64 = BigNum | BigNum;
type ByteArray = ArrBuff | ArrBuff;
type UserStatus = StatusUser | number;

export type KeyInfo = {
  publicKey: ByteArray;
  privateKey: ByteArray;
  nodeId: ByteArray;
  linkId: ByteArray;
};

export interface Profile {
  readonly name: string;
  readonly keyInfo: KeyInfo;
  readonly instanceKeyInfo: KeyInfo;
  readonly status: UserStatus;
  textMood: string;
  nickname: string;
  firstname: string;
  lastname: string;
  avatar: ByteArray;
  license: ByteArray;
  promoCode: string;
  lastChannelStats: U64;
  pushEnabled: boolean;
  onPushEnabled: Promise<boolean> | ((state: boolean) => void);
  onStatusChanged: Promise<UserStatus> | ((status: UserStatus) => void);
}

export interface Spec extends TurboModule {
  readonly initialize: (workDirPath: string) => void;
  readonly hasProfile: (name: string) => boolean;
  readonly removeProfile: (name: string) => boolean;
  readonly availableProfiles: () => string[];
  readonly makeProfile: (name: string, password: string, keyInfo?: KeyInfo) => Profile;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeUtopiaManager');
