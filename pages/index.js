import Head from 'next/head';
import {OperationList} from '../components/operations/operation-list.js';
import {useState} from 'react';
import {ShoppingCart} from '../components/operations/shopping-cart.js';
import {InformationCircleIcon, ShoppingCartIcon} from '@heroicons/react/outline';
import {findHavingLastGasUsages} from "./api/operations/having-last-gas-usages.js";

export default function Home({initialOperations}) {

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
          <div className={`flex justify-between items-center pb-1.5 ${maxSum > 0 ? 'border-gray-200 border-b' : ''}`}>
            <div className="flex basis-3/5 pr-1 items-center">
              <ShoppingCartIcon className="w-10 h-10 mr-2"/>
              <h2 className="text-2xl hidden sm:block">Shopping cart
                {Number.parseFloat(maxSum) === 0 &&
                  <span className="ml-1 text-gray-500 text-sm">(Empty)</span>
                }
              </h2>
            </div>
            {Number.parseFloat(maxSum) > 0 && <>
              <span className="basis-1/5 pr-1">
                <span className="average-price">Avg&nbsp;
                  <span className="border-l border-white ml-1 pl-1 ">${averageSum}</span>
                </span>
              </span>
              <span className="basis-1/5">
                <span className="max-price">Max&nbsp;
                  <span className="border-l border-white ml-1 pl-1">${maxSum}</span>
                </span>
              </span>
            </>
            }
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
          <OperationList initialOperations={initialOperations} setSelectedOperation={setSelectedOperation} readonlyMode={true}/>
        </section>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const initialOperations = await findHavingLastGasUsages(0);
  // JSON.parse(JSON.stringify(initialOperations)) -> see https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      initialOperations: JSON.parse(JSON.stringify(initialOperations)),
    }
  }
}
