import CLSX from "@/lib/CLSX"
import clsx from "clsx"

type ColorVariant = "primary" | "secondary" | "warning"
type TypeVariant = "outline" | "borderless"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  variant?: ColorVariant | `${TypeVariant}-${ColorVariant}`
  Icon?: React.ElementType
  iconPosition?: "before" | "after"
}

const Button = ({
  children,
  variant = "primary",
  iconPosition = "before",
  Icon,
  ...rest
}: ButtonProps) => {
  const colors = {
    primary: "bg-red-500 enabled:hover:bg-red-600",
    secondary: "bg-gray-500 enabled:hover:bg-gray-600",
    warning: "bg-yellow-500 enabled:hover:bg-yellow-600",
    "outline-primary": "border-red-500 text-red-500 enabled:hover:bg-red-500",
    "outline-secondary": "border-gray-500 text-gray-500 enabled:hover:bg-gray-500",
    "outline-warning": "border-yellow-500 text-yellow-500 enabled:hover:bg-yellow-500",
    "borderless-primary": "text-inherit enabled:hover:text-red-500",
    "borderless-secondary": "text-inherit enabled:hover:text-gray-500",
    "borderless-warning": "text-inherit enabled:hover:text-yellow-500",
  }

  const baseClasses = CLSX`
inline-flex
items-center
justify-center
rounded
transition
ease-in-out
duration-150
px-2
p-1
`

  const disabledClasses = CLSX`
disabled:opacity-50
disabled:cursor-not-allowed
`

  const outlined = variant.includes("outline")
  const borderless = variant.includes("borderless")

  const buttonClasses = clsx(
    baseClasses,
    disabledClasses,
    colors[variant],
    !outlined && !borderless && "text-white",
    outlined && "enabled:hover:text-white outline outline-1",
    !borderless && "font-medium",
    borderless && "enabled:hover:text-white underline underline-offset-2"
  )

  return (
    <button {...rest} className={clsx(buttonClasses, rest.className)}>
      {Icon && iconPosition === "before" && <Icon className="h-5 w-5" />}
      {children && children}
      {Icon && iconPosition === "after" && <Icon className="h-5 w-5" />}
    </button>
  )
}

export default Button
