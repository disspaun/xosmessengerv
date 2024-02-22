export type ArrBuff = ArrayBuffer;

export type BigNum = BigInt;

export enum Direction {
  Incoming,
  Outgoing,
}

export enum StatusUser {
  Invalid = 0x0000,
  Available = 0x1000,
  Away = 0x1001,
  NotAvailable = 0x1002,
  DoNotDisturb = 0x1003,
  ExtendedAway = 0x1004,
  Invisible = 0x8000,
  Offline = 0x10000,
}
