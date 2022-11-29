import React, {
  InputHTMLAttributes,
  ReactComponentElement,
  useEffect,
  useState,
} from 'react';
import { FieldError, FieldErrorsImpl, Merge, useForm } from 'react-hook-form';
import { ExclamationCircleIcon, PlusIcon } from '@heroicons/react/20/solid';

type InputProps = {
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  errorMessage?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, errorMessage, ...props }: InputProps, ref) => (
    <div className="px-1">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          ref={ref}
          className={`block w-full pr-10 sm:text-sm rounded-md focus:outline-none ${
            error
              ? 'text-red-900 placeholder-red-300 border-red-300 focus:border-red-500  focus:ring-red-500'
              : 'border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
          } `}
          aria-invalid="true"
          aria-describedby={`${props.id}-error`}
          {...props}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ExclamationCircleIcon
              className="w-5 h-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${props.id}-error`}>
          {errorMessage}
        </p>
      )}
    </div>
  ),
);

Input.displayName = 'Input';

export const Form = () => {
  const [altDomains, setAltDomains] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const rules = {
    pattern: /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/,
  };

  return (
    <form
      className="grid w-full gap-4"
      onSubmit={handleSubmit((data) => {
        console.log(data);
      })}
    >
      <Input
        id="domain"
        placeholder="www.example.com"
        label="Main domain"
        type="text"
        error={errors.domain}
        errorMessage="Domain name is invalid"
        {...register('domain', { required: true, ...rules })}
      />
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.preventDefault();
            setAltDomains((value) => value + 1);
          }}
          type="button"
          className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add alternative domain
          <PlusIcon className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
        </button>
      </div>
      <div className="max-h-[500px] grid gap-4 overflow-auto pb-6">
        {Array.from(Array(altDomains)).map((_, i) => {
          const index = i + 1;
          return (
            <Input
              autoFocus
              key={index}
              id={`altDomain${index}`}
              placeholder={`www.example-${index}.com`}
              label={`Alt domain #${index}`}
              type="text"
              error={errors[`altDomain${index}`]}
              errorMessage="Domain name is invalid"
              {...register(`altDomain${index}`, rules)}
            />
          );
        })}
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Generate CSR
      </button>
    </form>
  );
};
