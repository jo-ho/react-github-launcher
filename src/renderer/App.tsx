// import { MemoryRouter as Router, Switch } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Row, Col } from 'reactstrap';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useCallback } from 'react';
import { AddModal } from './AddModal';
import ReactMarkdown from 'react-markdown';

export default function App() {

  const [repos , setRepos] = useState<Repo[]>([]);
  const [currentContent, setCurrentContent] = useState<string>("")
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false)

  const onTabClick = useCallback(
    (content) => { setCurrentContent(content) }, []
  )

  // componentDidMount
  useEffect(() => {
     window.api.getReposFromFile().then((res : Repo[]) => setRepos(res))
     window.api.onShowAddModalRequested(() => {setAddModalOpen(true)})

  }, []);


  const onAddModalCancel = useCallback(
    () => { setAddModalOpen(false)}, []
  )

  const onAddModalConfirm = useCallback(
    async (ownerName: string, repoName: string) => {
      let newRepo : Repo = {
        name: repoName,
        owner: ownerName,
        content: ""
      }

      console.log(repoName)
      console.log(ownerName)

      var readme = await window.api.getRepoInfoFromGitHub("angband", "angband")
      newRepo.content = readme

      setRepos(repos => [...repos, newRepo])

      console.log(repos)
      // window.api.saveReposToFile(repos)


      setAddModalOpen(false)


    }, []
  )


	return (
    <div>
      <AddModal isOpen={addModalOpen} onClickCancel={onAddModalCancel} onClickConfirm={onAddModalConfirm}/>

      <Row noGutters>
        <Col>
          <Sidebar repos={repos} onTabClick={onTabClick}/>
        </Col>
        <Col className="bg-light border min-vh-100 px-2" xs="8">
          <ReactMarkdown>
          {currentContent}


          </ReactMarkdown>
        </Col>
        <Col className="bg-light border min-vh-100">Column</Col>
      </Row>
    </div>
	);
}
