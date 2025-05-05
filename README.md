# Balls Hub

A Vue component library for the Trifle Hub interface.

## Local Development

### Prerequisites

- Node.js (v16 or higher recommended)
- Yarn or npm
- A Vue 3 application to test with

### Setup

1. Clone the repository and install dependencies:
```bash
cd balls-hub
yarn install
```

2. Create a local link:
```bash
# In the balls-hub directory
yarn link
```

3. Build the package:
```bash
yarn build
```

### Using in a Local Project

1. In your consuming Vue application, link to the local balls-hub:
```bash
# In your Vue app directory
yarn link balls-hub
```

2. Add the required peer dependencies if not already installed:
```bash
yarn add @reown/appkit @reown/appkit-adapter-wagmi @wagmi/vue @wagmi/core vue-router
```

3. Import and use the component:
```javascript
// As a Vue plugin (recommended)
import BallsHub from 'balls-hub'
import 'balls-hub/dist/style.css'

app.use(BallsHub)

// Or as a component
import { Index as TrifleHub } from 'balls-hub'
import 'balls-hub/dist/style.css'
```

4. Using the wagmiConfig:
```javascript
import { wagmiConfig } from 'balls-hub'

// Use the wagmiConfig with @wagmi/vue hooks
import { useAccount } from '@wagmi/vue'

const { address, isConnected } = useAccount({
  config: wagmiConfig
})
```

### Development Workflow

1. Make changes to the component library
2. Run `yarn build` to rebuild
3. The changes will be automatically reflected in your consuming application

### Troubleshooting

If you encounter dependency conflicts when using `yarn link`, try:

```bash
yarn link balls-hub --force
```

If you need to unlink:
```bash
# In your Vue app directory
yarn unlink balls-hub

# In the balls-hub directory
yarn unlink
```

### Required Peer Dependencies

- vue: ^3.0.0
- @reown/appkit: *
- @reown/appkit-adapter-wagmi: *
- @wagmi/vue: *
- @wagmi/core: *
- vue-router: ^4.0.0

## Project Structure

```
balls-hub/
├── src/
│   ├── components/     # Vue components
│   ├── config/        # Configuration files
│   ├── assets/        # Static assets
│   └── index.js       # Main entry point
├── dist/              # Built files
└── package.json
```

## Building

- `yarn build` - Build the library
- `yarn dev` - Start development server 