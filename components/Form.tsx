import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { PlusIcon } from '@heroicons/react/20/solid';
import Input from './Input';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Form = () => {
  const [altDomains, setAltDomains] = useState(0);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);

    const createBlob = (blob: Blob, filename: string) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    };

    // Removes alt domains without a value
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== ''),
    );

    const response = await fetch('/api/generate', {
      method: 'post',
      body: JSON.stringify(filteredData),
    });

    const { key, csr } = await response.json();

    await fetch(`/${key}`)
      .then((res) => res.blob())
      .then((blob) => {
        createBlob(blob, 'serverkey.key');
      });

    await fetch(`/${csr}`)
      .then((res) => res.blob())
      .then((blob) => {
        createBlob(blob, 'servercsr.csr');
      });

    setLoading(false);
  };

  const rules = {
    pattern: /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/,
  };

  return (
    <form
      className="grid w-full gap-4"
      onSubmit={handleSubmit((data) => onSubmit(data))}
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
      <div className="max-h-[230px] grid gap-4 pb-2 overflow-auto mb-4">
        {Array.from(Array(altDomains)).map((_, i) => {
          const index = i + 1;
          return (
            <Input
              autoFocus
              key={index}
              id={`altDomain${index}`}
              placeholder={'example.com'}
              label={`Alt domain #${index}`}
              type="text"
              error={errors[`altDomain${index}`]}
              errorMessage="Domain name is invalid"
              {...register(`altDomain${index}`, rules)}
            />
          );
        })}
      </div>
      <p className="font-light text-gray-500">
        <span className="mr-2 font-semibold uppercase">Tip:</span>We recommend
        adding at least one alternative domain to cover non-www and www cases.
        If the main domain is <strong>www.example.com</strong>, add{' '}
        <strong>example.com</strong> as alternative domain.
      </p>
      <button
        type="submit"
        disabled={loading}
        className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
      >
        {loading ? 'Generating files...' : 'Generate CSR'}
        {loading && (
          <svg
            className="w-5 h-5 ml-3 mr-3 text-indigo-600 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
      </button>
    </form>
  );
};
