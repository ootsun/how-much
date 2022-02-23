import Head from 'next/head.js';
import {ProjectForm} from '../components/projects/project-form.js';
import {ProjectList} from '../components/projects/project-list.js';

export default function Projects() {

  return (
    <>
      <Head>
        <title>Projects | How much ?!!</title>
      </Head>
      <main>
        <section className="card mb-4">
          <ProjectForm/>
        </section>
        <section className="card">
          <ProjectList/>
        </section>
      </main>
    </>
  );
}
