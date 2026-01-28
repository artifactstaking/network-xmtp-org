'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from 'react-hook-form';
import { cn } from '@/utils/cn';
import { Label } from '@/components/base';
import { useFormField, FormFieldContext, FormItemContext } from '@/hooks/ui/useFormField';

/**
 * Props for the Form component.
 * Combines HTML form attributes with react-hook-form's UseFormReturn.
 *
 * @template TFieldValues - Type of the form values
 */
type FormProps<TFieldValues extends FieldValues = FieldValues> =
  React.FormHTMLAttributes<HTMLFormElement> & {
    children: React.ReactNode;
  } & UseFormReturn<TFieldValues>;

/**
 * A form component that integrates react-hook-form with HTML form elements.
 *
 * This component handles the separation of HTML form props and react-hook-form methods
 * to prevent context pollution. It also provides a default submit handler that
 * prevents form submission if no custom handler is provided.
 *
 * @template TFieldValues - Type of the form values
 * @param props - Combined props of HTML form attributes and react-hook-form's UseFormReturn
 * @returns A form component with react-hook-form integration
 *
 * @example
 * ```tsx
 * const form = useForm();
 *
 * return (
 *   <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="my-form">
 *     <FormField name="email" control={form.control} render={...} />
 *   </Form>
 * );
 * ```
 */
const Form = <TFieldValues extends FieldValues = FieldValues>({
  children,
  ...props
}: FormProps<TFieldValues>) => {
  // Separate HTML form props from react-hook-form methods to prevent context pollution
  const { className, id, name, style, onSubmit, onKeyDown, ...formMethods } = props;

  // Create an object with only valid HTML form attributes
  const htmlFormProps: React.FormHTMLAttributes<HTMLFormElement> = {
    className: cn('w-full', className),
    id,
    name,
    style,
    onKeyDown,
  };

  /**
   * Create a submit handler that prevents default form submission if no custom handler is provided
   * @param e - The form submission event
   */
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (onSubmit) {
      onSubmit(e);
    } else {
      e.preventDefault();
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form {...htmlFormProps} onSubmit={handleFormSubmit}>
        {children}
      </form>
    </FormProvider>
  );
};

/**
 * A component that provides access to form field context using react-hook-form's Controller.
 *
 * @template TFieldValues - Type of the form values
 * @template TName - Type of the field name
 * @param props - Controller props from react-hook-form
 * @returns A connected form field with context
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

/**
 * A container component for form fields that provides context for form items.
 *
 * Creates a unique ID for the form item and provides it through context.
 */
const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ ...props }, ref) => {
    // Generate a unique ID for the form item
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} {...props} />
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = 'FormItem';

/**
 * A label component for form fields that integrates with form field context.
 *
 * Automatically connects to the associated form field and applies error styles when needed.
 */
const FormLabel = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  // Get error state and field ID from context
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

/**
 * A component that provides a slot for form controls with appropriate accessibility attributes.
 *
 * Automatically adds aria attributes based on error states and connects to form field IDs.
 */
const FormControl = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  // Get field IDs and error state from context
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

/**
 * A component for displaying descriptive text for a form field.
 *
 * Automatically connects to the associated form field through context.
 */
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  // Get description ID from context
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

/**
 * A component for displaying error messages for a form field.
 *
 * Renders the error message from the form field context if available,
 * or renders the provided children. Returns null if no error or children are present.
 */
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  // Get error state and message ID from context
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? '') : children;

  // Return null if no error message or children
  if (!body) return null;

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField };
