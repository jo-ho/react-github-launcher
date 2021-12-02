// import { MemoryRouter as Router, Switch } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import {  Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Button, Container, Row, Nav, NavItem, Card, CardTitle, CardBody,   } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { AddModal } from './AddModal';
import ReactMarkdown from 'react-markdown';
import { Component } from 'react';
import '../config';
import './App.css'

interface AppState {
	repos: Repo[];
	currentRepo: Repo;
	addModalOpen: boolean;
	addModalErrorMsg: string;
	dropDown: boolean;
	currentAsset: any;
	downloadBtnDisabled: boolean;
	exePath: string;
  addModalAddAsRepo: boolean;
}

export default class App extends Component<{}, AppState> {
	constructor(props: any) {
		super(props);
		this.state = {
			repos: [],
			currentRepo: { owner: '', name: '', content: '', assets: [], pathToExe: '' },
			addModalOpen: false,
			dropDown: false,
			currentAsset: null,
			downloadBtnDisabled: false,
			exePath: '',
			addModalErrorMsg: '',
      addModalAddAsRepo: false
		};
	}

	componentDidMount() {
		window.api.getReposFromFile().then((res: Repo[]) => {
			this.setState({
				repos: res
			});
		});
		window.api.onShowAddModalRequested((event, addAsRepo) => {
      console.log(event)
      console.log(addAsRepo)
			this.setState({
				addModalOpen: true,
        addModalAddAsRepo: addAsRepo
			});
		});
	}

	onTabClick = (repo: Repo) => {
		this.setState({
			currentRepo: repo
		});

		// reset currentAsset if selecting a different tab
		if (repo != this.state.currentRepo) {
			this.setState({
				currentAsset: null
			});
      this.setState({
        exePath: repo.pathToExe
      })
		}

		console.log(repo);
	};

	onAddModalCancel = () => {
		this.setState({
			addModalOpen: false
		});
	};
	onAddModalConfirm = async (ownerName: string, repoName: string) => {
    let newRepo: Repo = {
      name: repoName,
      owner: ownerName,
      content: '',
      assets: [],
      pathToExe: ''
    };


    if (this.state.addModalAddAsRepo) {
      try {
        await window.api.getRepo(ownerName, repoName);


          try {
            var readme = await window.api.getRepoInfoFromGitHub(ownerName, repoName);
            newRepo.content = readme;

          } catch (error) {

            console.log(error, 'Readme not found');
          } finally {
            try {
              var assets = await window.api.getRepoReleasesFromGitHub(ownerName, repoName);
              newRepo.assets = assets;

              console.log(assets);

              this.setState(
                {
                  repos: [ ...this.state.repos, newRepo ]
                },
                () => {
                  console.log(this.state.repos);
                  window.api.saveReposToFile(this.state.repos);
                }
              );
              this.onAddModalCancel();
            } catch (error) {
              this.setState({
                addModalErrorMsg: 'Releases not found'
              });
              console.log(error, 'Releases not found');
            }
          }
      } catch (error) {
        this.setState({
          addModalErrorMsg: 'Repo not found'
        });
        console.log(error, 'repo not found');
      }
    } else {
      this.setState(
        {
          repos: [ ...this.state.repos, newRepo ]
        },
        () => {
          console.log(this.state.repos);
          window.api.saveReposToFile(this.state.repos);
        }
      );
      this.onAddModalCancel();

    }

	};

	toggleDropdown = () => {
		this.setState({
			dropDown: !this.state.dropDown
		});
	};

	setAsset = (asset: any) => {
		this.setState({
			currentAsset: asset
		});
	};

	onClickDownloadAsset = () => {
		this.setState(
			{
				downloadBtnDisabled: true
			},
			async () => {
				await window.api.downloadAsset(this.state.currentAsset);
				this.setState({
					downloadBtnDisabled: false
				});
			}
		);
	};

	onClickStartBtn = async () => {
		window.api.chooseExeFile().then((result) => {
			if (!result.canceled) {
				console.log(result.filePaths);
				this.state.currentRepo.pathToExe = result.filePaths[0];
				this.setState({
					exePath: result.filePaths[0]
				});
				window.api.saveReposToFile(this.state.repos);
				console.log(this.state.currentRepo.pathToExe);
			}
		});
	};

	onClickLaunchBtn = async () => {
		window.api.launchExeFile(this.state.exePath);
	};

	addModalErrorMsgToggle = () => {
		this.setState({
			addModalErrorMsg: ''
		});
	};

	render() {
		return (
      <Container fluid >
				<AddModal
					isOpen={this.state.addModalOpen}
					errorMsg={this.state.addModalErrorMsg}
					errorMsgToggle={this.addModalErrorMsgToggle}
					onClickCancel={this.onAddModalCancel}
					onClickConfirm={this.onAddModalConfirm}
          addAsRepo={this.state.addModalAddAsRepo}
				/>
        <Row noGutters>
					<Col xs="2">
						<Sidebar repos={this.state.repos} onTabClick={this.onTabClick} />
					</Col>
					<Col className="content" xs="8">
						<ReactMarkdown  >
               {this.state.currentRepo.content}
              </ReactMarkdown>
					</Col>
					<Col className="bg-dark actions" xs="2">
						{this.state.currentRepo.assets.length > 0 ? (

							<Nav vertical justified className="nav-actions">

<NavItem>
                <Card className="bg-dark border-0">
					<CardBody>
								<Button
									onClick={this.onClickLaunchBtn}
									disabled={this.state.exePath === ''}
									size="sm"
									color="primary"
                  className="w-100 py-3"


								>
									Launch
								</Button>
                </CardBody>
                </Card>
                </NavItem>


                <NavItem>
				<Card className="bg-dark border-0">
					<CardTitle className="text-light" tag="h5">
						App path
					</CardTitle>
					<CardBody>
						<p className=" text-break text-secondary">{this.state.exePath}</p>
								<Button className="w-100" onClick={this.onClickStartBtn} size="sm" color="primary">
									Select exe
								</Button>
								</CardBody>
								</Card>
                </NavItem>
                <NavItem>
                  <Card className="bg-dark border-0">
                  <CardTitle className="text-light" tag="h5">
        Releases
      </CardTitle>
      <CardBody>
								<Dropdown toggle={this.toggleDropdown} isOpen={this.state.dropDown} size="sm" ge>
									<DropdownToggle block caret  >
										{this.state.currentAsset !== null ? this.state.currentAsset.name : 'Select'}
									</DropdownToggle>
									<DropdownMenu dark >
										{this.state.currentRepo.assets.map((element) => {
											return (
												<DropdownItem onClick={() => this.setAsset(element)}>
													{element.browser_download_url}
												</DropdownItem>
											);
										})}
									</DropdownMenu>
								</Dropdown>

								<Button
									onClick={this.onClickDownloadAsset}
									disabled={this.state.downloadBtnDisabled || this.state.currentAsset === null}
									size="sm"
									color="primary"
                  className="w-100"
								>
									Download
								</Button>
                </CardBody>
                </Card>
                </ NavItem>
							</Nav>

						) : (
							'Column'
						)}
					</Col>
          </Row>
        </Container>
		);
	}
}
