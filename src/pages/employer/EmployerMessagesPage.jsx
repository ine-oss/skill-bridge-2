import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import { employerMessages as initialMessages } from '../../data/employerWorkspace'

export default function EmployerMessagesPage() {
  const [conversations, setConversations] = useState(initialMessages)
  const [activeId, setActiveId] = useState(initialMessages[0]?.id)
  const [reply, setReply] = useState('')
  const activeConversation = conversations.find((conversation) => conversation.id === activeId)

  const selectConversation = (id) => {
    setActiveId(id)
    setConversations((current) => current.map((conversation) => conversation.id === id ? { ...conversation, unread: false } : conversation))
  }

  const sendReply = (event) => {
    event.preventDefault()
    const message = reply.trim()
    if (!message || !activeConversation) return
    setConversations((current) => current.map((conversation) => conversation.id === activeId ? { ...conversation, time: 'Just now', messages: [...conversation.messages, { from: 'me', text: message }] } : conversation))
    setReply('')
  }

  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Candidate communication" title="Messages" description="Coordinate with candidates and keep the conversation close to your hiring pipeline." />
      <section className="grid min-h-[540px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="border-b border-slate-100 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4"><MessageSquare size={17} className="text-blue-700" /><h2 className="font-bold text-slate-900">Candidate inbox</h2></div>
          <div className="divide-y divide-slate-100">
            {conversations.map((conversation) => (
              <button key={conversation.id} type="button" onClick={() => selectConversation(conversation.id)} className={`w-full p-4 text-left transition ${activeId === conversation.id ? 'bg-blue-50/70' : 'hover:bg-slate-50'}`}>
                <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">{conversation.initials}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-semibold text-slate-800">{conversation.name}</span>{conversation.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-label="Unread" />}</span><span className="mt-1 block truncate text-xs text-slate-500">{conversation.role}</span><span className="mt-2 block truncate text-xs text-slate-500">{conversation.messages.at(-1)?.text}</span></span></div>
              </button>
            ))}
          </div>
        </div>
        {activeConversation ? (
          <div className="flex min-h-[460px] flex-col">
            <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{activeConversation.initials}</span><div><h2 className="text-sm font-bold text-slate-900">{activeConversation.name}</h2><p className="mt-1 text-xs text-slate-500">{activeConversation.role}</p></div></header>
            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/60 p-5" aria-live="polite">
              {activeConversation.messages.map((message, index) => <div key={`${activeConversation.id}-${index}`} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-6 ${message.from === 'me' ? 'rounded-br-sm bg-blue-700 text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-700'}`}>{message.text}</p></div>)}
            </div>
            <form onSubmit={sendReply} className="flex gap-2 border-t border-slate-100 p-4"><label className="sr-only" htmlFor="message-reply">Write a reply</label><input id="message-reply" value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Write a reply..." className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><button type="submit" disabled={!reply.trim()} aria-label="Send message" className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-4 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /></button></form>
          </div>
        ) : <div className="flex items-center justify-center p-8 text-sm text-slate-500">Select a conversation to read messages.</div>}
      </section>
    </div>
  )
}
