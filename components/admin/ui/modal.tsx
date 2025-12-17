'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Button } from './button'

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-950 shadow-xl">
                <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-5 py-4">
                  <Dialog.Title className="text-sm font-semibold text-slate-100">{title}</Dialog.Title>
                  <Button variant="ghost" onClick={onClose}>Close</Button>
                </div>
                <div className="px-5 py-4">{children}</div>
                {footer ? <div className="border-t border-slate-800 px-5 py-4">{footer}</div> : null}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
