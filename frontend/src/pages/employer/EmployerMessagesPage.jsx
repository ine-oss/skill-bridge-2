import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import MessagesPanel from '../../components/messages/MessagesPanel'

export default function EmployerMessagesPage() {
  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Candidate communication" title="Messages" description="Coordinate with candidates and keep the conversation close to your hiring pipeline." />
      <MessagesPanel inboxTitle="Candidate inbox" />
    </div>
  )
}
