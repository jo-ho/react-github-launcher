// import { MemoryRouter as Router, Switch } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Row, Col } from 'reactstrap';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { useCallback } from 'react';
import { AddModal } from './AddModal';

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
    () => {
      let newRepo : Repo = {
        name: "test",
        content: "tes"
      }


      window.api.getRepoInfoFromGitHub("angband", "angband").then(() => {
        console.log("done")
      }
      )


      setRepos(repos => [...repos, newRepo])
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
          {currentContent}
        </Col>
        <Col className="bg-light border min-vh-100">Column</Col>
      </Row>
    </div>
	);
}
