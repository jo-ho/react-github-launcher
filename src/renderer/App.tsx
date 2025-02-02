import { Sidebar } from './Sidebar';
import { Col, Container, Row, Nav, NavItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { AddModal } from './AddModal';
import ReactMarkdown from 'react-markdown';
import { Component } from 'react';
import '../config';
import './App.css';
import { EditModal } from './EditModal';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { DeleteModal } from './DeleteModal';
import { LaunchCard } from './LaunchCard';
import { SelectExeCard } from './SelectExeCard';
import { ReleasesCard } from './ReleasesCard';
import { RefreshCard } from './RefreshCard';

const updateReleasesInterval = 10000;

interface AppState {
  repos: Repo[];
  currentRepo: Repo;
  currentAsset: any;
  getReleasesTimerId: any;
  lastTime: number;
}

export default class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      repos: [],
      currentRepo: {} as Repo,
      currentAsset: null,
      getReleasesTimerId: null,
      lastTime: 0,
    };
  }

  componentDidMount() {
    window.api.getReposFromFile().then((res: Repo[]) => {
      this.setState({
        repos: res,
      });
    });
	this.setState({
		lastTime: Date.now()
	})
  }

  onTabClick = async (repo: Repo) => {
    this.setState({
      currentRepo: repo,
    });

    // reset currentAsset if selecting a different tab
    if (repo != this.state.currentRepo) {
      this.setState({
        currentAsset: null,
      });
    }
  };

  addNewRepo = (repo: Repo) => {
    this.setState(
      {
        repos: [...this.state.repos, repo],
      },
      () => {
        window.api.saveReposToFile(this.state.repos);
      }
    );
  };

  setCurrentRepoContent = (content: string) => {
    this.state.currentRepo.content = content;
    this.setState({});
    window.api.saveReposToFile(this.state.repos);
  };

  setAsset = (asset: any) => {
    this.setState({
      currentAsset: asset,
    });
  };

  setCurrentPathToExe = async () => {
    window.api
      .chooseExeFile(this.state.currentRepo.owner, this.state.currentRepo.name)
      .then((result) => {
        if (!result.canceled) {
          this.state.currentRepo.pathToExe = result.filePaths[0];
          // force update of pathToExe
          this.setState({});
          window.api.saveReposToFile(this.state.repos);
        }
      });
  };

  updateCurrentRepoReleases = () => {
    var apiCall = async () => {
      try {
        var assets = await window.api.getRepoReleasesFromGitHub(
          this.state.currentRepo.owner,
          this.state.currentRepo.name
        );
        this.state.currentRepo.assets = assets;
        this.setState({});
        window.api.saveReposToFile(this.state.repos);
      } catch (err) {}
    };

	this.updateCanCallApi(apiCall)
  };

  updateCurrentRepoReadme = (): boolean  => {
    var apiCall = async () => {
		try {
		  var readme = await window.api.getRepoInfoFromGitHub(
			this.state.currentRepo.owner,
			this.state.currentRepo.name
		  );
		  this.state.currentRepo.content = readme;
		  this.setState({});
		} catch (err) {}
	  };

	  return this.updateCanCallApi(apiCall)
  }

  updateCanCallApi = (apiCall: () => void) : boolean => {
	var now = Date.now();
	var canRefresh = now - this.state.lastTime >= updateReleasesInterval
	if (canRefresh) {
		this.setState({
			lastTime: now,
		});
		apiCall()
	}
	return canRefresh
  }

  deleteCurrentRepo = () => {
    this.setState(
      {
        repos: this.state.repos.filter(
          (repo) => repo.id !== this.state.currentRepo.id
        ),
        currentRepo: {} as Repo,
      },
      () => {
        window.api.saveReposToFile(this.state.repos);
      }
    );
  };

  render() {
    return (
      <Container fluid>
        <AddModal addNewRepo={this.addNewRepo} />
        <EditModal
		  repo={this.state.currentRepo}
          content={this.state.currentRepo.content}
          setCurrentRepoContent={this.setCurrentRepoContent}
        />

        <DeleteModal 
		  repo={this.state.currentRepo}
		  deleteCurrentRepo={this.deleteCurrentRepo} 
		/>

        <Row className="g-0">
          <Col xs="2">
            <Sidebar repos={this.state.repos} onTabClick={this.onTabClick} />
          </Col>
          <Col className="content" xs="8" data-color-mode="dark">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw as any]}>
              {this.state.currentRepo.content}
            </ReactMarkdown>
          </Col>
          <Col className="bg-dark actions" xs="2">
            {this.state.currentRepo.id ? (
              <Nav vertical justified className="nav-actions">
                <NavItem>
                  <LaunchCard
                    currentExePath={this.state.currentRepo.pathToExe}
                  />
                </NavItem>
                <NavItem>
                  <SelectExeCard
                    currentExePath={this.state.currentRepo.pathToExe}
                    setCurrentPathToExe={this.setCurrentPathToExe}
                  />
                </NavItem>
                {this.state.currentRepo.assets.length > 0 ? (
                  <NavItem>
                    <ReleasesCard
                      currentAsset={this.state.currentAsset}
                      currentRepo={this.state.currentRepo}
                      setCurrentAsset={this.setAsset}
                      updateCurrentRepoReleases={this.updateCurrentRepoReleases}
                    />
                  </NavItem>
                ) : (
                  ''
                )}
                <NavItem>
                  <RefreshCard
				  	currentRepo={this.state.currentRepo}
                    updateCurrentRepoReadme={this.updateCurrentRepoReadme}
                  />
                </NavItem>
              </Nav>
            ) : (
              ''
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}
