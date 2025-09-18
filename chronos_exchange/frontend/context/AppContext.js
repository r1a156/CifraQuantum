import { createContext, useContext, useReducer, useEffect } from 'react'
import axios from 'axios'

const AppContext = createContext()

const initialState = {
  user: null,
  balance: {
    truth: 1000,
    time: 500
  },
  markets: [],
  portfolio: [],
  isConnected: false,
  isLoading: true
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isConnected: true }
    case 'SET_BALANCE':
      return { ...state, balance: action.payload }
    case 'SET_MARKETS':
      return { ...state, markets: action.payload, isLoading: false }
    case 'SET_PORTFOLIO':
      return { ...state, portfolio: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    loadMarkets()
    loadPortfolio()
  }, [])

  const loadMarkets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/markets')
      dispatch({ type: 'SET_MARKETS', payload: response.data.markets })
    } catch (error) {
      console.error('Error loading markets:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadPortfolio = async () => {
    // Загрузка портфеля пользователя
    const portfolio = [
      { id: 1, event: 'BTC to $100K', investment: 100, potentialReturn: 250 },
      { id: 2, event: 'ETH to $5K', investment: 50, potentialReturn: 120 }
    ]
    dispatch({ type: 'SET_PORTFOLIO', payload: portfolio })
  }

  const connectWallet = () => {
    const user = {
      id: 1,
      username: 'crypto_trader',
      email: 'trader@chronos.com'
    }
    dispatch({ type: 'SET_USER', payload: user })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const placeBet = async (marketId, amount, prediction) => {
    try {
      // Здесь будет логика размещения ставки
      console.log(`Placing bet: ${amount} TRUTH on ${prediction ? 'YES' : 'NO'} for market ${marketId}`)
      
      // Обновляем баланс
      const newBalance = {
        ...state.balance,
        truth: state.balance.truth - amount
      }
      dispatch({ type: 'SET_BALANCE', payload: newBalance })
      
      return true
    } catch (error) {
      console.error('Error placing bet:', error)
      return false
    }
  }

  return (
    <AppContext.Provider value={{
      ...state,
      connectWallet,
      logout,
      placeBet,
      loadMarkets
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
