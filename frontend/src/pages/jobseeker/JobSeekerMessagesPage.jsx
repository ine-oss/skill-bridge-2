import WorkspacePageHeader from '../../components/common/WorkspacePageHeader'
import MessagesPanel from '../../components/messages/MessagesPanel'

export default function JobSeekerMessagesPage() {
  return (
    <div className="space-y-6">
      <WorkspacePageHeader eyebrow="Conversations" title="Messages" description="Talk with employers and training providers about your applications and learning." />
      <MessagesPanel inboxTitle="Your inbox" />
    </div>
  )
}
