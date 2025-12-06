import React, { useEffect, useState } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'
import LeadDetail from './LeadDetail'

export default function LeadsTable() {
  const [leads, setLeads] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const PAGE_SIZE = 10

  useEffect(() => {
    fetchLeads()
  }, [page, filter, search])

  async function fetchLeads() {
    setLoading(true)
    try {
      let query = supabase
        .from('leads')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      if (search) {
        query = query.or(`email.ilike.%${search}%,phone.ilike.%${search}%`)
      }

      const { data, count, error } = await query

      if (error) throw error

      setLeads(data || [])
      setTotalPages(Math.ceil((count || 0) / PAGE_SIZE))
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            placeholder="Search by email or phone..."
            className="input pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-text-muted" />
            <select
              className="input w-40"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Parent Name</th>
                <th>Program</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">Loading...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-text-muted">No leads found.</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{format(new Date(lead.created_at), 'MMM d, yyyy HH:mm')}</td>
                    <td>
                      <div className="font-medium">{lead.parent_name || 'N/A'}</div>
                      <div className="text-xs text-text-muted">{lead.email}</div>
                    </td>
                    <td>{lead.program_interest || '-'}</td>
                    <td>{lead.phone || '-'}</td>
                    <td>
                      <span className={`badge badge-${lead.status?.toLowerCase() || 'new'}`}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost p-2"
                        title="View Details"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table >
        </div >

        {/* Pagination */}
        < div className="p-4 border-t border-border flex items-center justify-between" >
          <span className="text-sm text-text-muted">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <button
              className="btn btn-ghost p-2"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="btn btn-ghost p-2"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div >
      </div >
      {selectedLead && (
        <LeadDetail
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={() => {
            fetchLeads()
            // Optional: Keep modal open or close it
          }}
        />
      )}
    </div >
  )
}
