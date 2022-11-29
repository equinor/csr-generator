import { Form } from '../components/Form';

export default function Home() {
  return (
    <main className="bg-white ">
      <div className="container min-h-screen px-4 py-12 mx-auto md:px-12 md:pt-16 lg:px-20">
        <div className="max-w-lg mx-auto">
          <div className="mb-6 text-3xl font-semibold">
            Equinor CSR Generator
          </div>
          <p className="mb-8 text-gray-500">
            The main purpose of this tool is facilitate the generation of the
            CSR document needed in order to request the SSL certificate.
          </p>
          <Form />
        </div>
      </div>
      <div className="sticky bottom-0 flex items-center justify-center h-16 p-4 text-sm bg-white border-t border-gray-200">
        <p>
          For questions and suggestions, contact{' '}
          <a
            className="text-indigo-500 hover:text-indigo-700"
            href="mailto:ferl@equinor.com"
          >
            ferl@equinor.com
          </a>
        </p>
      </div>
    </main>
  );
}
