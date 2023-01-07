import Head from 'next/head.js';
import {OperationForm} from '../components/operations/operation-form.js';
import {OperationList} from '../components/operations/operation-list.js';
import {findAll as findAllProjects} from './api/projects/index.js';
import {useState} from 'react';
import {search} from "./api/operations/search.js";

export default function Operations({initialOperations, projects}) {

  const [selectedOperation, setSelectedOperation] = useState(null);
  const [updateList, setUpdateList] = useState(false);

  return (
    <>
      <Head>
        <title>Operations | How much ?!!</title>
      </Head>
      <main>
        <h2 className="text-2xl mb-3">Operations</h2>
        <section className="card mb-4">
          <OperationForm projects={projects} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} setUpdateList={setUpdateList}/>
        </section>
        <section className="card">
          <OperationList initialOperations={initialOperations} setSelectedOperation={setSelectedOperation} selectedOperation={selectedOperation} updateList={updateList} setUpdateList={setUpdateList} readonlyMode={false} havingLastGasUsage={false}/>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const initialOperations = await search(0, null, false);
  const projects = await findAllProjects();
  // JSON.parse(JSON.stringify(initialOperations)) -> see https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      initialOperations: JSON.parse(JSON.stringify(initialOperations)),
      projects: JSON.parse(JSON.stringify(projects)),
    }
  }
}
