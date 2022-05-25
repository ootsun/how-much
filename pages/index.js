import Head from 'next/head';
import {OperationList} from '../components/operations/operation-list.js';
import {findAll} from './api/operations/index.js';
import {ShoppingCart} from '../components/operations/shopping-cart.js';
import {ClipboardIcon, InformationCircleIcon, SaveIcon, ShoppingCartIcon} from '@heroicons/react/outline';
import {Fragment, useState} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid'

const carts = [
  {name: 'Curve'},
  {name: 'Aave'},
]
export default function Home({operations}) {

  const [selectedOperation, setSelectedOperation] = useState(null);
  const [averageSum, setAverageSum] = useState(0);
  const [maxSum, setMaxSum] = useState(0);

  const [selectedCart, setSelectedCart] = useState(null);
  const [query, setQuery] = useState('');
  const [openOptions, setOpenOptions] = useState(false);

  const filteredCarts =
    query === ''
      ? carts
      : carts.filter((cart) => {
        return cart.name.toLowerCase().includes(query.toLowerCase())
      })

  function saveCart() {

  }

  return (
    <>
      <Head>
        <title>How much ?!!</title>
      </Head>
      <main className="lg:flex lg:flex-row-reverse">
        <section className="card mb-4 lg:basis-1/3 lg:ml-2 lg:self-start">
          <div className="flex justify-between">
            <p className="italic align-middle mb-1">
              <InformationCircleIcon className="information-circle"/>
              Click on a row to remove it from your cart
            </p>
            <button className="link" onClick={saveCart} title="Save cart">
              <SaveIcon className="w-6 h-6"/>
            </button>
          </div>
          <div className="flex justify-between items-center lg:block border-gray-200 border-b mb-1.5 pb-1.5 mt-2">
            <div className="flex mb-3">
              <div className="flex">
                <ShoppingCartIcon className="w-10 h-10 mr-2"/>
                <h2 className="text-2xl hidden sm:block whitespace-nowrap">Shopping cart</h2>
              </div>
              <div className="relative w-full z-10 ml-2">
                <Combobox value={selectedCart} onChange={setSelectedCart}>
                  <div
                    className="relative z-0"
                    onClick={() => setOpenOptions(true)}
                    onBlur={() => setTimeout(() => setOpenOptions(false), 100)}>
                    <Combobox.Input
                      className="input peer pr-10"
                      onChange={(event) => setQuery(event.target.value)}
                      displayValue={(cart) => cart?.name || ''}
                      placeholder=" "
                    />
                    <Combobox.Label className="combobox-input-label">
                      Title
                    </Combobox.Label>
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <SelectorIcon
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                  </div>
                  <Combobox.Options
                    static={openOptions}
                    className="combobox-options">
                    {query.length > 0 && (
                      <Combobox.Option
                        value={{id: null, name: query}}
                        className={({active}) =>
                          `combobox-option px-3 ${active ? 'bg-cyan-50' : ''}`
                        }>
                        Create "{query}"
                      </Combobox.Option>
                    )}
                    {filteredCarts.map((cart) => (
                      <Combobox.Option
                        key={cart.name}
                        value={cart}
                        className={({active}) =>
                          `combobox-option px-3 ${active ? 'bg-cyan-50' : ''}`
                        }>
                        {cart.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox>
              </div>
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
