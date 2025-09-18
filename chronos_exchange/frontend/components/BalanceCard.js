import { Card, CardContent, Typography, Box, Button } from '@mui/material'
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet'
import { motion } from 'framer-motion'

export default function BalanceCard({ balance }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%'
          }}
        />
        
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountBalanceWallet sx={{ fontSize: 32, mr: 2 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Total Balance
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Available funds
              </Typography>
            </Box>
          </Box>

          <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
            ${(balance.truth + balance.time * 2).toLocaleString()}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                TRUTH
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {balance.truth.toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                TIME
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {balance.time.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              sx={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              Deposit
            </Button>
            <Button 
              variant="contained"
              sx={{ 
                background: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { background: 'rgba(255, 255, 255, 0.3)' }
              }}
            >
              Withdraw
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}
