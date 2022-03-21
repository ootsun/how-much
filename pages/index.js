import Head from 'next/head';
import {OperationList} from '../components/operations/operation-list.js';
import {findAll} from './api/operations/index.js';
import {useState} from 'react';

export default function Home({operations}) {

  const [selectedOperation, setSelectedOperation] = useState(null);

  return (
    <>
      <Head>
        <title>How much ?!!</title>
      </Head>
      <main>
        <section className="card mb-4">
          <p className="italic align-middle mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="inline h-5 w-5 text-cyan-500 align-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Click on a row to add it in your cart</p>
          <OperationList operations={operations} setSelectedOperation={setSelectedOperation} readonlyMode={true}/>
        </section>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const operations = await findAll();
  // JSON.parse(JSON.stringify(operations)) -> see https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      operations: JSON.parse(JSON.stringify(operations)),
    }
  }
}
