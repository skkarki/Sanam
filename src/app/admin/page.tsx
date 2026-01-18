'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ShoppingBag, Users, TrendingUp, Package, LogOut, Eye, Edit, Trash2, Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle, Clock, Truck } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface Stat {
  title: string
  value: string
  icon: React.ReactNode
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

interface Order {
  id: string
  customer: string
  customerEmail: string
  date: string
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  items: number
  paymentMethod: string
}

interface SalesData {
  date: string
  sales: number
  orders: number
}

interface TopProduct {
  name: string
  sales: number
  revenue: number
}

interface CustomerStats {
  new: number
  returning: number
  total: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('7d')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      
      const [statsResponse, ordersResponse, salesResponse] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders?limit=10'),
        fetch('/api/admin/sales-chart')
      ])
      
      // Handle stats
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats([
          {
            title: 'Total Orders',
            value: statsData.totalOrders?.toLocaleString() || '0',
            icon: <Package className="h-5 w-5 text-blue-600" />,
            change: statsData.ordersChange || '+12%',
            trend: 'up'
          },
          {
            title: 'Total Sales',
            value: `Rs. ${statsData.totalSales?.toLocaleString() || '0'}`,
            icon: <TrendingUp className="h-5 w-5 text-green-600" />,
            change: statsData.salesChange || '+8%',
            trend: 'up'
          },
          {
            title: 'Active Products',
            value: statsData.activeProducts?.toLocaleString() || '0',
            icon: <ShoppingBag className="h-5 w-5 text-purple-600" />,
            change: statsData.productsChange || '+5%',
            trend: 'up'
          },
          {
            title: 'Customers',
            value: statsData.totalCustomers?.toLocaleString() || '0',
            icon: <Users className="h-5 w-5 text-orange-600" />,
            change: statsData.customersChange || '+15%',
            trend: 'up'
          },
        ])
        
        setCustomerStats({
          new: statsData.newCustomers || 0,
          returning: statsData.returningCustomers || 0,
          total: statsData.totalCustomers || 0
        })
      } else {
        // Enhanced fallback stats
        setStats([
          {
            title: 'Total Orders',
            value: '1,234',
            icon: <Package className="h-5 w-5 text-blue-600" />,
            change: '+12%',
            trend: 'up'
          },
          {
            title: 'Total Sales',
            value: 'Rs. 4,52,350',
            icon: <TrendingUp className="h-5 w-5 text-green-600" />,
            change: '+8%',
            trend: 'up'
          },
          {
            title: 'Active Products',
            value: '156',
            icon: <ShoppingBag className="h-5 w-5 text-purple-600" />,
            change: '+5%',
            trend: 'up'
          },
          {
            title: 'Customers',
            value: '8,542',
            icon: <Users className="h-5 w-5 text-orange-600" />,
            change: '+15%',
            trend: 'up'
          },
        ])
        
        setCustomerStats({
          new: 234,
          returning: 8308,
          total: 8542
        })
      }
      
      // Handle orders
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setRecentOrders(ordersData.orders || [])
      } else {
        // Enhanced fallback orders
        setRecentOrders([
          {
            id: 'ORD-20250120-7K3M',
            customer: 'Rajesh Shrestha',
            customerEmail: 'rajesh@example.com',
            date: '2025-01-20',
            total: 15000,
            status: 'delivered',
            items: 3,
            paymentMethod: 'esewa'
          },
          {
            id: 'ORD-20250119-XJ8N',
            customer: 'Sita Karki',
            customerEmail: 'sita@example.com',
            date: '2025-01-19',
            total: 8500,
            status: 'processing',
            items: 2,
            paymentMethod: 'khalti'
          },
          {
            id: 'ORD-20250118-QP9L',
            customer: 'Bibek Thapa',
            customerEmail: 'bibek@example.com',
            date: '2025-01-18',
            total: 12200,
            status: 'shipped',
            items: 4,
            paymentMethod: 'cod'
          },
          {
            id: 'ORD-20250117-MK5N',
            customer: 'Anita Sharma',
            customerEmail: 'anita@example.com',
            date: '2025-01-17',
            total: 22500,
            status: 'pending',
            items: 5,
            paymentMethod: 'esewa'
          },
        ])
      }
      
      // Handle sales chart data
      if (salesResponse.ok) {
        const salesData = await salesResponse.json()
        setSalesData(salesData || [])
      } else {
        // Fallback sales data
        setSalesData([
          { date: 'Mon', sales: 45000, orders: 12 },
          { date: 'Tue', sales: 52000, orders: 15 },
          { date: 'Wed', sales: 48000, orders: 14 },
          { date: 'Thu', sales: 61000, orders: 18 },
          { date: 'Fri', sales: 55000, orders: 16 },
          { date: 'Sat', sales: 67000, orders: 20 },
          { date: 'Sun', sales: 72000, orders: 22 },
        ])
      }
      
      // Set top products
      setTopProducts([
        { name: 'Premium T-Shirt', sales: 145, revenue: 435000 },
        { name: 'Classic Jeans', sales: 98, revenue: 686000 },
        { name: 'Summer Dress', sales: 87, revenue: 522000 },
        { name: 'Sports Shoes', sales: 76, revenue: 760000 },
        { name: 'Leather Bag', sales: 65, revenue: 585000 },
      ])
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        // Redirect to login page after logout
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: <Clock className="h-3 w-3" />, label: 'Pending' },
      processing: { variant: 'default' as const, icon: <RefreshCw className="h-3 w-3" />, label: 'Processing' },
      shipped: { variant: 'outline' as const, icon: <Truck className="h-3 w-3" />, label: 'Shipped' },
      delivered: { variant: 'default' as const, icon: <CheckCircle className="h-3 w-3" />, label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, icon: <AlertCircle className="h-3 w-3" />, label: 'Cancelled' },
    }
    
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const filteredOrders = recentOrders.filter(order => 
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-lg font-bold text-white">SI</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Sanam International</h1>
                  <p className="text-xs text-slate-500">Admin Dashboard</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className="gap-2 border-slate-200 hover:bg-slate-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm" 
                className="gap-2 border-slate-200 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, Admin!</h2>
          <p className="text-slate-600">Here's what's happening with your Sanam International store today.</p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    {stat.icon}
                  </div>
                  {stat.change && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium text-green-600">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Sales Overview</CardTitle>
                  <p className="text-sm text-slate-600">Revenue and orders over time</p>
                </div>
                <div className="flex gap-2">
                  {['7d', '30d', '90d'].map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className={selectedPeriod === period ? 'bg-blue-600 hover:bg-blue-700' : 'border-slate-200 hover:bg-slate-50'}
                    >
                      {period === '7d' ? '7D' : period === '30d' ? '30D' : '90D'}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                  orders: {
                    label: "Orders",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorSales)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorOrders)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Customer Analytics</CardTitle>
                <p className="text-sm text-slate-600">Customer distribution</p>
              </div>
            </CardHeader>
            <CardContent>
              {customerStats && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">New Customers</span>
                      <span className="text-sm font-semibold text-slate-900">{customerStats.new}</span>
                    </div>
                    <Progress value={(customerStats.new / customerStats.total) * 100} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Returning</span>
                      <span className="text-sm font-semibold text-slate-900">{customerStats.returning}</span>
                    </div>
                    <Progress value={(customerStats.returning / customerStats.total) * 100} className="h-2" />
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Total Customers</span>
                      <span className="text-lg font-bold text-blue-600">{customerStats.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Top Products */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Recent Orders */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Recent Orders</CardTitle>
                  <p className="text-sm text-slate-600">Latest customer orders</p>
                </div>
                <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm text-slate-900">{order.customer}</p>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-slate-500">{order.id} • {order.items} items • {order.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">Rs. {order.total.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Top Products</CardTitle>
                  <p className="text-sm text-slate-600">Best selling items</p>
                </div>
                <Button variant="outline" size="sm" className="border-slate-200 hover:bg-slate-50">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.sales} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">Rs. {product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
              <p className="text-sm text-slate-600">Common administrative tasks</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button className="h-20 flex-col gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700" variant="outline">
                <Package className="h-6 w-6" />
                <span className="font-medium">Add Product</span>
              </Button>
              <Button className="h-20 flex-col gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700" variant="outline">
                <ShoppingBag className="h-6 w-6" />
                <span className="font-medium">Manage Orders</span>
              </Button>
              <Button className="h-20 flex-col gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700" variant="outline">
                <Users className="h-6 w-6" />
                <span className="font-medium">View Customers</span>
              </Button>
              <Button className="h-20 flex-col gap-2 bg-white border-slate-200 hover:bg-slate-50 text-slate-700" variant="outline">
                <TrendingUp className="h-6 w-6" />
                <span className="font-medium">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}