import React, { useState } from 'react'
import { X, Mail, Phone, Globe, Clock, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'

export default function LeadDetail({ lead, onClose, onUpdate }) {
  const [status, setStatus] = useState(lead.status || 'new')
  const [updating, setUpdating] = useState(false)

  if (!lead) return null

  async function handleStatusChange(newStatus) {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', lead.id)

      if (error) throw error

      setStatus(newStatus)
      onUpdate()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-2xl mx-4 overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between bg-background">
          <h2 className="text-xl font-semibold">Lead Details</h2>
          <button onClick={onClose} className="btn btn-ghost p-2 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Contact Info</label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3 text-text-main">
                  <span className="font-medium">{lead.parent_name || 'No Name'}</span>
                  <span className="text-xs text-text-muted">(Parent)</span>
                </div>
                <div className="flex items-center gap-3 text-text-main">
                  <Mail size={18} className="text-text-muted" />
                  <span>{lead.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-text-main">
                  <Phone size={18} className="text-text-muted" />
                  <span>{lead.phone || 'No phone provided'}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Interest Details</label>
              <div className="mt-3 space-y-3">
                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="text-xs text-text-muted mb-1">Child's Name</div>
                  <div className="font-medium">{lead.child_name || 'Not provided'}</div>
                </div>
                <div className="p-3 bg-background rounded-lg border border-border">
                  <div className="text-xs text-text-muted mb-1">Program Interest</div>
                  <div className="font-medium text-primary">{lead.program_interest || 'Not selected'}</div>
                </div>
              </div>
            </div>

            {lead.message && (
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Message</label>
                <div className="mt-2 p-3 bg-background rounded-lg border border-border text-sm">
                  {lead.message}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Source Info</label>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3 text-text-main">
                  <Globe size={18} className="text-text-muted" />
                  <span className="truncate max-w-[200px]" title={lead.page_url}>{lead.page_url || 'Unknown Page'}</span>
                </div>
                <div className="flex items-center gap-3 text-text-main">
                  <Clock size={18} className="text-text-muted" />
                  <span>{lead.timezone || 'Unknown Timezone'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Status</label>
                <div className="mt-3">
                  <select
                    className="input w-full"
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updating}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">Metadata</label>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3 text-text-main">
                    <Calendar size={18} className="text-text-muted" />
                    <span>Created: {format(new Date(lead.created_at), 'PPP p')}</span>
                  </div>
                  <div className="text-sm text-text-muted bg-background p-3 rounded-lg border border-border">
                    <span className="font-medium">User Agent:</span>
                    <p className="mt-1 line-clamp-2 text-xs">{lead.user_agent}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="p-6 border-t border-border bg-background flex justify-end gap-3">
          <button onClick={onClose} className="btn btn-ghost">Close</button>
          <button className="btn btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}
