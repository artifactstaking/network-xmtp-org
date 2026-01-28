import * as React from 'react';
import { useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

/**
 * FormFieldContextValue
 *
 * Context value for a form field, including the field name.
 *
 * @template TFieldValues - The type of form field values.
 * @template TName - The type of the field name.
 * @property {TName} name - The name of the form field.
 */
export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

/**
 * FormItemContextValue
 *
 * Context value for a form item, including the unique item id.
 *
 * @property {string} id - The unique id for the form item.
 */
export type FormItemContextValue = {
  id: string;
};

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

/**
 * useFormField
 *
 * React hook for accessing form field context and state.
 * Must be used within a FormField and FormItem context.
 *
 * @returns {object} An object containing field id, name, ARIA ids, and field state.
 *
 * @throws {Error} If used outside of a FormField context.
 *
 * @example
 * const { id, name, formItemId, formDescriptionId, formMessageId, ...fieldState } = useFormField();
 */
export const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) throw new Error('useFormField should be used within <FormField>');

  const fieldState = getFieldState(fieldContext.name, formState);
  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};
