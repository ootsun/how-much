import Head from 'next/head.js';
import {ProjectForm} from '../components/projects/project-form.js';
import {ProjectList} from '../components/projects/project-list.js';
import {useContext, useState} from 'react';
import {search} from "./api/projects/search.js";
import {ReadOnlyAlert} from "../components/read-only-alert.js";
import {editorContext} from "./_app.js";

export default function Projects({initialProjects}) {

  const [selectedProject, setSelectedProject] = useState(null);
  const [updateList, setUpdateList] = useState(false);

  const {canEdit} = useContext(editorContext);

  return (
    <>
      <Head>
        <title>Projects | How much ?!!</title>
      </Head>
      <main>
        <h2 className="text-2xl mb-3">Projects</h2>
        {!canEdit &&
        <div className="mb-4">
          <ReadOnlyAlert/>
        </div>
        }
        {canEdit &&
        <section className="card mb-4">
          <ProjectForm selectedProject={selectedProject} setSelectedProject={setSelectedProject}
                       setUpdateList={setUpdateList}/>
        </section>
        }
        <section className="card">
          <ProjectList initialProjects={initialProjects} setSelectedProject={setSelectedProject}
                       selectedProject={selectedProject} updateList={updateList} setUpdateList={setUpdateList}/>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const initialProjects = await search(0, null);
  // JSON.parse(JSON.stringify(initialProjects)) -> see https://github.com/vercel/next.js/issues/11993
  return {
    props: {
      initialProjects: JSON.parse(JSON.stringify(initialProjects))
    }
  }
}
