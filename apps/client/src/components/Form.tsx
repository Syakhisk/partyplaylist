import React, { useEffect } from "react"
import { FormProvider, useForm, UseFormProps, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z, ZodSchema } from "zod"
import { toast } from "react-toastify"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"

type Props = {
  defaultValues?: Pick<UseFormProps, "defaultValues">
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any, methods: UseFormReturn) => void
  zodSchema: ZodSchema
  className: string
}

// TODO: tried using generics as below, but it doesn't work
// /**
// * Form component that uses zod for validation
// * @example
// * function handleSubmit<CreateSession>(data: CreateSession) {
// *  console.log(data)
// * }
// *
// * <Form onSubmit={handleSubmit} zodSchema={createSession}>
// *   <Button type="submit">Create a Session</Button>
// * </Form>
// */
const Form = ({ defaultValues, className = "", children, onSubmit, zodSchema }: Props) => {
  const methods = useForm<z.infer<typeof zodSchema>>({
    defaultValues,
    resolver: zodResolver(zodSchema),
  })
  const {
    handleSubmit,
    formState: { errors },
  } = methods

  useEffect(() => {
    if (Object.keys(errors).length < 1) return
    toast.error("Please check your inputs")
    console.log(errors)
  }, [errors])

  return (
    <FormProvider {...methods}>
      {errors.root && (
        <div className="border border-red-500 text-red-500 text-sm p-1 px-2 rounded flex gap-2 items-center">
          <div className="flex-1 w-full">{errors.root.message}</div>
          <ExclamationCircleIcon className="h-5 w-5 ml-2 flex-shrink-0" />
        </div>
      )}
      <form className={className} onSubmit={handleSubmit((data) => onSubmit(data, methods))}>
        {children}
      </form>
    </FormProvider>
  )
}

export type OnSubmit<T> = (data: T, methods: UseFormReturn) => void

export default Form
