import React, { InputHTMLAttributes, useState } from 'react';
import { FieldError, FieldErrorsImpl, Merge, useForm } from 'react-hook-form';
import {
  ArrowLeftIcon,
  ExclamationCircleIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';

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

export default Input;
