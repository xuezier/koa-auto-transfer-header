# koa-auto-transfer-header

In a Koa server, when a client request is received and an external HTTP request is initiated in the request, the request header initiated by the client is automatically forwarded.

Also used in a server started from any Web Framework.

Support all `http-client` libs based on `http` module.

## Installation

```bash
npm install koa-auto-transfer-header [--save]
or
yarn add koa-auto-transfer-header
```

## Usage

import in portal file

```typescript
import 'koa-auto-transfer-header';
```

### Config

```typescript
interface IConfig {
	enable: boolean;		// is enable tranfer, default: true
	transferHeaders: string[],	// transfer header keys, default: ['request-id', 'trace-id']
}
```

disable transfer

```typescript
import { disableTransferHeaders } from 'koa-auto-transfer-header';

disableTransferHeaders();
```

add transfer header

```typescript
import { addTransferHeader } from 'koa-auto-transfer-header';

addTransferHeader('my-header');
```

reset transfer headers

```typescript
import { setTransferHeaders } from 'koa-auto-transfer-header';

setTransferHeaders(['my-header1', 'my-header2']);
```
