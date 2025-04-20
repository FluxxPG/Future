import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, CreditCard, DollarSign, ShoppingCart, Users } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview() {
  // Fetch transaction summary data
  const { data: transactionData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
    initialData: [] // Fall back to empty array if no data yet
  });
  
  // Mock summary stats - in a real app these would be calculated from transaction data
  const statCards = [
    {
      title: "Total Revenue",
      value: "$12,456.78",
      change: "+14.5%",
      isUp: true,
      icon: <DollarSign className="h-6 w-6 text-primary" />,
      color: "primary"
    },
    {
      title: "Transactions",
      value: "1,342",
      change: "+7.2%",
      isUp: true,
      icon: <ShoppingCart className="h-6 w-6 text-green-500" />,
      color: "green"
    },
    {
      title: "Successful Payments",
      value: "98.7%",
      change: "+1.3%",
      isUp: true,
      icon: <CreditCard className="h-6 w-6 text-blue-500" />,
      color: "blue"
    },
    {
      title: "Active Customers",
      value: "452",
      change: "-2.4%",
      isUp: false,
      icon: <Users className="h-6 w-6 text-secondary" />,
      color: "secondary"
    }
  ];
  
  // Mock chart data - would come from API in real app
  const chartData = [
    { date: 'Jan', revenue: 4000 },
    { date: 'Feb', revenue: 3000 },
    { date: 'Mar', revenue: 5000 },
    { date: 'Apr', revenue: 7000 },
    { date: 'May', revenue: 5000 },
    { date: 'Jun', revenue: 8000 },
    { date: 'Jul', revenue: 12000 },
  ];
  
  // Mock recent transactions - would come from API in real app
  const recentTransactions = [
    { id: 1, customer: 'Sarah Johnson', amount: 49.99, status: 'succeeded', date: '2023-07-10', method: 'card' },
    { id: 2, customer: 'Alex Chen', amount: 129.00, status: 'succeeded', date: '2023-07-09', method: 'paypal' },
    { id: 3, customer: 'Maria Garcia', amount: 79.50, status: 'succeeded', date: '2023-07-09', method: 'card' },
    { id: 4, customer: 'James Smith', amount: 299.99, status: 'failed', date: '2023-07-08', method: 'card' },
    { id: 5, customer: 'Emma Wilson', amount: 19.99, status: 'succeeded', date: '2023-07-08', method: 'apple' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-muted-foreground">
          Updated {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="glassmorphism-dark">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-2 rounded-full bg-${stat.color}/10`}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`flex items-center mt-4 text-sm ${
                  stat.isUp ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.isUp ? 
                    <ArrowUp className="h-4 w-4 mr-1" /> : 
                    <ArrowDown className="h-4 w-4 mr-1" />
                  }
                  <span>{stat.change} vs. last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Revenue Chart */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="glassmorphism-dark">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Your revenue trends over the past months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tickFormatter={value => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--popover-foreground))'
                    }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1}
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Recent Transactions */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="glassmorphism-dark">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest payment transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 py-3 px-4 text-sm font-medium border-b">
                <div>Customer</div>
                <div>Amount</div>
                <div>Status</div>
                <div>Payment Method</div>
                <div>Date</div>
              </div>
              <div className="divide-y">
                {recentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="grid grid-cols-5 py-3 px-4 items-center text-sm"
                  >
                    <div>{transaction.customer}</div>
                    <div>${transaction.amount.toFixed(2)}</div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'succeeded' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                    <div className="capitalize">{transaction.method}</div>
                    <div>{new Date(transaction.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
