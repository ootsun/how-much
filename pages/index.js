import Head from 'next/head';
import {OperationList} from '../components/operations/operation-list.js';
import {findAll} from './api/operations/index.js';
import {useState} from 'react';
import {ShoppingCart} from '../components/operations/shopping-cart.js';
import {InformationCircleIcon, ShoppingCartIcon} from '@heroicons/react/outline';

export default function Home({operations}) {

  const [selectedOperation, setSelectedOperation] = useState(null);
  const [averageSum, setAverageSum] = useState(0);
  const [maxSum, setMaxSum] = useState(0);

  return (
    <>
      <Head>
        <title>How much ?!!</title>
      </Head>
      <main className="lg:flex lg:flex-row-reverse">
        <section className="card mb-4 lg:basis-1/3 lg:ml-2 lg:self-start">
          <p className="italic align-middle mb-1">
            <InformationCircleIcon className="information-circle"/>
            Click on a row to remove it from your cart
          </p>
          <div className="flex justify-between items-center lg:block border-gray-200 border-b mb-1.5 pb-1.5">
            <div className="flex">
              <ShoppingCartIcon className="w-10 h-10 mr-2"/>
              <h2 className="text-2xl hidden sm:block">Shopping cart</h2>
            </div>
            <span className="flex w-min text-sm lg:justify-end lg:w-full">
              <span className="flex w-min">
                Avg:&nbsp;
                <span className="bg-fuchsia-500 mx-1 text-white bold px-1">${averageSum}</span>
              </span>
              <span className="flex w-min">
                Max:&nbsp;
                <span className="bg-orange-500 mx-1 text-white bold px-1">${maxSum}</span>
              </span>
            </span>
          </div>
          <ShoppingCart lastSelected={selectedOperation}
                        setLastSelected={setSelectedOperation}
                        setAverageSum={setAverageSum}
                        setMaxSum={setMaxSum}/>
        </section>
        <section className="card mb-4 lg:basis-2/3">
          <p className="italic align-middle mb-1">
            <InformationCircleIcon className="information-circle"/>
            Click on a row to add it to your cart
          </p>
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
