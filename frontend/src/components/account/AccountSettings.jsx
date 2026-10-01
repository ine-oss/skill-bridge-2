import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import { userService } from '../../services/userService'

function Status({ value }) {
  if (!value) return null
  return <p className={`text-sm font-medium ${value.type === 'error' ? 'text-red-700' : 'text-emerald-700'}`} role="status">{value.text}</p>
}

/** Name/phone and password change, shared by every workspace's settings page. */
export default function AccountSettings() {
  const { user, updateUser } = useAuth()
  const [account, setAccount] = useState({ name: user.name || '', phone: user.phone || '', emailNotifications: user.emailNotifications !== false })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [status, setStatus] = useState({ account: null, password: null })

  const saveAccount = async (event) => {
    event.preventDefault()
    try {
      const { user: updated } = await userService.updateMe({ name: account.name, phone: account.phone || null, emailNotifications: account.emailNotifications })
      updateUser({ name: updated.name, phone: updated.phone, emailNotifications: updated.emailNotifications })
      setStatus((current) => ({ ...current, account: { type: 'success', text: 'Account details saved.' } }))
    } catch (err) {
      setStatus((current) => ({ ...current, account: { type: 'error', text: err.message } }))
    }
  }

  const changePassword = async (event) => {
    event.preventDefault()
    if (passwords.newPassword !== passwords.confirm) {
      setStatus((current) => ({ ...current, password: { type: 'error', text: 'The new passwords do not match.' } }))
      return
    }
    try {
      await authService.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword })
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' })
      setStatus((current) => ({ ...current, password: { type: 'success', text: 'Password changed.' } }))
    } catch (err) {
      setStatus((current) => ({ ...current, password: { type: 'error', text: err.message } }))
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form onSubmit={saveAccount} className="space-y-4 rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-900">Account</h2>
        <Input id="settings-name" label="Name" required value={account.name} onChange={(event) => setAccount({ ...account, name: event.target.value })} />
        <Input id="settings-email" label="Email" value={user.email || ''} disabled readOnly />
        <Input id="settings-phone" label="Phone (optional)" value={account.phone} onChange={(event) => setAccount({ ...account, phone: event.target.value })} />
        <label className="flex items-start gap-3 text-sm text-slate-700"><input type="checkbox" checked={account.emailNotifications} onChange={(event) => setAccount({ ...account, emailNotifications: event.target.checked })} className="mt-1 h-4 w-4 accent-blue-700" /> <span>Email me about new activity<span className="block text-xs text-slate-500">Applications, interviews, messages and certificates. Password and security emails are always sent.</span></span></label>
        <Status value={status.account} />
        <Button type="submit">Save changes</Button>
      </form>
      <form onSubmit={changePassword} className="space-y-4 rounded-2xl border border-slate-200 p-5">
        <h2 className="text-lg font-bold text-slate-900">Change password</h2>
        <Input id="settings-current" label="Current password" type="password" required value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} />
        <Input id="settings-new" label="New password" type="password" minLength="8" required value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} />
        <Input id="settings-confirm" label="Confirm new password" type="password" minLength="8" required value={passwords.confirm} onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })} />
        <Status value={status.password} />
        <Button type="submit">Update password</Button>
      </form>
    </div>
  )
}
