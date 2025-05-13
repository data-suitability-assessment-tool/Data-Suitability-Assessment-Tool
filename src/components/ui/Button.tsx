// src/components/ui/button.tsx
import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, variant = "primary", size = "md", disabled, type = "button", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "primary":
          return "bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
        case "secondary":
          return "bg-[var(--secondary-color)] text-white hover:bg-[var(--primary-color)]"
        case "success":
          return "bg-[var(--success-color)] text-white hover:opacity-90"
        case "danger":
          return "bg-[var(--error-color)] text-white hover:opacity-90"
        case "warning":
          return "bg-[var(--warning-color)] text-[var(--text-color)] hover:opacity-90"
        case "outline":
          return "border border-[var(--border-color)] bg-transparent hover:bg-gray-100"
        case "ghost":
          return "bg-transparent hover:bg-gray-100"
        default:
          return "bg-[var(--primary-color)] text-white hover:bg-[var(--secondary-color)]"
      }
    }

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "px-3 py-1.5 text-sm"
        case "lg":
          return "px-6 py-3 text-lg"
        default:
          return "px-4 py-2 text-base"
      }
    }

    return (
      <button
        className={`
          inline-flex items-center justify-center rounded-md font-medium
          transition-colors focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-[var(--secondary-color)] focus-visible:ring-offset-2
          disabled:opacity-50 disabled:pointer-events-none
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${className}
        `}
        ref={ref}
        disabled={disabled}
        type={type}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }