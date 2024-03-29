import Head from 'next/head';
import {OperationList} from '../components/operations/operation-list.js';
import {useState} from 'react';
import {ShoppingCart} from '../components/operations/shopping-cart/shopping-cart.js';
import {InformationCircleIcon} from '@heroicons/react/outline';
import {search} from "./api/operations/search.js";

export default function Home({initialOperations}) {

  const [selectedOperation, setSelectedOperation] = useState(null);
  const [cartIsEmpty, setCartIsEmpty] = useState(true);

  return (
    <>
      <Head>
        <title>How much ?!!</title>
      </Head>
      <main className="lg:flex lg:flex-row-reverse">
        <section className={`${cartIsEmpty ? 'hidden sm:block' : 'block'} card mb-4 lg:basis-1/3 lg:ml-2 lg:self-start`}>
          <ShoppingCart lastSelected={selectedOperation} setLastSelected={setSelectedOperation} setCartIsEmpty={setCartIsEmpty}/>
        </section>
        <section className="card mb-4 lg:basis-2/3">
          <p className="italic align-middle mb-1 md:ml-6">
            <InformationCircleIcon className="information-circle"/>
            Click on a row to add it to your cart
          </p>
          <OperationList initialOperations={initialOperations} setSelectedOperation={setSelectedOperation} readonlyMode={true} havingLastGasUsage={true}/>
        </section>
      </main>
    </>
  )
}

export async function getStaticProps() {
  const initialOperations = await search(0, null, true);
  // JSON.parse(JSON.stringify(initialOperations)) -> see https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      initialOperations: JSON.parse(JSON.stringify(initialOperations)),
    }
  }
}
