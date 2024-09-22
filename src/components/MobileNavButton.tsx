import React from 'react'

interface MobileNavButtonProps {
  label: string
  onClick: () => void
  active: boolean
}

const MobileNavButton: React.FC<MobileNavButtonProps> = ({ label, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
        active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  )
}

export default MobileNavButton