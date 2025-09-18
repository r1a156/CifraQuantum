import { Card, CardContent, Typography, Box } from '@mui/material'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

const data = [
  { name: 'Active Bets', value: 400 },
  { name: 'Completed', value: 300 },
  { name: 'Pending', value: 200 }
]

const COLORS = ['#667eea', '#764ba2', '#f093fb']

export default function PortfolioChart({ portfolio }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card sx={{ 
        background: '#1a1a3a', 
        borderRadius: '16px',
        height: '100%'
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: 'white' }}>
            📊 Portfolio Distribution
          </Typography>

          <Box sx={{ height: 200, mb: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {data.map((item, index) => (
              <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: COLORS[index],
                      mr: 1
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold" color="white">
                  ${item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2, p: 2, background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px' }}>
            <Typography variant="body2" color="#667eea" textAlign="center">
              📈 24h P&L: +$124.50
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}
