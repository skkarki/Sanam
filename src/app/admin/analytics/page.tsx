'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Users, ShoppingBag, DollarSign, Eye, Calendar, Filter, Download, LogOut, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface AnalyticsData {
  overview: {
    totalRevenue: string
    growthRate: string
    totalOrders: number
    totalCustomers: number
    averageOrderValue: string
    conversionRate: string
    cartAbandonmentRate: string
    returningCustomerRate: string
  }
  sales: Array<{
    date: string
    sales: number
    revenue: number
    orders: number
  }>
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: string
    growth: number
  }>
  categories: Array<{
    name: string
    sales: number
    revenue: string
    percentage: number
  }>
  traffic: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  conversionFunnel: {
    visitors: number
    addToCart: number
    checkout: number
    purchase: number
  }
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true)
      else setLoading(true)
      
      const response = await fetch(`/api/admin/analytics?range=${dateRange}`)
      
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      } else {
        // Enhanced fallback data
        setAnalytics({
          overview: {
            totalRevenue: 'Rs. 12,45,678',
            growthRate: '+15.3%',
            totalOrders: 1234,
            totalCustomers: 856,
            averageOrderValue: 'Rs. 3,450',
            conversionRate: '3.2%',
            cartAbandonmentRate: '68.5%',
            returningCustomerRate: '42.3%'
          },
          sales: [
            { date: 'Mon', sales: 45, revenue: 156000, orders: 12 },
            { date: 'Tue', sales: 52, revenue: 189000, orders: 15 },
            { date: 'Wed', sales: 48, revenue: 167000, orders: 14 },
            { date: 'Thu', sales: 61, revenue: 234000, orders: 18 },
            { date: 'Fri', sales: 55, revenue: 198000, orders: 16 },
            { date: 'Sat', sales: 67, revenue: 289000, orders: 20 },
            { date: 'Sun', sales: 72, revenue: 312000, orders: 22 },
          ],
          topProducts: [
            { id: '1', name: 'Premium T-Shirt', sales: 145, revenue: 'Rs. 4,35,000', growth: 12.5 },
            { id: '2', name: 'Classic Jeans', sales: 98, revenue: 'Rs. 6,86,000', growth: 8.3 },
            { id: '3', name: 'Summer Dress', sales: 87, revenue: 'Rs. 5,22,000', growth: -2.1 },
            { id: '4', name: 'Sports Shoes', sales: 76, revenue: 'Rs. 7,60,000', growth: 15.7 },
            { id: '5', name: 'Leather Bag', sales: 65, revenue: 'Rs. 5,85,000', growth: 6.2 },
          ],
          categories: [
            { name: 'Clothing', sales: 456, revenue: 'Rs. 12,34,000', percentage: 45 },
            { name: 'Accessories', sales: 234, revenue: 'Rs. 8,90,000', percentage: 28 },
            { name: 'Footwear', sales: 189, revenue: 'Rs. 9,45,000', percentage: 18 },
            { name: 'Electronics', sales: 98, revenue: 'Rs. 6,78,000', percentage: 9 },
          ],
          traffic: [
            { source: 'Direct', visitors: 3456, percentage: 35 },
            { source: 'Social Media', visitors: 2890, percentage: 29 },
            { source: 'Search', visitors: 2134, percentage: 22 },
            { source: 'Email', visitors: 1234, percentage: 12 },
            { source: 'Referral', visitors: 456, percentage: 5 },
          ],
          conversionFunnel: {
            visitors: 12456,
            addToCart: 2342,
            checkout: 892,
            purchase: 756
          }
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
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

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
            <p className="text-muted-foreground">View and analyze your store performance</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/admin'} variant="outline">
              ← Back to Dashboard
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading analytics...</p>
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
                  <p className="text-xs text-slate-500">Analytics & Reports</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => window.location.href = '/admin'} 
                variant="outline" 
                size="sm" 
                className="gap-2 border-slate-200 hover:bg-slate-50"
              >
                ← Back to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => fetchAnalytics(true)}
                disabled={refreshing}
                size="sm" 
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
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Analytics & Reports</h2>
          <p className="text-slate-600">View and analyze your Sanam International store performance</p>
        </div>

        {/* Filters */}
        <Card className="bg-white border-slate-200 mb-8">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px] border-slate-200">
                  <Calendar className="h-4 w-4 mr-2" />
                  Last {dateRange} Days
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>

              <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">{analytics.overview.growthRate}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalRevenue}</p>
                <p className="text-sm text-slate-600">Total Revenue</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">
                  <ArrowUpRight className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">+12 today</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalOrders.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Orders</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded-full">
                  <ArrowUpRight className="h-3 w-3 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">+24 this week</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{analytics.overview.totalCustomers.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Customers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full">
                  <ArrowUpRight className="h-3 w-3 text-orange-600" />
                  <span className="text-xs font-medium text-orange-600">+5.2%</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{analytics.overview.averageOrderValue}</p>
                <p className="text-sm text-slate-600">Avg. Order Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">Conversion Rate</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{analytics.overview.conversionRate}</div>
                      <p className="text-xs text-slate-600">Visitors to purchases</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600">+0.3%</div>
                      <p className="text-xs text-slate-600">vs last month</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">Cart Abandonment</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{analytics.overview.cartAbandonmentRate}</div>
                      <p className="text-xs text-slate-600">Carts not completed</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-red-600">-2.1%</div>
                      <p className="text-xs text-slate-600">improvement</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">Returning Customers</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">{analytics.overview.returningCustomerRate}</div>
                      <p className="text-xs text-slate-600">Repeat purchases</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-green-600">+3.7%</div>
                      <p className="text-xs text-slate-600">vs last month</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Sales Chart */}
          <Card className="lg:col-span-2 bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Sales Overview</CardTitle>
                <p className="text-sm text-slate-600">Revenue and orders over time</p>
              </div>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  orders: {
                    label: "Orders",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.sales}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
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

          {/* Top Products */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Top Products</CardTitle>
                <p className="text-sm text-slate-600">Best selling items</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topProducts && analytics.topProducts.length > 0 ? (
                  analytics.topProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
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
                        <p className="font-semibold text-slate-900">{product.revenue}</p>
                        <div className="flex items-center gap-1">
                          {product.growth > 0 ? (
                            <ArrowUpRight className="h-3 w-3 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 text-red-600" />
                          )}
                          <span className={`text-xs ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.growth > 0 ? '+' : ''}{product.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No product data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Traffic Sources</CardTitle>
                <p className="text-sm text-slate-600">Visitor origins</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.traffic && analytics.traffic.length > 0 ? (
                  analytics.traffic.map((source, index) => (
                    <div key={source.source} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{source.source}</span>
                        <span className="text-sm text-slate-600">{source.visitors.toLocaleString()} ({source.percentage}%)</span>
                      </div>
                      <Progress value={source.percentage} className="h-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No traffic data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Performance */}
        <Card className="bg-white border-slate-200 mb-8">
          <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Category Performance</CardTitle>
              <p className="text-sm text-slate-600">Sales by product category</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {analytics.categories && analytics.categories.length > 0 ? (
                analytics.categories.map((category, index) => (
                  <div key={category.name} className="border border-slate-100 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-slate-900">{category.name}</h3>
                      <Badge variant="outline" className="border-slate-200">{category.sales} sales</Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-3">{category.revenue}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Market Share</span>
                        <span className="font-medium text-slate-900">{category.percentage}%</span>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-8 text-muted-foreground">
                  No category data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="bg-white border-slate-200">
          <CardHeader className="pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Conversion Funnel</CardTitle>
              <p className="text-sm text-slate-600">Customer journey analysis</p>
            </div>
          </CardHeader>
          <CardContent>
            {analytics.conversionFunnel ? (
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{analytics.conversionFunnel.visitors?.toLocaleString() || 0}</div>
                  <div className="text-sm font-medium text-slate-900">Visitors</div>
                  <div className="text-xs text-slate-600 mt-1">100%</div>
                </div>
                <div className="text-center p-6 border-2 border-purple-200 rounded-lg bg-purple-50">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{analytics.conversionFunnel.addToCart?.toLocaleString() || 0}</div>
                  <div className="text-sm font-medium text-slate-900">Added to Cart</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {analytics.conversionFunnel.visitors ? ((analytics.conversionFunnel.addToCart / analytics.conversionFunnel.visitors) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="text-center p-6 border-2 border-orange-200 rounded-lg bg-orange-50">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{analytics.conversionFunnel.checkout?.toLocaleString() || 0}</div>
                  <div className="text-sm font-medium text-slate-900">Checkout Started</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {analytics.conversionFunnel.visitors ? ((analytics.conversionFunnel.checkout / analytics.conversionFunnel.visitors) * 100).toFixed(1) : 0}%
                  </div>
                </div>
                <div className="text-center p-6 border-2 border-green-200 rounded-lg bg-green-50">
                  <div className="text-3xl font-bold text-green-600 mb-2">{analytics.conversionFunnel.purchase?.toLocaleString() || 0}</div>
                  <div className="text-sm font-medium text-slate-900">Purchase Completed</div>
                  <div className="text-xs text-slate-600 mt-1">
                    {analytics.conversionFunnel.visitors ? ((analytics.conversionFunnel.purchase / analytics.conversionFunnel.visitors) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No conversion funnel data available
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}