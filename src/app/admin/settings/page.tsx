'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Save, Store, Mail, Bell, Shield, Palette, Globe } from 'lucide-react'

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: 'Sanam International',
    storeEmail: 'info@sanaminternational.com',
    storePhone: '+92 300 1234567',
    storeAddress: 'Lahore, Pakistan',
    currency: 'PKR',
    taxRate: '17',
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    orderNotifications: true,
    stockAlerts: true,
    customerEmails: true,
    marketingEmails: false,
    lowStockThreshold: '10',
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
  })

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: '#000000',
    accentColor: '#f59e0b',
    darkMode: false,
    showBanner: true,
    bannerText: 'Free shipping on orders over Rs. 5000!',
  })

  const handleSave = async () => {
    setSaving(true)
    // TODO: Implement save API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
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
                  <p className="text-xs text-slate-500">Settings</p>
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
                onClick={handleSave} 
                disabled={saving}
                className="gap-2"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Settings</h2>
          <p className="text-slate-600">Manage your Sanam International store settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-white border-slate-200">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="bg-white border-slate-200">
            <CardHeader className="pb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">General Settings</CardTitle>
                <CardDescription className="text-slate-600">Basic store information and configuration</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-slate-700">Store Name</Label>
                  <Input
                    id="storeName"
                    value={generalSettings.storeName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail" className="text-slate-700">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeEmail: e.target.value })}
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone" className="text-slate-700">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={generalSettings.storePhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storePhone: e.target.value })}
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-slate-700">Currency</Label>
                  <Input
                    id="currency"
                    value={generalSettings.currency}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="storeAddress" className="text-slate-700">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, storeAddress: e.target.value })}
                    className="border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate" className="text-slate-700">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={generalSettings.taxRate}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, taxRate: e.target.value })}
                    className="border-slate-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email and push notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Order Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for new orders</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, orderNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get alerted when products are low in stock</p>
                  </div>
                  <Switch
                    checked={notificationSettings.stockAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, stockAlerts: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Customer Emails</Label>
                    <p className="text-sm text-muted-foreground">Send order confirmations to customers</p>
                  </div>
                  <Switch
                    checked={notificationSettings.customerEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, customerEmails: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Send promotional emails to customers</p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                    }
                  />
                </div>
                <div className="space-y-2 pt-4">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={notificationSettings.lowStockThreshold}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockThreshold: e.target.value })}
                    className="max-w-[200px]"
                  />
                  <p className="text-sm text-muted-foreground">Alert when stock falls below this number</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => 
                      setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                    }
                  />
                </div>
                <div className="space-y-2 pt-4">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                    className="max-w-[200px]"
                  />
                  <p className="text-sm text-muted-foreground">Automatically log out after inactivity</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: e.target.value })}
                    className="max-w-[200px]"
                  />
                  <p className="text-sm text-muted-foreground">Force password change after this many days</p>
                </div>
              </div>
              
              <div className="pt-6 border-t">
                <h3 className="font-semibold mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50">
                    Reset All Settings
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 ml-4">
                    Delete All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={appearanceSettings.primaryColor}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={appearanceSettings.accentColor}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, accentColor: e.target.value })}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={appearanceSettings.accentColor}
                      onChange={(e) => setAppearanceSettings({ ...appearanceSettings, accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme for admin panel</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.darkMode}
                    onCheckedChange={(checked) => 
                      setAppearanceSettings({ ...appearanceSettings, darkMode: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Announcement Banner</Label>
                    <p className="text-sm text-muted-foreground">Display promotional banner on storefront</p>
                  </div>
                  <Switch
                    checked={appearanceSettings.showBanner}
                    onCheckedChange={(checked) => 
                      setAppearanceSettings({ ...appearanceSettings, showBanner: checked })
                    }
                  />
                </div>
              </div>

              {appearanceSettings.showBanner && (
                <div className="space-y-2">
                  <Label htmlFor="bannerText">Banner Text</Label>
                  <Input
                    id="bannerText"
                    value={appearanceSettings.bannerText}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, bannerText: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
