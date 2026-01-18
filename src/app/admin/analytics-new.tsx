'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Users, ShoppingBag, DollarSign, Package, Filter, Download, RefreshCw, LogOut, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Simple mock data
  const stats = {
    totalRevenue: 'Rs. 12,45,678',
    growthRate: '+15.3%',
    totalOrders: 1234,
    totalCustomers: 856,
    averageOrderValue: 'Rs. 3,450'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-slate-600 mt-4">Loading analytics...</p>
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
                  <p className="text-xs text-slate-500">Analytics</p>
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
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline" 
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

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{stats.totalRevenue}</p>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">{stats.growthRate}</span>
                </div>
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
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{stats.totalOrders.toLocaleString()}</p>
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
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{stats.totalCustomers.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Customers</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-slate-900">{stats.averageOrderValue}</p>
                <p className="text-sm text-slate-600">Avg. Order Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Sales Performance</CardTitle>
                <p className="text-sm text-slate-600">Revenue and order trends</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="text-slate-600">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg">Sales Chart</p>
                  <p className="text-sm">Interactive charts coming soon...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Customer Analytics</CardTitle>
                <p className="text-sm text-slate-600">Customer behavior and insights</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="text-slate-600">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-lg">Customer Insights</p>
                  <p className="text-sm">Customer analytics coming soon...</p>
                </div>
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
          <CardContent className="p-6">
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
                <span className="font-medium">View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
