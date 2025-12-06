import React, { useEffect, useState } from 'react'
import { Users, UserPlus, TrendingUp, ArrowUpRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, new: 0, converted: 0 })
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      // Fetch stats
      const { count: totalCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      const { count: newCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

      // Fetch recent leads
      const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        total: totalCount || 0,
        new: newCount || 0,
        converted: 0 // Placeholder logic
      })
      setRecentLeads(leads || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="card p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-text-main">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
          <Icon size={24} className={color.replace('bg-', 'text-')} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-success">
        <TrendingUp size={16} className="mr-1" />
        <span className="font-medium">{trend}</span>
        <span className="text-text-muted ml-1">vs last month</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={Users}
          color="bg-primary"
          trend="+12%"
        />
        <StatCard
          title="New Leads"
          value={stats.new}
          icon={UserPlus}
          color="bg-secondary"
          trend="+5%"
        />
        <StatCard
          title="Conversion Rate"
          value="0%"
          icon={ArrowUpRight}
          color="bg-success"
          trend="+2.4%"
        />
      </div>

      {/* Recent Leads */}
      <div className="card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-lg">Recent Leads</h3>
          <button className="btn btn-ghost text-sm">View All</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{format(new Date(lead.created_at), 'MMM d, yyyy')}</td>
                  <td>{lead.email || '-'}</td>
                  <td>{lead.phone || '-'}</td>
                  <td>
                    <span className={`badge badge-${lead.status?.toLowerCase() || 'new'}`}>
                      {lead.status || 'New'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-text-muted">
                    No leads found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
