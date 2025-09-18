import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from '../context/AppContext'
import '../styles/globals.css'

const queryClient = new QueryClient()

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#5a67d8'
    },
    secondary: {
      main: '#f093fb',
      light: '#f5576c',
      dark: '#d8363a'
    },
    background: {
      default: '#0a0a23',
      paper: '#1a1a3a'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
  },
  shape: {
    borderRadius: 12
  }
})

function MyApp({ Component, pageProps }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a3a',
              color: '#fff',
              border: '1px solid #667eea'
            }
          }}
        />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
