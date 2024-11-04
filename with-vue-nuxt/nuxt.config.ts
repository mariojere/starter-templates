// https://nuxt.com/docs/api/configuration/nuxt-config
import react from "@vitejs/plugin-react";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false,
  vite: {
    plugins: [
      react({
        include: [/\.tsx$/, /\.jsx$/],
        babel: {
          parserOpts: {
            plugins: ["jsx"],
          },
        },
      }),
    ],
    optimizeDeps: {
      include: ["react", "react-dom", "@usecapsule/react-sdk"],
    },
    esbuild: {
      jsxInject: `import React from 'react'`, // Automatically inject React
      jsxFactory: "React.createElement",
      jsxFragment: "React.Fragment",
    },
  },
});
