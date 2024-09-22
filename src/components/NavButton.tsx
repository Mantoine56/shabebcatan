import React from 'react'

type NavButtonProps = {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active: boolean
}

export default function NavButton({ icon, label, onClick, active }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}