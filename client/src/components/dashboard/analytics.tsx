import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function Analytics() {
  const [date, setDate] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  // Chart Colors
  const chartColors = [
    'hsl(var(--chart-1))', 
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))', 
    'hsl(var(--chart-4))', 
    'hsl(var(--chart-5))'
  ];

  // Mock data for the charts
  const revenueData = [
    { date: '01/07', amount: 4000 },
    { date: '02/07', amount: 3000 },
    { date: '03/07', amount: 5000 },
    { date: '04/07', amount: 7000 },
    { date: '05/07', amount: 5000 },
    { date: '06/07', amount: 8000 },
    { date: '07/07', amount: 12000 },
    { date: '08/07', amount: 10000 },
    { date: '09/07', amount: 9000 },
    { date: '10/07', amount: 11000 },
  ];
  
  const transactionData = [
    { date: '01/07', count: 120 },
    { date: '02/07', count: 90 },
    { date: '03/07', count: 150 },
    { date: '04/07', count: 200 },
    { date: '05/07', count: 180 },
    { date: '06/07', count: 220 },
    { date: '07/07', count: 300 },
    { date: '08/07', count: 280 },
    { date: '09/07', count: 250 },
    { date: '10/07', count: 320 },
  ];
  
  const paymentMethodsData = [
    { name: 'Credit Card', value: 65 },
    { name: 'Debit Card', value: 20 },
    { name: 'PayPal', value: 10 },
    { name: 'Apple Pay', value: 3 },
    { name: 'Google Pay', value: 2 },
  ];
  
  const conversionRateData = [
    { date: '01/07', rate: 75 },
    { date: '02/07', rate: 72 },
    { date: '03/07', rate: 80 },
    { date: '04/07', rate: 82 },
    { date: '05/07', rate: 79 },
    { date: '06/07', rate: 85 },
    { date: '07/07', rate: 87 },
    { date: '08/07', rate: 86 },
    { date: '09/07', rate: 88 },
    { date: '10/07', rate: 90 },
  ];
  
  const fraudData = [
    { date: '01/07', attempted: 12, prevented: 11 },
    { date: '02/07', attempted: 9, prevented: 8 },
    { date: '03/07', attempted: 15, prevented: 14 },
    { date: '04/07', attempted: 18, prevented: 17 },
    { date: '05/07', attempted: 20, prevented: 18 },
    { date: '06/07', attempted: 15, prevented: 14 },
    { date: '07/07', attempted: 25, prevented: 23 },
    { date: '08/07', attempted: 22, prevented: 21 },
    { date: '09/07', attempted: 19, prevented: 18 },
    { date: '10/07', attempted: 23, prevented: 22 },
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
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics</h1>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="w-full flex justify-start mb-4 bg-card">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Rate</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue">
          <motion.div variants={itemVariants}>
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>
                  Your revenue performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors[0]} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={chartColors[0]} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `$${value}`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                        formatter={(value) => [`$${value}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="amount" stroke={chartColors[0]} fillOpacity={1} fill="url(#colorAmount)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <motion.div variants={itemVariants}>
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>
                  Number of transactions processed over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={transactionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                        formatter={(value) => [value, 'Transactions']}
                      />
                      <Bar dataKey="count" fill={chartColors[1]} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="methods">
          <motion.div variants={itemVariants}>
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Distribution of payment methods used by your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center">
                  <ResponsiveContainer width="70%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentMethodsData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {paymentMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                        formatter={(value) => [`${value}%`, 'Usage']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="conversion">
          <motion.div variants={itemVariants}>
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>
                  Percentage of successful payments vs. attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={conversionRateData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                        formatter={(value) => [`${value}%`, 'Conversion Rate']}
                      />
                      <Line type="monotone" dataKey="rate" stroke={chartColors[2]} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="fraud">
          <motion.div variants={itemVariants}>
            <Card className="glassmorphism-dark">
              <CardHeader>
                <CardTitle>Fraud Analysis</CardTitle>
                <CardDescription>
                  Attempted vs. prevented fraudulent transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={fraudData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--card-foreground))'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="attempted" name="Attempted Fraud" fill={chartColors[3]} stackId="a" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="prevented" name="Prevented Fraud" fill={chartColors[4]} stackId="a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
