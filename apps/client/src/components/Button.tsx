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
  ...rest
}: ButtonProps) => {
  const colors = {
    primary: "bg-red-500 enabled:hover:bg-red-600",
    secondary: "bg-gray-500 enabled:hover:bg-gray-600",
    warning: "bg-yellow-500 enabled:hover:bg-yellow-600",
  }

  const outlinedColors = {
    primary: "border-red-500 text-red-500 enabled:hover:bg-red-500",
    secondary: "border-gray-500 text-gray-500 enabled:hover:bg-gray-500",
    warning: "border-yellow-500 text-yellow-500 enabled:hover:bg-yellow-500",
  }

  const baseClasses = CLSX`
inline-flex
items-center
justify-center
font-medium
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

  const buttonClasses = CLSX(
    baseClasses,
    disabledClasses,
    !outlined && [colors[variant], "text-white"],
    outlined && [outlinedColors[variant], "enabled:hover:text-white outline outline-1"]
  )

  return (
    <button {...rest} className={CLSX(buttonClasses, rest.className)}>
      {Icon && iconPosition === "before" && <Icon className="h-5 w-5" />}
      {children && children}
      {Icon && iconPosition === "after" && <Icon className="h-5 w-5" />}
    </button>
  )
}

export default Button
