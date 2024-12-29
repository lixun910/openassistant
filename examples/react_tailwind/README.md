# Getting Started with OpenAssistant in React with TailwindCSS

This tutorial shows how to use **OpenAssistant** in a React project that includes **TailwindCSS** for styling.

The repository [react_tailwind](https://github.com/openassistant/simple_react_app) demonstrates a basic example of integrating OpenAssistant with TailwindCSS.

The basic structure of the project is as follows:

```
src/
├── app.tsx
├── index.css
├── main.tsx
build/
├── index.html
package.json
tailwind.config.js
postcss.config.js
esbuild.config.mjs
```

---

## Instructions

### 1. Install Dependencies

To use OpenAssistant in your React project, install the required packages:

```bash
yarn add @openassistant/ui @openassistant/core
yarn add -D @nextui-org/react framer-motion
```

If you haven't already set up TailwindCSS in your React project, follow these steps to install and configure it:

```bash
yarn add -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

Then, add the following content to your `tailwind.config.js` file to enable purging unused styles in your production builds:

```javascript
import { nextui } from '@nextui-org/react';

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@openassistant/ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [nextui()],
};
```

Next, include TailwindCSS in your `src/index.css` file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Make sure your `index.css` file is imported in `src/main.tsx`:

```javascript
import './index.css';
```

---

### 2. Add the OpenAssistant Chat Component to Your App

Here’s how to use the `Assistant` component from OpenAssistant:

```jsx
import { Assistant } from '@openassistant/ui';

function App() {
  return (
    <div className="w-[400px] h-[800px] m-5">
      <Assistant
        name="My Assistant"
        apiKey=""
        version="v1"
        modelProvider="ollama"
        model="llama3.1"
        baseUrl="http://127.0.0.1:11434"
        welcomeMessage="Hello, how can I help you today?"
        instructions="You are a helpful assistant."
        functions={[]}
      />
    </div>
  );
}

export default App;
```

- Here, the TailwindCSS classes are used for styling:
  - `w-[400px]` sets the width to 400px.
  - `h-[800px]` sets the height to 800px.
  - `m-5` adds a margin of `20px`.

---

### 3. Set Up the Local Ollama Server

To run the OpenAssistant backend, download and set up the **Ollama desktop app** from [https://ollama.com/download](https://ollama.com/download).

Run a model (e.g., llama3.2) in the terminal:

```bash
ollama run llama3.2
```

To download a model (e.g., llama3.2), use:

```bash
ollama pull llama3.2
```

For detailed instructions, refer to the [Ollama documentation](https://github.com/ollama/ollama).

**Note:** If you need your React app to access Ollama locally, run the server using:

```bash
OLLAMA_ORIGINS=* ollama serve
```

---

### 4. Run the Project

Start your React project with:

```bash
yarn start
```

You should now see the OpenAssistant UI rendered in your React app styled with TailwindCSS.

---

### 5. Theme Support

The OpenAssistant UI component uses [next-themes](https://github.com/pacocoursey/next-themes) to support theme switching.

To enable theme support, wrap your `App` component with the `ThemeProvider`:

```jsx
import { Assistant } from '@openassistant/ui';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" forcedTheme="light">
      <div className="w-[400px] h-[800px] m-5">
        <Assistant
          name="My Assistant"
          apiKey=""
          version="v1"
          modelProvider="ollama"
          model="llama3.1"
          baseUrl="http://127.0.0.1:11434"
          welcomeMessage="Hello, how can I help you today?"
          instructions="You are a helpful assistant."
          functions={[]}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

Ensure that your `tailwind.config.js` supports `darkMode` by adding:

```javascript
module.exports = {
  ...
  darkMode: 'class', // Enables dark mode support
};
```

---

### Final Output

After running the app, you'll see the OpenAssistant UI styled with TailwindCSS. 

<img width="300" alt="" src="https://github.com/user-attachments/assets/9875ac6f-f903-482b-a9ab-0a366fffec0a" />

That's it! You have successfully integrated OpenAssistant into a React project using TailwindCSS.
