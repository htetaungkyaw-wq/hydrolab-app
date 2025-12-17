'use client'

import { Modal } from './modal'
import { Button } from './button'

export function ConfirmDialog({
  open,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  onConfirm,
  onClose,
}: {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  onConfirm: () => void | Promise<void>
  onClose: () => void
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="danger"
            onClick={async () => {
              await onConfirm()
              onClose()
            }}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-sm text-slate-300">{message}</p>
    </Modal>
  )
}
