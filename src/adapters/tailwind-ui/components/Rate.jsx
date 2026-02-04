import React, { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

const Rate = ({ value = 0, onChange, count = 5, allowHalf = false, disabled = false }) => {
  const [hoverValue, setHoverValue] = useState(null)

  const handleClick = (index) => {
    if (!disabled && onChange) {
      onChange(index + 1)
    }
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, index) => {
        const filled = index < Math.floor(displayValue)
        const halfFilled = allowHalf && index === Math.floor(displayValue) && displayValue % 1 !== 0

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            onMouseEnter={() => !disabled && setHoverValue(index + 1)}
            onMouseLeave={() => setHoverValue(null)}
            disabled={disabled}
            className={`focus:outline-none ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          >
            <StarIcon
              className={`h-6 w-6 ${
                filled || halfFilled ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

export default Rate
