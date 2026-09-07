import React, { useState } from 'react'
import { Plus, Trash2, Pencil, Check, X as XIcon } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import { Input } from '../ui/Field.jsx'
import { useAppData } from '../../context/AppDataContext.jsx'
import ProfileAvatar from './ProfileAvatar.jsx'
import AvatarPicker from './AvatarPicker.jsx'

export default function ProfileSwitcher({ open, onClose }) {
  const {
    profiles,
    activeProfileId,
    switchProfile,
    addProfile,
    deleteProfile,
    renameProfile,
    updateProfileAvatar,
  } = useAppData()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    addProfile(newName)
    setNewName('')
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setEditingName(p.name)
  }

  const saveEdit = () => {
    renameProfile(editingId, editingName)
    setEditingId(null)
  }

  return (
    <Modal open={open} onClose={onClose} title="Perfis">
      <div className="space-y-2 mb-5">
        {profiles.map((p) => (
          <div
            key={p.id}
            className={`rounded-xl border transition-colors ${
              p.id === activeProfileId
                ? 'bg-sulfur-400/10 border-sulfur-400/40'
                : 'bg-graphite-800 border-graphite-700'
            }`}
          >
            <div className="flex items-center gap-3 px-3.5 py-3">
              <ProfileAvatar profile={p} size="sm" />

              {editingId === p.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="py-1.5"
                  />
                  <button onClick={saveEdit} className="p-1.5 text-success-400">
                    <Check size={18} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 text-graphite-400">
                    <XIcon size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      switchProfile(p.id)
                      onClose()
                    }}
                    className="flex-1 text-left font-medium text-graphite-100"
                  >
                    {p.name}
                  </button>
                  <button
                    onClick={() => startEdit(p)}
                    className="p-1.5 text-graphite-500 hover:text-graphite-200"
                  >
                    <Pencil size={16} />
                  </button>
                  {confirmDeleteId === p.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          deleteProfile(p.id)
                          setConfirmDeleteId(null)
                        }}
                        className="text-xs font-semibold text-danger-400 px-2 py-1 rounded-md bg-danger-500/10"
                      >
                        Remover
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs text-graphite-400 px-2 py-1"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(p.id)}
                      className="p-1.5 text-graphite-500 hover:text-danger-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </>
              )}
            </div>

            {editingId === p.id && (
              <div className="px-3.5 pb-3.5 pt-1">
                <p className="text-xs text-graphite-400 mb-2">Escolha um avatar</p>
                <AvatarPicker
                  value={p.avatarId}
                  onChange={(avatarId) => updateProfileAvatar(p.id, avatarId)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nome do novo perfil"
        />
        <Button type="submit" icon={Plus} disabled={!newName.trim()}>
          Criar
        </Button>
      </form>
    </Modal>
  )
}
