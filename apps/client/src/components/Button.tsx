import { useState } from "react"
import CLSX from "@/lib/CLSX"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  variant?: "primary" | "secondary" | "warning"
  outlined?: boolean
  Icon?: React.ElementType
  iconPosition?: "before" | "after"
}

const Button = ({
  children,
  variant = "primary",
  outlined = false,
  iconPosition = "before",
  Icon,
  disabled,
  ...rest
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false)

  const colors = {
    primary: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
  }

  const outlinedColors = {
    primary: "border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
    secondary: "border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white",
    warning: "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white",
  }

  const baseClasses = CLSX`
flex
items-center
font-medium
rounded
transition
ease-in-out
duration-150
px-2
p-1
${disabled && "opacity-50 cursor-not-allowed"}
`

  const buttonClasses = CLSX(
    baseClasses,
    !outlined && colors[variant],
    outlined && outlinedColors[variant],
    hovered && Icon && "opacity-80"
  )

  return (
    <button
      className={buttonClasses}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {Icon && iconPosition === "before" && <Icon className="h-5 w-5" />}
      {children && <div>{children}</div>}
      {Icon && iconPosition === "after" && <Icon className="h-5 w-5" />}
    </button>
  )
}

export default Button
