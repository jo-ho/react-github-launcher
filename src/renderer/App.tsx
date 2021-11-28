// import { MemoryRouter as Router, Switch } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Row, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { AddModal } from './AddModal';
import ReactMarkdown from 'react-markdown';
import { Component } from 'react';
import '../config';

interface AppState {
	repos: Repo[];
	currentRepo: Repo;
	addModalOpen: boolean;
	addModalErrorMsg: string;
	dropDown: boolean;
	currentAsset: any;
	downloadBtnDisabled: boolean;
	exePath: string;
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
			addModalErrorMsg: ''
		};
	}

	componentDidMount() {
		window.api.getReposFromFile().then((res: Repo[]) => {
			this.setState({
				repos: res
			});
		});
		window.api.onShowAddModalRequested(() => {
			this.setState({
				addModalOpen: true
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
		try {
			await window.api.getRepo(ownerName, repoName);
			let newRepo: Repo = {
				name: repoName,
				owner: ownerName,
				content: '',
				assets: [],
				pathToExe: ''
			};

			try {
				var readme = await window.api.getRepoInfoFromGitHub(ownerName, repoName);
				newRepo.content = readme;
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
			} catch (error) {
				this.setState({
					addModalErrorMsg: 'Readme not found'
				});
				console.log(error, 'readme not found');
			}
		} catch (error) {
			this.setState({
				addModalErrorMsg: 'Repo not found'
			});
			console.log(error, 'repo not found');
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
			<div>
				<AddModal
					isOpen={this.state.addModalOpen}
					errorMsg={this.state.addModalErrorMsg}
					errorMsgToggle={this.addModalErrorMsgToggle}
					onClickCancel={this.onAddModalCancel}
					onClickConfirm={this.onAddModalConfirm}
				/>

				<Row noGutters>
					<Col>
						<Sidebar repos={this.state.repos} onTabClick={this.onTabClick} />
					</Col>
					<Col className="bg-light border min-vh-100 px-2" xs="8">
						<ReactMarkdown>{this.state.currentRepo.content}</ReactMarkdown>
					</Col>
					<Col className="bg-dark border min-vh-100">
						{this.state.currentRepo.assets.length > 0 ? (
							<div>
								<Dropdown toggle={this.toggleDropdown} isOpen={this.state.dropDown} size="sm" ge>
									<DropdownToggle caret  >
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
								>
									Download
								</Button>
								<Button onClick={this.onClickStartBtn} size="sm" color="primary">
									Select exe
								</Button>
								<Button
									onClick={this.onClickLaunchBtn}
									disabled={this.state.exePath === ''}
									size="sm"
									color="primary"
								>
									Launch
								</Button>
							</div>
						) : (
							'Column'
						)}
					</Col>
				</Row>
			</div>
		);
	}
}
