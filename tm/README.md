# Utopia React Native Turbomodule
## Setup

Run following command in terminal
`git submodule add https://gitlab.prod/ui/uturbo`

Configure package.json
```
codegenConfig": {
    "jsSrcsDir": "uturbo"
}
```
## Usage

Initialize NativeUtopiaManager with working directory path
```
import NativeUtopiaManager from './tm/NativeUtopiaManager';

NativeUtopiaManager.initialize('/data/data/<appId>/files');
```

Create and open profile
```
import NativeUtopiaUtils from './tm/NativeUtopiaUtils';
import {KeyInfo} from './tm/NativeUtopiaManager';

const pubKey = '<profilePublicKeyBase64>';
const keyInfo = {
    publicKey: NativeUtopiaUtils.makeByteArray(pubKey)
} as KeyInfo

NativeUtopiaManager.makeProfile('<profileName>', '<profilePassword>', keyInfo);
```