import React from 'react'
import { useStore } from '../../store/useStore'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { clsx } from 'clsx'

export function GlobalUI() {
  const { notification, confirmModal, closeConfirmation } = useStore()

  return (
    <>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-right fade-in duration-300">
          <div className={clsx(
            "flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md",
            notification.type === 'success' 
              ? "bg-emerald-500/90 border-emerald-400 text-white" 
              : "bg-rose-500/90 border-rose-400 text-white"
          )}>
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-bold tracking-wide">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">{confirmModal.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="flex items-center gap-px bg-slate-100 border-t border-slate-100">
              <button 
                onClick={closeConfirmation}
                className="flex-1 bg-white hover:bg-slate-50 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  confirmModal.onConfirm()
                  closeConfirmation()
                }}
                className="flex-1 bg-white hover:bg-rose-50 py-4 text-xs font-bold text-rose-500 uppercase tracking-widest transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
