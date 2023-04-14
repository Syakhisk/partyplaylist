import React from "react"
import { FormProvider, useForm, UseFormProps, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodSchema } from "zod"

type Props = {
  defaultValues?: Pick<UseFormProps, "defaultValues">
  children: React.ReactNode
  onSubmit: (data: any, methods: UseFormReturn) => any
  zodSchema: ZodSchema
}

const Form = ({ defaultValues, children, onSubmit, zodSchema }: Props) => {
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(zodSchema),
  })
  const { handleSubmit } = methods
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit((data) => onSubmit(data, methods))}>{children}</form>
    </FormProvider>
  )
}

export default Form
