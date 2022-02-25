import Head from 'next/head.js';
import {ProjectForm} from '../components/projects/project-form.js';
import {ProjectList} from '../components/projects/project-list.js';
import {findAll} from './api/projects/index.js';
import {useState} from 'react';

export default function Projects({projects}) {

  const [selectedProject, setSelectedProject] = useState(null);
  const [updateList, setUpdateList] = useState(false);

  return (
    <>
      <Head>
        <title>Projects | How much ?!!</title>
      </Head>
      <main>
        <section className="card mb-4">
          <ProjectForm selectedProject={selectedProject} setSelectedProject={setSelectedProject} setUpdateList={setUpdateList}/>
        </section>
        <section className="card">
          <ProjectList projects={projects} setSelectedProject={setSelectedProject} updateList={updateList} setUpdateList={setUpdateList}/>
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
