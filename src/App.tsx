
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from '@/routes/routes'
import {Toaster } from "sileo";

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </>
  )
}

export default App
