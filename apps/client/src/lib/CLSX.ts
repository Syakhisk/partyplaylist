import clsx, { ClassValue } from "clsx"

/**
 * CLSX is a wrapper around clsx that allows for tagged template strings.
 * This is useful for writing CSS in JS.
 * @param args - The arguments to pass to clsx
 * @returns The class names
 * @example
 * <Button
 *   className={CLSX`flex justify-center items-center`}
 * />
 * @example
 * <Button
 *    className={CLSX("flex", [true && 'text-bold'], { 'text-red': true }})}
 * />
 * */
function CLSX(...args: unknown[]): string {
  // Handle tagged template string
  if (args.length === 1 && Array.isArray(args[0])) {
    const rawString = (args[0] as unknown as TemplateStringsArray).raw[0].split("\n")
    return clsx(...rawString.map((str) => str.trim()))
  }

  return clsx(...(args as ClassValue[]))
}

export default CLSX
