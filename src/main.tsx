import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Web3Provider } from './web3/Web3Provider.tsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Provider>
       <RouterProvider router={router} />
    </Web3Provider>
  </StrictMode>,
)


