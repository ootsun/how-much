import Head from 'next/head.js';
import {OperationForm} from '../components/operations/operation-form.js';
import {OperationList} from '../components/operations/operation-list.js';
import {findAll} from './api/operations/index.js';
import {findAll as findAllProjects} from './api/projects/index.js';
import {useState} from 'react';

export default function Operations({operations, projects}) {

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
          <OperationForm operations={operations} projects={projects} selectedOperation={selectedOperation} setSelectedOperation={setSelectedOperation} setUpdateList={setUpdateList}/>
        </section>
        <section className="card">
          <OperationList operations={operations} setSelectedOperation={setSelectedOperation} selectedOperation={selectedOperation} updateList={updateList} setUpdateList={setUpdateList}/>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const operations = await findAll();
  const projects = await findAllProjects();
  // JSON.parse(JSON.stringify(operations)) -> see https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      operations: JSON.parse(JSON.stringify(operations)),
      projects: JSON.parse(JSON.stringify(projects)),
    }
  }
}
