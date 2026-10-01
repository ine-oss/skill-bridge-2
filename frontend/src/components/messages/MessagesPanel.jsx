import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import AsyncState from '../common/AsyncState'
import useApi from '../../hooks/useApi'
import { label, timeAgo } from '../../lib/format'
import { messageService } from '../../services/communicationService'

/**
 * Two-pane inbox backed by /api/messages.
 * Open a new conversation with a link like `/employer/messages?to=<userId>`.
 */
export default function MessagesPanel({ inboxTitle = 'Inbox' }) {
  const [searchParams] = useSearchParams()
  const conversations = useApi(() => messageService.getConversations(), [])
  const [activeId, setActiveId] = useState(searchParams.get('to'))
  const list = conversations.data?.data || []
  const selectedId = activeId || list[0]?.user.id
  const thread = useApi(selectedId ? () => messageService.getThread(selectedId) : null, [selectedId])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  // Opening a thread marks it read on the server; mirror that in the list.
  const openConversation = (userId) => {
    setActiveId(userId)
    conversations.setData((current) => current && { data: current.data.map((item) => item.user.id === userId ? { ...item, unread: 0 } : item) })
  }

  const sendReply = async (event) => {
    event.preventDefault()
    const body = reply.trim()
    if (!body || !selectedId) return
    setSending(true)
    setError('')
    try {
      const { message } = await messageService.send(selectedId, body)
      thread.setData((current) => ({ ...current, messages: [...current.messages, { ...message, fromMe: true }] }))
      setReply('')
      conversations.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const other = thread.data?.user

  return (
    <section className="grid min-h-[540px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="border-b border-slate-100 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4"><MessageSquare size={17} className="text-blue-700" /><h2 className="font-bold text-slate-900">{inboxTitle}</h2></div>
        <AsyncState loading={conversations.loading && !conversations.data} error={conversations.error} onRetry={conversations.reload} empty={list.length === 0 && !activeId} emptyTitle="No conversations yet" emptyText="Messages you send or receive will appear here.">
          <div className="divide-y divide-slate-100">
            {list.map((conversation) => (
              <button key={conversation.user.id} type="button" onClick={() => openConversation(conversation.user.id)} className={`w-full p-4 text-left transition ${selectedId === conversation.user.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}>
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">{conversation.user.initials}</span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800">{conversation.user.name}</span>
                      {conversation.unread > 0 && <span className="rounded-full bg-blue-600 px-1.5 text-[11px] font-bold text-white" aria-label={`${conversation.unread} unread`}>{conversation.unread}</span>}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">{label(conversation.user.role)} · {timeAgo(conversation.lastMessage.createdAt)}</span>
                    <span className="mt-2 block truncate text-xs text-slate-500">{conversation.lastMessage.fromMe ? 'You: ' : ''}{conversation.lastMessage.body}</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </AsyncState>
      </div>
      {selectedId ? (
        <div className="flex min-h-[460px] flex-col">
          {other && <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{other.initials}</span><div><h2 className="text-sm font-bold text-slate-900">{other.name}</h2><p className="mt-1 text-xs text-slate-500">{label(other.role)}</p></div></header>}
          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-5" aria-live="polite">
            <AsyncState loading={thread.loading && !thread.data} error={thread.error} onRetry={thread.reload} empty={thread.data?.messages.length === 0} emptyTitle="Start the conversation" emptyText="Say hello below.">
              {thread.data?.messages.map((message) => (
                <div key={message.id} className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                  <p className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-6 ${message.fromMe ? 'rounded-br-sm bg-blue-700 text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'}`}>
                    {message.body}
                    <span className={`mt-1 block text-[11px] ${message.fromMe ? 'text-blue-100' : 'text-slate-400'}`}>{timeAgo(message.createdAt)}</span>
                  </p>
                </div>
              ))}
            </AsyncState>
          </div>
          {error && <p className="px-4 pt-3 text-sm text-red-700" role="alert">{error}</p>}
          <form onSubmit={sendReply} className="flex gap-2 border-t border-slate-100 p-4">
            <label className="sr-only" htmlFor="message-reply">Write a message</label>
            <input id="message-reply" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a message..." className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            <button type="submit" disabled={!reply.trim() || sending} aria-label="Send message" className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /></button>
          </form>
        </div>
      ) : <div className="flex items-center justify-center p-8 text-sm text-slate-500">Select a conversation to read messages.</div>}
    </section>
  )
}
