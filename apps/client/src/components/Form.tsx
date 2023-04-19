import React from "react"
import { FormProvider, useForm, UseFormProps, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ZodSchema } from "zod"

type Props = {
  defaultValues?: Pick<UseFormProps, "defaultValues">
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any, methods: UseFormReturn) => void
  zodSchema: ZodSchema
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
