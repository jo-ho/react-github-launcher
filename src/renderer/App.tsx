// import { MemoryRouter as Router, Switch } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Row, Col } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { AddModal } from './AddModal';
import ReactMarkdown from 'react-markdown';
import { Component } from 'react'


interface AppState {
  repos: Repo[],
  currentContent: string,
  addModalOpen: boolean
}


export default class App extends Component<{}, AppState>  {

  // const [repos , setRepos] = useState<Repo[]>([]);
  // const [currentContent, setCurrentContent] = useState<string>("")
  // const [addModalOpen, setAddModalOpen] = useState<boolean>(false)


  constructor(props : any) {
    super(props)
    this.state = {
      repos: [],
      currentContent: "",
      addModalOpen: false
    }
  }

  // componentDidMount
  componentDidMount()  {
    //  window.api.getReposFromFile().then((res : Repo[]) => setRepos(res))
     window.api.getReposFromFile().then(
       (res : Repo[]) => {
         this.setState({
           repos: res
         })
       }
      )
     window.api.onShowAddModalRequested(() => {
       this.setState({
         addModalOpen: true
       })
      })
  }

  onTabClick = (content: string) => {
    this.setState({
      currentContent: content
    })
  }


  onAddModalCancel = () => {
    this.setState({
      addModalOpen: false
    })
  }
  onAddModalConfirm = async (ownerName: string, repoName: string) => {

      let newRepo : Repo = {
        name: repoName,
        owner: ownerName,
        content: ""
      }


      var readme = await window.api.getRepoInfoFromGitHub("angband", "angband")
      newRepo.content = readme

      this.setState({
        repos: [...this.state.repos, newRepo]
      }, () => {
        console.log(this.state.repos)
        window.api.saveReposToFile(this.state.repos)
      })




      this.onAddModalCancel()



}


render() {
  return (
    <div>
      <AddModal isOpen={this.state.addModalOpen} onClickCancel={this.onAddModalCancel} onClickConfirm={this.onAddModalConfirm}/>

      <Row noGutters>
        <Col>
          <Sidebar repos={this.state.repos} onTabClick={this.onTabClick}/>
        </Col>
        <Col className="bg-light border min-vh-100 px-2" xs="8">
          <ReactMarkdown>
          {this.state.currentContent}


          </ReactMarkdown>
        </Col>
        <Col className="bg-light border min-vh-100">Column</Col>
      </Row>
    </div>
  );
}
}
