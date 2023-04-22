import React from "react"
import { FieldErrors, FieldValues, useFormContext } from "react-hook-form"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import CLSX from "@/lib/CLSX"

type Props = InputProps & React.InputHTMLAttributes<HTMLInputElement>
type InputProps = {
  label?: string
  placeholder?: string
  helperText?: string
  id: string
  required?: boolean
  type?: string
  readOnly?: boolean
}

const Input = (props: Props) => {
  const {
    label,
    placeholder = " ",
    helperText = null,
    id,
    type = "text",
    readOnly = false,
    ...rest
  } = props

  const {
    register,
    formState: { errors },
  } = useFormContext()

  // get errors if 'id' contains '.'
  if (id.includes(".")) {
    const structure = id.split(".")
    let error: FieldErrors<FieldValues> | FieldValues = errors
    let noError = true
    for (const s of structure) {
      const key = Number.isNaN(+s) ? s : +s
      if (!error[key]) {
        noError = false
        break
      }
      error = error[key]
    }

    errors[id] = noError ? error : undefined
  }

  const hasError = errors[id]

  return (
    <div className={containerCN}>
      {label && (
        <label htmlFor={id} className={labelCN}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          {...register(id)}
          {...rest}
          autoComplete={type === "password" ? "on" : undefined}
          type={type}
          name={id}
          id={id}
          readOnly={readOnly}
          className={inputCN}
          placeholder={placeholder}
          aria-describedby={id}
        />

        {hasError && (
          <div className={clsx(iconCN, "text-red-500")}>
            <ExclamationCircleIcon className="h-5 w-5" />
          </div>
        )}
      </div>

      {hasError && (
        <div className="mt-1">
          {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
          <p className="text-sm text-red-500">{errors[id]?.message?.toString() ?? "\u00A0"}</p>
        </div>
      )}
    </div>
  )
}

const containerCN = CLSX`
relative
z-0
w-full
pt-2
`

const iconCN = CLSX`
pointer-events-none
absolute
top-[50%]
translate-y-[-50%]
right-0
translate-x-[-50%]
`

const inputCN = CLSX`
block
w-full
appearance-none
border
bg-transparent
text-base
focus:border-highlight
focus:outline-none
focus:ring-0
`

const labelCN = CLSX`
block
mb-2
`

export default Input
