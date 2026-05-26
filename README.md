# TrifleHub Documentation 👀

## Installation

Install the TrifleHub plugin using npm or yarn:

```bash
# Using npm
npm install @trifle/trifle-hub

# Using yarn
yarn add @trifle/trifle-hub
```

This prevents your bundler from including peer dependencies in your build, reducing bundle size and avoiding version conflicts.

## Configuration and Setup

Import and register the TrifleHub plugin in your Vue application:

```js
import { createApp } from 'vue'
import App from './App.vue'
import { TrifleHubVuePlugin } from '@trifle/trifle-hub'

const app = createApp(App)

// Configure and install the TrifleHub plugin
app.use(TrifleHubVuePlugin, {
  // Required: ReOWN AppKit configuration
  reownConfig: {
    appId: 'your-app-id'
    // Other ReOWN AppKit configuration options
  },

  connectors: [],

  // Optional: Backend URL (defaults to 'https://bot-staging.trifle.life')
  backendUrl: 'https://bot-staging.trifle.life',

  // Optional: Set the default page to show when the hub is opened for the first time
  defaultPage: 'games' // or any valid page key (e.g., 'welcome', 'account', etc.)

  // Optional: For development use, you can hook into an existing Pinia instance
  devHookPiniaInstance: existingPiniaInstance
})

app.mount('#app')
```

**About `defaultPage`:**

- The `defaultPage` option allows you to specify which page should be shown the first time a user opens the hub (if no page is set in the route or sessionStorage).
- If not specified, it defaults to `'welcome'`.
- Valid values are any of the page keys defined in your hub (e.g., `'games'`, `'leaderboard'`, `'account'`, etc.).

Add the TrifleHub component to your app layout:

```vue
<template>
  <div id="app">
    <!-- Your app content -->
    <TrifleHub position="bottom-left" />
  </div>
</template>

<script setup>
// The component is registered globally
</script>
```

## Styles

CSS is automatically injected when the plugin is registered — no separate stylesheet import is required.

Since v1.1.0, all compiled styles ship inside `@layer trifle-hub`. This keeps trifle-hub's styles from polluting the global cascade and lets you control where they sit relative to your own CSS.

trifle-hub ships its own element reset (preflight) inside `@layer trifle-hub.base`. If your app has no preflight of its own, trifle-hub provides the baseline for buttons, inputs, etc.

### Layer order

For trifle-hub's utility classes (e.g. `_bg-metallic-linear`, `_shadow-panel`) to correctly override element resets on tags like `<button>`, `trifle-hub` must be declared **after** `base` in the layer order. This ensures trifle-hub utility classes beat preflight resets, while your own app utilities still win over trifle-hub when they conflict.

#### Why `index.html` — not your CSS file

trifle-hub injects its CSS via JavaScript at runtime. Because CSS layer order is locked by the **first** appearance of each layer name, any `@layer` declaration in your app's CSS file may arrive too late if trifle-hub's JS runs first (which depends on import order in `main.js`).

The safest approach for any Vite app is to declare the layer order as a `<style>` tag in `index.html`. It is processed by the browser before any JavaScript runs, so trifle-hub's injection always lands in the correct position.

```html
<!-- index.html <head> — before any <script> tags -->
<style>@layer theme, base, trifle-hub, components, utilities;</style>
```

Include `theme` if you use Tailwind v4 (it has an extra `@layer properties, theme, ...` that v3 does not).

#### Tailwind v4

In `index.html`:

```html
<style>@layer properties, theme, base, trifle-hub, components, utilities;</style>
```

Your `style.css` needs no extra layer declaration:

```css
@import "tailwindcss";
```

#### Tailwind v3 — with your own preflight

In `index.html`:

```html
<style>@layer base, trifle-hub, components, utilities;</style>
```

Tailwind v3 outputs **unlayered** CSS by default, which unconditionally beats any `@layer` rule. To opt in to the layer system, wrap each directive in an explicit `@layer` block in your CSS:

```css
@layer base {
  @tailwind base;
}
@layer components {
  @tailwind components;
}
@layer utilities {
  @tailwind utilities;
}
```

Any styles written outside a `@layer` block remain unlayered and beat everything above.

#### Tailwind v3 — without your own preflight

In `index.html`:

```html
<style>@layer trifle-hub;</style>
```

If your app has `@tailwind base` commented out (relying on trifle-hub's built-in reset), your unlayered `@tailwind components/utilities` output naturally beats `@layer trifle-hub` without needing any wrapping:

```css
/* @tailwind base; */   ← leave commented out
@tailwind components;
@tailwind utilities;
```

### Standalone CSS file

The compiled stylesheet is available at `dist/trifle-hub.css` if you prefer to manage it explicitly (e.g., for SSR, critical CSS extraction, or strict layer ordering). The `style` field in the package manifest points to this file. If importing it directly, note that the JS bundle also auto-injects the CSS — disable one or the other to avoid loading styles twice.

## Available Provide/Inject Resources

The TrifleHub plugin provides several resources via Vue's provide/inject system:

| Injection Key              | Type   | Description                                 |
| -------------------------- | ------ | ------------------------------------------- |
| `'TrifleHub/wagmiConfig'`  | Object | Wagmi configuration for wallet interactions |
| `'TrifleHub/appKit'`       | Object | ReOWN AppKit instance                       |
| `'TrifleHub/store'`        | Object | Authentication store (Pinia)                |
| `'trifleHubInternalPinia'` | Object | Internal Pinia instance                     |
| `'TrifleHub/defaultPage'`  | String | The default page key for the hub            |

### TrifleHub Component Resources

These are provided by the TrifleHub component when it's mounted:

| Injection Key                        | Type                      | Description                                        |
| ------------------------------------ | ------------------------- | -------------------------------------------------- |
| `'hub'`                              | Object                    | Hub controller with the following properties:      |
| &nbsp;&nbsp;`hubOpen`                | Ref<boolean>              | Reactive state for hub visibility                  |
| &nbsp;&nbsp;`openHub(page?)`         | Function                  | Open the hub, optionally to a specific page        |
| &nbsp;&nbsp;`closeHub()`             | Function                  | Close the hub                                      |
| `'account'`                          | Object                    | Account information with the following properties: |
| &nbsp;&nbsp;`address`                | ComputedRef<string\|null> | Current wallet address                             |
| &nbsp;&nbsp;`chainId`                | ComputedRef<number\|null> | Current chain ID                                   |
| &nbsp;&nbsp;`isConnected`            | ComputedRef<boolean>      | Whether wallet is connected                        |
| &nbsp;&nbsp;`isConnecting`           | ComputedRef<boolean>      | Whether wallet is connecting                       |
| `'accountModal'`                     | Object                    | Wallet interaction methods:                        |
| &nbsp;&nbsp;`disconnect()`           | Function                  | Disconnect the wallet                              |
| &nbsp;&nbsp;`openAccountModal()`     | Function                  | Open the wallet connection modal                   |
| &nbsp;&nbsp;`enforceConnection()`    | Function                  | Ensure wallet is connected                         |
| &nbsp;&nbsp;`signDiscordId(message)` | Function                  | Sign a message for Discord auth                    |

## Page Navigation

TrifleHub provides a simple navigation system through the injected `hub` object. You can use this to open specific pages or close the hub.

### Available Pages

The following pages are available for navigation:

- `welcome` - Welcome page (not shown in menu)
- `games` - Games page
- `leaderboard` - Leaderboard page
- `earn` - Earn page
- `account` - Account page
- `theme` - Theme settings (not shown in menu)

### Navigating Between Pages

You can navigate between pages using the `hub` object:

```js
// In a Vue component
import { inject } from 'vue'

export default {
  setup() {
    // Get the hub controller
    const hub = inject('hub')

    // Function to open a specific page
    const openAccountPage = () => {
      hub.openHub('account')
    }

    // Function to close the hub
    const closeHub = () => {
      hub.closeHub()
    }

    return { openAccountPage, closeHub }
  }
}
```

## Auth Store Methods

The authentication store (`inject('TrifleHub/store')`) provides several methods for managing user authentication:

| Method                            | Description                                |
| --------------------------------- | ------------------------------------------ |
| `connectDiscord()`                | Initiate Discord authentication            |
| `connectWallet()`                 | Connect to a wallet                        |
| `authenticateWithWallet(address)` | Authenticate with a connected wallet       |
| `disconnect()`                    | Disconnect all authentication methods      |
| `updateUsername(newUsername)`     | Update the user's username                 |
| `fetchUserStatus()`               | Get the latest user status from the server |

## Example Usage

Here's a complete example of a component that interacts with TrifleHub:

```vue
<template>
  <div>
    <button @click="openAccountPage">Open Account</button>
    <button @click="openLeaderboard">Open Leaderboard</button>
    <button @click="closeHub">Close Hub</button>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  setup() {
    const hub = inject('hub')

    const openAccountPage = () => {
      hub.openHub('account')
    }

    const openLeaderboard = () => {
      hub.openHub('leaderboard')
    }

    const closeHub = () => {
      hub.closeHub()
    }

    return {
      openAccountPage,
      openLeaderboard,
      closeHub
    }
  }
}
</script>
```
