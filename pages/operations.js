import Head from 'next/head.js';
import {OperationForm} from '../components/operations/operation-form.js';
import {OperationList} from '../components/operations/operation-list.js';
import {search as searchProjects} from './api/projects/search.js';
import {useContext, useState} from 'react';
import {search} from "./api/operations/search.js";
import {ReadOnlyAlert} from "../components/read-only-alert.js";
import {editorContext} from "./_app.js";

export default function Operations({initialOperations, initialProjects}) {

  const [selectedOperation, setSelectedOperation] = useState(null);
  const [updateList, setUpdateList] = useState(false);

  const {canEdit} = useContext(editorContext);

  return (
    <>
      <Head>
        <title>Operations | How much ?!!</title>
      </Head>
      <main>
        <h2 className="text-2xl mb-3">Operations</h2>
        {!canEdit &&
          <ReadOnlyAlert/>
        }
        <section className="card mb-4">
          <OperationForm initialProjects={initialProjects} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} setUpdateList={setUpdateList}/>
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
  const initialProjects = await searchProjects(0, null);
  // JSON.parse(JSON.stringify(initialOperations)) -> see https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      initialOperations: JSON.parse(JSON.stringify(initialOperations)),
      initialProjects: JSON.parse(JSON.stringify(initialProjects)),
    }
  }
}
