'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Paginator({ totalPages, type }) {
  const router = useRouter();
  let searchParams = useSearchParams();

  const pageType = type ? `${type}Page` : 'catalogPage';
  const currentPage = parseInt(searchParams.get(pageType)) || 1;

  let page = 1;
  const pages = [];

  while (page <= totalPages) {
    pages.push(page);
    page++;
  }

  return (
    <div className='flex justify-center items-center'>
      <nav aria-label='Page navigation'>
        <ul className='inline-flex'>
          <li>
            <button
              className={`h-8 px-5 text-black transition-colors duration-500 rounded-l-lg bg-white focus:shadow-outline
                ${currentPage === 1 ? 'bg-zinc-600 text-white' : 'text-black hover:bg-indigo-200'}`}
              disabled={currentPage <= 1}
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set(pageType, currentPage - 1);
                router.push(`?${newSearchParams.toString()}`, { scroll: false });
              }}
            >
              <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                <path
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                  fillRule='evenodd'
                ></path>
              </svg>
            </button>
          </li>
          {pages.map((page) => (
            <li key={page}>
              <button
                className={`h-8 px-5 transition-colors duration-500 focus:shadow-outline ${
                  page === currentPage
                    ? 'bg-zinc-500 text-white cursor-default'
                    : 'text-black hover:bg-indigo-200'
                } `}
                onClick={() => {
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.set(pageType, page);
                  router.push(`?${newSearchParams.toString()}`, { scroll: false });
                }}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button
              className={`h-8 px-5 text-black transition-colors duration-500 bg-white rounded-r-lg focus:shadow-outline ${
                currentPage === totalPages
                  ? 'bg-zinc-600 text-white'
                  : 'text-black hover:bg-indigo-200'
              }`}
              disabled={currentPage >= totalPages}
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set(pageType, currentPage + 1);
                router.push(`?${newSearchParams.toString()}`, { scroll: false });
              }}
            >
              <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                <path
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                  fillRule='evenodd'
                ></path>
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
