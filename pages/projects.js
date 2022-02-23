import Head from 'next/head.js';
import {ProjectForm} from '../components/projects/project-form.js';
import {ProjectList} from '../components/projects/project-list.js';
import {findAll} from './api/projects/index.js';

export default function Projects({projects}) {

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
          <ProjectList projects={projects}/>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const projects = await findAll();
  // JSON.parse(JSON.stringify(projects)) -> see https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      projects: JSON.parse(JSON.stringify(projects))
    }
  }
}
