import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import TrendingUp from '@mui/icons-material/TrendingUp'
import TrendingDown from '@mui/icons-material/TrendingDown'
import Schedule from '@mui/icons-material/Schedule'
import People from '@mui/icons-material/People'
import { useApp } from '../context/AppContext'
import { motion } from 'framer-motion'

export default function MarketCard({ market }) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [prediction, setPrediction] = useState(true)
  const { placeBet, balance } = useApp()

  const handleBet = async () => {
    const betAmount = parseFloat(amount)
    if (betAmount > 0 && betAmount <= balance.truth) {
      const success = await placeBet(market.event_id, betAmount, prediction)
      if (success) {
        setOpen(false)
        setAmount('')
      }
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card sx={{ 
          background: 'linear-gradient(135deg, #1a1a3a 0%, #2d2d5a 100%)',
          border: '1px solid #667eea33',
          borderRadius: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#667eea',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }
        }}
        onClick={() => setOpen(true)}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                {market.description}
              </Typography>
              <Chip 
                label="Active" 
                color="success" 
                size="small"
                sx={{ background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                Ends: {new Date(market.end_time * 1000).toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingUp sx={{ fontSize: 16, mr: 1, color: '#4caf50' }} />
                  <Typography variant="body2" color="#4caf50">
                    YES 65%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingDown sx={{ fontSize: 16, mr: 1, color: '#f44336' }} />
                  <Typography variant="body2" color="#f44336">
                    NO 35%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={65} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  background: 'rgba(244, 67, 54, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                  }
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  124 traders
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                size="small"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)'
                  }
                }}
              >
                Trade
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Place Your Bet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {market.description}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
            <FormLabel component="legend">Your Prediction</FormLabel>
            <RadioGroup
              value={prediction}
              onChange={(e) => setPrediction(e.target.value === 'true')}
            >
              <FormControlLabel 
                value={true} 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ color: '#4caf50', mr: 1 }} />
                    <Typography>YES (2.5x)</Typography>
                  </Box>
                } 
              />
              <FormControlLabel 
                value={false} 
                control={<Radio />} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingDown sx={{ color: '#f44336', mr: 1 }} />
                    <Typography>NO (3.8x)</Typography>
                  </Box>
                } 
              />
            </RadioGroup>
          </FormControl>

          <TextField
            fullWidth
            label="Amount (TRUTH)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 0, max: balance.truth }}
            helperText={`Available: ${balance.truth} TRUTH`}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBet}
            variant="contained"
            disabled={!amount || parseFloat(amount) > balance.truth}
          >
            Place Bet
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
