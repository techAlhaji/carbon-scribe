'use client'

import { useState } from 'react'
import { 
  Users, 
  UserPlus, 
  Settings, 
  Mail, 
  Phone, 
  Globe, 
  Shield,
  Award,
  Calendar,
  TrendingUp,
  MessageSquare,
  Clock,
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  Bell,
  CheckCircle,
  AlertCircle,
  PieChart,
  BarChart3,
  FileText,
  Target
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts'

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'roles' | 'activity' | 'analytics'>('members')
  const [selectedMember, setSelectedMember] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Team members data
  const teamMembers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Sustainability Director',
      email: 'sarah.johnson@techglobal.com',
      phone: '+1 (555) 123-4567',
      avatar: 'SJ',
      status: 'active',
      joined: '2022-03-15',
      permissions: ['admin', 'reporting', 'purchase'],
      projects: 12,
      credits: 45000,
      color: 'bg-blue-500',
      bio: 'Leads ESG strategy and carbon offset initiatives. Former climate policy advisor.'
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'Carbon Analyst',
      email: 'michael.chen@techglobal.com',
      phone: '+1 (555) 234-5678',
      avatar: 'MC',
      status: 'active',
      joined: '2023-01-20',
      permissions: ['analytics', 'reporting'],
      projects: 8,
      credits: 28000,
      color: 'bg-green-500',
      bio: 'Specializes in carbon credit analysis and portfolio optimization.'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      role: 'Compliance Manager',
      email: 'emma.wilson@techglobal.com',
      phone: '+1 (555) 345-6789',
      avatar: 'EW',
      status: 'active',
      joined: '2022-08-10',
      permissions: ['compliance', 'reporting'],
      projects: 15,
      credits: 62000,
      color: 'bg-purple-500',
      bio: 'Ensures regulatory compliance across all sustainability frameworks.'
    },
    {
      id: '4',
      name: 'David Lee',
      role: 'Project Manager',
      email: 'david.lee@techglobal.com',
      phone: '+1 (555) 456-7890',
      avatar: 'DL',
      status: 'away',
      joined: '2023-05-30',
      permissions: ['projects', 'monitoring'],
      projects: 6,
      credits: 18000,
      color: 'bg-orange-500',
      bio: 'Manages relationships with carbon credit project developers.'
    },
    {
      id: '5',
      name: 'Jessica Martinez',
      role: 'Financial Analyst',
      email: 'jessica.martinez@techglobal.com',
      phone: '+1 (555) 567-8901',
      avatar: 'JM',
      status: 'active',
      joined: '2024-01-05',
      permissions: ['finance', 'purchase'],
      projects: 4,
      credits: 12000,
      color: 'bg-pink-500',
      bio: 'Analyzes financial aspects of carbon credit investments.'
    },
    {
      id: '6',
      name: 'Robert Kim',
      role: 'Data Scientist',
      email: 'robert.kim@techglobal.com',
      phone: '+1 (555) 678-9012',
      avatar: 'RK',
      status: 'inactive',
      joined: '2023-03-22',
      permissions: ['analytics', 'data'],
      projects: 10,
      credits: 35000,
      color: 'bg-teal-500',
      bio: 'Develops algorithms for carbon credit quality assessment.'
    },
  ]

  // Team roles data
  const teamRoles = [
    { name: 'Admin', members: 2, permissions: ['Full Access'], color: '#0073e6' },
    { name: 'Analyst', members: 3, permissions: ['View', 'Analyze', 'Report'], color: '#00d4aa' },
    { name: 'Manager', members: 2, permissions: ['View', 'Purchase', 'Approve'], color: '#8b5cf6' },
    { name: 'Viewer', members: 1, permissions: ['View Only'], color: '#f59e0b' },
    { name: 'Auditor', members: 1, permissions: ['View', 'Audit'], color: '#ef4444' },
  ]

  // Team activity data
  const teamActivity = [
    { user: 'Sarah Johnson', action: 'Retired 10,000 tCO₂', time: '2 hours ago', project: 'Amazon Rainforest', icon: Award },
    { user: 'Michael Chen', action: 'Generated Portfolio Report', time: '4 hours ago', project: 'Monthly Analysis', icon: FileText },
    { user: 'Emma Wilson', action: 'Submitted CSRD Report', time: '1 day ago', project: 'Q1 2024 Compliance', icon: Shield },
    { user: 'David Lee', action: 'Added Project to Monitor', time: '2 days ago', project: 'Indonesia Mangroves', icon: Eye },
    { user: 'Jessica Martinez', action: 'Approved Credit Purchase', time: '3 days ago', project: 'Kenya Solar Farms', icon: CheckCircle },
    { user: 'Robert Kim', action: 'Updated Quality Algorithm', time: '5 days ago', project: 'Dynamic Scoring', icon: TrendingUp },
  ]

  // Team performance data
  const performanceData = [
    { month: 'Jan', retirements: 8000, purchases: 10000, reports: 3 },
    { month: 'Feb', retirements: 12000, purchases: 15000, reports: 5 },
    { month: 'Mar', retirements: 15000, purchases: 20000, reports: 7 },
    { month: 'Apr', retirements: 10000, purchases: 12000, reports: 4 },
    { month: 'May', retirements: 14000, purchases: 18000, reports: 6 },
    { month: 'Jun', retirements: 18000, purchases: 22000, reports: 8 },
  ]

  // Role distribution data for pie chart
  const roleDistributionData = teamRoles.map(role => ({
    name: role.name,
    value: role.members,
    color: role.color
  }))

  // Calculate team statistics
  const totalMembers = teamMembers.length
  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const totalProjects = teamMembers.reduce((sum, m) => sum + m.projects, 0)
  const totalCredits = teamMembers.reduce((sum, m) => sum + m.credits, 0)

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'away':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  // Filter team members based on search
  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-in">
      {/* Team Header */}
      <div className="bg-linear-to-r from-corporate-navy via-corporate-blue to-corporate-teal rounded-2xl p-6 md:p-8 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
              Team Management
            </h1>
            <p className="text-blue-100 opacity-90 max-w-2xl">
              Manage your sustainability team, assign roles, track activities, and optimize collaboration.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-50">
              <div className="text-sm text-blue-200 mb-1">Team Members</div>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <div className="text-xs text-green-300">{activeMembers} active</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-50">
              <div className="text-sm text-blue-200 mb-1">Total Projects</div>
              <div className="text-2xl font-bold">{totalProjects}</div>
              <div className="text-xs text-blue-300">Managed by team</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="corporate-card p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'members', label: 'Team Members', icon: Users },
            { id: 'roles', label: 'Roles & Permissions', icon: Shield },
            { id: 'activity', label: 'Team Activity', icon: Clock },
            { id: 'analytics', label: 'Team Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-corporate-blue text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} className="mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Team Members Tab */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Search and Actions */}
          <div className="corporate-card p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="search"
                    placeholder="Search team members by name, role, or email..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-corporate-blue"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="corporate-btn-secondary px-4 py-2">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
                <button className="corporate-btn-primary px-4 py-2">
                  <UserPlus size={16} className="mr-2" />
                  Add Member
                </button>
              </div>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div 
                key={member.id} 
                className={`corporate-card p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  selectedMember === member.id ? 'ring-2 ring-corporate-blue' : ''
                }`}
                onClick={() => setSelectedMember(member.id === selectedMember ? null : member.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`${member.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3`}>
                      {member.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{member.role}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} className="mr-2" />
                    {member.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone size={14} className="mr-2" />
                    {member.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={14} className="mr-2" />
                    Joined {new Date(member.joined).toLocaleDateString()}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Permissions</div>
                  <div className="flex flex-wrap gap-1">
                    {member.permissions.map((permission) => (
                      <span key={permission} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs">
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="font-bold text-gray-900 dark:text-white">{member.projects}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="font-bold text-gray-900 dark:text-white">{(member.credits / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Credits</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 corporate-btn-secondary text-sm px-3 py-2">
                    <MessageSquare size={14} className="mr-1" />
                    Message
                  </button>
                  <button className="flex-1 corporate-btn-primary text-sm px-3 py-2">
                    <Eye size={14} className="mr-1" />
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Member Details */}
          {selectedMember && (
            <div className="corporate-card p-6 animate-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Member Details</h2>
                <div className="flex items-center space-x-2">
                  <button className="corporate-btn-secondary px-3 py-1">
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-800 px-3 py-1">
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </button>
                </div>
              </div>
              
              {(() => {
                const member = teamMembers.find(m => m.id === selectedMember)
                if (!member) return null
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2">Biography</h3>
                        <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-corporate-blue mb-1">{member.projects}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Projects Managed</div>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">{(member.credits / 1000).toFixed(1)}K</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Credits Managed</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                      <div className="space-y-3">
                        {teamActivity
                          .filter(activity => activity.user === member.name)
                          .slice(0, 3)
                          .map((activity, index) => {
                            const Icon = activity.icon
                            return (
                              <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <div className="flex items-start">
                                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                    <Icon className="text-corporate-blue" size={16} />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                                      {activity.action}
                                    </div>
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                      {activity.time} • {activity.project}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="corporate-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Roles</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Define permissions and access levels</p>
              </div>
              <button className="corporate-btn-primary px-4 py-2">
                <UserPlus size={16} className="mr-2" />
                Create Role
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role Distribution Chart */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Role Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={roleDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {roleDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} members`, 'Count']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Role List */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">All Roles</h3>
                <div className="space-y-4">
                  {teamRoles.map((role, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: role.color }}></div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{role.name}</h4>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {role.members} member{role.members !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {role.permissions.map((permission, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                            {permission}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button className="text-sm text-corporate-blue hover:text-corporate-blue/80">
                          <Edit size={14} className="inline mr-1" />
                          Edit
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400">
                          <Users size={14} className="inline mr-1" />
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          <div className="corporate-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Activity Feed</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recent actions and updates</p>
              </div>
              <button className="corporate-btn-secondary px-4 py-2">
                <Filter size={16} className="mr-2" />
                Filter Activities
              </button>
            </div>
            
            <div className="space-y-4">
              {teamActivity.map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div key={index} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-corporate-blue/50 transition-colors">
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-4 ${
                        index === 0 ? 'bg-green-100 dark:bg-green-900/30' :
                        index === 1 ? 'bg-blue-100 dark:bg-blue-900/30' :
                        'bg-gray-100 dark:bg-gray-800/50'
                      }`}>
                        <Icon className={
                          index === 0 ? 'text-green-600 dark:text-green-400' :
                          index === 1 ? 'text-blue-600 dark:text-blue-400' :
                          'text-gray-600 dark:text-gray-400'
                        } size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-bold text-gray-900 dark:text-white">{activity.user}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</div>
                        </div>
                        <div className="text-gray-900 dark:text-white mb-1">{activity.action}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Project: {activity.project}</div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-600 dark:hover:text-gray-400 ml-2">
                        <Bell size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <button className="w-full mt-6 corporate-btn-secondary py-3">
              <ChevronRight size={16} className="mr-2" />
              Load More Activities
            </button>
          </div>
        </div>
      )}

      {/* Team Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="corporate-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Performance Analytics</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monthly team contributions and impact</p>
              </div>
              <Target className="text-corporate-blue" size={24} />
            </div>
            
            <div className="h-72 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      const displayValue = typeof value === 'number' ? value.toLocaleString() : String(value ?? '')
                      if (name === 'retirements') return [`${displayValue} tCO₂`, 'Retirements']
                      if (name === 'purchases') return [`${displayValue} tCO₂`, 'Purchases']
                      return [value, 'Reports Generated']
                    }}
                  />
                  <Bar dataKey="retirements" fill="#0073e6" name="Credits Retired" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="purchases" fill="#00d4aa" name="Credits Purchased" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reports" fill="#8b5cf6" name="Reports Generated" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                <div className="text-2xl font-bold text-corporate-blue mb-1">
                  {(performanceData.reduce((sum, m) => sum + m.retirements, 0) / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Credits Retired</div>
              </div>
              <div className="p-4 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {(performanceData.reduce((sum, m) => sum + m.purchases, 0) / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Credits Purchased</div>
              </div>
              <div className="p-4 bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {performanceData.reduce((sum, m) => sum + m.reports, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Reports Generated</div>
              </div>
            </div>
          </div>
          
          {/* Team Collaboration Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="corporate-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Collaboration Score</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Team collaboration effectiveness</p>
                </div>
                <div className="text-2xl font-bold text-corporate-blue">87/100</div>
              </div>
              <div className="space-y-3">
                {[
                  { metric: 'Cross-team Projects', score: 92, trend: 'up' },
                  { metric: 'Document Sharing', score: 85, trend: 'up' },
                  { metric: 'Meeting Participation', score: 78, trend: 'stable' },
                  { metric: 'Feedback Response', score: 91, trend: 'up' },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-900 dark:text-white">{item.metric}</span>
                      <span className="font-medium">{item.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.score >= 90 ? 'bg-green-500' :
                          item.score >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="corporate-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Team Health</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Well-being and engagement metrics</p>
                </div>
                <PieChart className="text-corporate-blue" size={24} />
              </div>
              <div className="space-y-4">
                {[
                  { aspect: 'Engagement', value: 88, status: 'Excellent', color: 'bg-green-500' },
                  { aspect: 'Workload Balance', value: 72, status: 'Good', color: 'bg-blue-500' },
                  { aspect: 'Skill Development', value: 65, status: 'Moderate', color: 'bg-yellow-500' },
                  { aspect: 'Recognition', value: 81, status: 'Good', color: 'bg-teal-500' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${item.color}`}></div>
                      <span className="text-gray-900 dark:text-white">{item.aspect}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 dark:text-white">{item.value}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{item.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Tools & Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="corporate-card p-5 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <MessageSquare className="text-corporate-blue mr-3" size={24} />
            <div>
              <div className="font-bold text-gray-900 dark:text-white group-hover:text-corporate-blue">
                Team Chat
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Internal communication</div>
            </div>
          </div>
        </button>
        <button className="corporate-card p-5 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <Calendar className="text-corporate-blue mr-3" size={24} />
            <div>
              <div className="font-bold text-gray-900 dark:text-white group-hover:text-corporate-blue">
                Team Calendar
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Schedule meetings & deadlines</div>
            </div>
          </div>
        </button>
        <button className="corporate-card p-5 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center">
            <FileText className="text-corporate-blue mr-3" size={24} />
            <div>
              <div className="font-bold text-gray-900 dark:text-white group-hover:text-corporate-blue">
                Team Documents
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Shared resources & files</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}