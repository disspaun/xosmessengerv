import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';
import { ArrBuff, BigNum, Direction, StatusUser } from './Types';

type U64 = BigNum | BigNum;
type Dir = Direction | number;
type ByteArray = ArrBuff | ArrBuff;
type UserStatus = StatusUser | number;

export interface AddressGroup {
  readonly valid: boolean;
  id: U64;
  name: string;
}

export enum AddressStateAuth {
  AuthInState,
  AuthOutState,
  ConfirmedState,
  DeclinedState,
}

export interface Address {
  readonly valid: boolean;
  id: U64;
  publicKey: ByteArray;
  nickname: string;
  customNickname: string;
  firstname: string;
  lastname: string;
  comment: string;
  avatar: ByteArray;
  license: ByteArray;
  groupId: U64;
  status: UserStatus;
  textMood: string;
  created: U64;
  lastActivity: U64;
  stateAuth: AddressStateAuth;
  textAuth: string;
  lastAuthRequest: U64;
  properties: string;
  allowRecvPush: boolean;
  allowSendPush: boolean;
  lastPushPrivateMessage: U64;
  lastReadPrivateMessage: U64;
  editText: string;
  avatarBlob: string;
  licenseBlob: string;
}

export interface AdminMessage {
  readonly valid: boolean;
  id: U64;
  meta: boolean;
  text: string;
  type: string;
  created: U64;
  received: U64;
  read: U64;
  sequence: U64;
}

export enum ChannelBanMemberType {
  Property,
  Meta,
}

export interface ChannelBanMember {
  readonly valid: boolean;
  id: U64;
  contact: ByteArray;
  nickname: string;
  type: ChannelBanMemberType;
  timestamp: U64;
}

export interface ChannelMember {
  readonly valid: boolean;
  id: U64;
  contact: ByteArray;
  nickname: string;
  lastActivity: U64;
}

export interface ChannelMessage {
  readonly valid: boolean;
  id: U64;
  topicId: U64;
  contact: ByteArray;
  nickname: string;
  meta: boolean;
  text: string;
  type: string;
  received: U64;
  trySent: U64;
  sent: U64;
  read: U64;
  sequence: U64;
}

export enum EmailFolder {
  Incoming,
  Outgoing,
  Sended,
  Draft,
  Trash,
}
export enum EmailPriority {
  Low,
  Normal,
  High,
}

// export interface EmailReceiver {
//   publicKey: ByteArray;
//   received: U64;
//   read: U64;
// }

export interface Email {
  readonly valid: boolean;
  id: U64;
  dir: Dir;
  folder: EmailFolder;
  sender: ByteArray;
  // receivers: EmailReceiver[];
  subject: string;
  text: string;
  priority: EmailPriority;
  created: U64;
  received: U64;
  read: U64;
  attachments: U64[];
}

export interface FileData {
  readonly valid: boolean;
  id: U64;
  data: ByteArray;
  dataBlob: string;
}

export enum FileLocation {
  Local,
  Remote,
}

export interface File {
  readonly valid: boolean;
  id: U64;
  location: FileLocation;
  name: string;
  size: number;
  created: U64;
}

export enum FileTransferState {
  StandBy,
  Process,
  Pause,
  Finished,
}

export interface FileTransfer {
  readonly valid: boolean;
  readonly complete: boolean;
  id: U64;
  contact: ByteArray;
  dir: Dir;
  fileId: U64;
  state: FileTransferState;
  currentSize: number;
  totalSize: number;
  created: U64;
  lastActivity: U64;
  comment: string;
}

export interface License {
  readonly valid: boolean;
  readonly activeNow: boolean;
  id: string;
  active: boolean;
  validTo: U64;
  lastUpdate: U64;
}

export interface PrivateMessage {
  readonly valid: boolean;
  id: U64;
  contact: ByteArray;
  dir: Dir;
  meta: boolean;
  text: string;
  type: string;
  created: U64;
  received: U64;
  read: U64;
  sequence: U64;
}

export interface Spec extends TurboModule {
  readonly makeAddressGroup: (blank?: AddressGroup) => AddressGroup;
  readonly makeAddress: (blank?: Address) => Address;
  readonly makeAdminMessage: (blank?: AdminMessage) => AdminMessage;
  readonly makeChannelBanMember: (blank?: ChannelBanMember) => ChannelBanMember;
  readonly makeChannelMember: (blank?: ChannelMember) => ChannelMember;
  readonly makeChannelMessage: (blank?: ChannelMessage) => ChannelMessage;
  readonly makeEmail: (blank?: Email) => Email;
  readonly makeFileData: (blank?: FileData) => FileData;
  readonly makeFile: (blank?: File) => File;
  readonly makeFileTransfer: (blank?: FileTransfer) => FileTransfer;
  readonly makeLicense: (blank?: License) => License;
  readonly makePrivateMessage: (blank?: PrivateMessage) => PrivateMessage;
  // readonly createAddressGroupList: (
  //   size: number,
  //   name?:
  //     | undefined
  //     | null
  //     | boolean
  //     | number
  //     | string
  //     | ((n: number) => string),
  // ) => AddressGroup[];
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeUtopiaModule');
