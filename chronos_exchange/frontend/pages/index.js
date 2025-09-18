import { useState } from 'react'
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Menu as MenuIcon,
  AccountBalanceWallet,
  TrendingUp,
  Dashboard,
  Person,
  Notifications,
  Logout
} from '@mui/icons-material'
import { useApp } from '../context/AppContext'
import MarketCard from '../components/MarketCard'
import PortfolioChart from '../components/PortfolioChart'
import BalanceCard from '../components/BalanceCard'

const drawerWidth = 280

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, balance, markets, portfolio, connectWallet, logout } = useApp()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, active: true },
    { text: 'Markets', icon: <TrendingUp /> },
    { text: 'Wallet', icon: <AccountBalanceWallet /> },
    { text: 'Profile', icon: <Person /> }
  ]

  const drawer = (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #0a0a23 0%, #1a1a3a 100%)',
      height: '100%',
      padding: '20px 0'
    }}>
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          fontWeight: 'bold',
          mb: 2
        }}>
          🌌 CHRONOS
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Prediction Market
        </Typography>
      </Box>

      <List sx={{ mt: 4 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            sx={{ 
              mb: 1,
              borderRadius: '12px',
              mx: 2,
              background: item.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              '&:hover': {
                background: 'linear-gradient(135deg, #667eea33 0%, #764ba233 100%)'
              }
            }}
          >
            <ListItemIcon sx={{ color: item.active ? 'white' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ 
                color: item.active ? 'white' : 'text.secondary',
                fontWeight: item.active ? 'bold' : 'normal'
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0a0a23' }}>
      {/* AppBar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'rgba(26, 26, 58, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={4} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {user ? (
            <Button 
              color="inherit" 
              onClick={logout}
              startIcon={<Logout />}
            >
              Logout
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={connectWallet}
              startIcon={<AccountBalanceWallet />}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                }
              }}
            >
              Connect Wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px'
        }}
      >
        <Container maxWidth="xl">
          {/* Balance and Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8}>
              <BalanceCard balance={balance} />
            </Grid>
            <Grid item xs={12} md={4}>
              <PortfolioChart portfolio={portfolio} />
            </Grid>
          </Grid>

          {/* Active Markets */}
          <Typography variant="h4" sx={{ mb: 3, color: 'white' }}>
            🔥 Active Prediction Markets
          </Typography>

          <Grid container spacing={3}>
            {markets.map((market) => (
              <Grid item xs={12} md={6} lg={4} key={market.event_id}>
                <MarketCard market={market} />
              </Grid>
            ))}
          </Grid>

          {markets.length === 0 && (
            <Paper sx={{ p: 4, textAlign: 'center', background: '#1a1a3a' }}>
              <Typography variant="h6" color="text.secondary">
                No active markets yet
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => window.location.reload()}
              >
                Refresh Markets
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  )
}
