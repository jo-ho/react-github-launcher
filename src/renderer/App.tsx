// import { MemoryRouter as Router, Switch } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import {
	Col,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Button,
	Container,
	Row,
	Nav,
	NavItem,
	Card,
	CardTitle,
	CardBody,
	Alert
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { AddModal } from './AddModal';
import ReactMarkdown from 'react-markdown';
import { Component } from 'react';
import '../config';
import './App.css';
import { EditModal } from './EditModal';
import remarkGfm from 'remark-gfm';
import { AssetExistsModal } from './AssetExistsModal';
import { DeleteModal } from './DeleteModal';
import { LaunchCard } from './LaunchCard';
import { SelectExeCard } from './SelectExeCard';

interface AppState {
	repos: Repo[];
	currentRepo: Repo;
	assetExistsModalOpen: boolean;
	dropDown: boolean;
	currentAsset: any;
	downloadBtnDisabled: boolean;
	downloadDoneAlert: boolean;
	downloadPath: string;
}

export default class App extends Component<{}, AppState> {
	constructor(props: any) {
		super(props);
		this.state = {
			repos: [],
			currentRepo: {} as Repo,
			assetExistsModalOpen: false,
			dropDown: false,
			currentAsset: null,
			downloadBtnDisabled: false,
			downloadDoneAlert: false,
			downloadPath: ''
		};
	}

	componentDidMount() {
		window.api.getReposFromFile().then((res: Repo[]) => {
			this.setState({
				repos: res
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
			// this.setState({
			//   exePath: repo.pathToExe
			// })
		}

		console.log(repo);
	};

	addNewRepo = (repo: Repo) => {
		this.setState(
			{
				repos: [ ...this.state.repos, repo ]
			},
			() => {
				console.log(this.state.repos);
				window.api.saveReposToFile(this.state.repos);
			}
		);
	};

	setCurrentRepoContent = (content: string) => {
		console.log(content);
		this.state.currentRepo.content = content;
		window.api.saveReposToFile(this.state.repos);
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

	onClickDownloadAsset = async () => {
		if (
			await window.api.checkAssetDirExists(
				this.state.currentRepo.owner,
				this.state.currentRepo.name,
				this.state.currentAsset
			)
		) {
			this.setState({
				assetExistsModalOpen: true
			});
		} else {
			this.downloadCurrentAsset();
		}
	};

	downloadCurrentAsset = async () => {
		this.setState({
			downloadBtnDisabled: true
		});

		await window.api.downloadAsset(
			this.state.currentRepo.owner,
			this.state.currentRepo.name,
			this.state.currentAsset
		);
		this.setState({
			downloadBtnDisabled: false,
			downloadDoneAlert: true,
			downloadPath:
				globalThis.app.gamesFolderPath + this.state.currentRepo.owner + '/' + this.state.currentRepo.name + '/'
		});
	};

	setCurrentPathToExe = async () => {
		window.api.chooseExeFile().then((result) => {
			if (!result.canceled) {
				console.log(result.filePaths);
				this.state.currentRepo.pathToExe = result.filePaths[0];
				// force update of pathToExe
				this.setState({});
				window.api.saveReposToFile(this.state.repos);
				console.log(this.state.currentRepo.pathToExe);
			}
		});
	};

	onAssetExistsModalConfirm = () => {
		this.setState({ assetExistsModalOpen: false });
		this.downloadCurrentAsset();
	};

	deleteCurrentRepo = () => {
		this.setState(
			{
				repos: this.state.repos.filter((repo) => repo.id !== this.state.currentRepo.id),
				currentRepo: {} as Repo
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
					content={this.state.currentRepo.content}
					setCurrentRepoContent={this.setCurrentRepoContent}
				/>
				<AssetExistsModal
					isOpen={this.state.assetExistsModalOpen}
					onClickCancel={() => this.setState({ assetExistsModalOpen: false })}
					onClickConfirm={this.onAssetExistsModalConfirm}
				/>
				<DeleteModal deleteCurrentRepo={this.deleteCurrentRepo} />
				<Row noGutters>
					<Col xs="2">
						<Sidebar repos={this.state.repos} onTabClick={this.onTabClick} />
					</Col>
					<Col className="content" xs="8">
						<ReactMarkdown remarkPlugins={[ remarkGfm ]}>{this.state.currentRepo.content}</ReactMarkdown>
					</Col>
					<Col className="bg-dark actions" xs="2">
						{this.state.currentRepo.id ? (
							<Nav vertical justified className="nav-actions">
								<NavItem>
									<LaunchCard currentExePath={this.state.currentRepo.pathToExe} />
								</NavItem>
								<NavItem>
                <SelectExeCard currentExePath={this.state.currentRepo.pathToExe} setCurrentPathToExe={this.setCurrentPathToExe} />

								</NavItem>
								{this.state.currentRepo.assets.length > 0 ? (
									<NavItem>
										<Card className="bg-dark border-0">
											<CardTitle className="text-light" tag="h5">
												Releases
											</CardTitle>
											<CardBody>
												<Dropdown
													toggle={this.toggleDropdown}
													isOpen={this.state.dropDown}
													size="sm"
													ge
												>
													<DropdownToggle block caret>
														{this.state.currentAsset !== null ? (
															this.state.currentAsset.name
														) : (
															'Select'
														)}
													</DropdownToggle>
													<DropdownMenu dark>
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
													disabled={
														this.state.downloadBtnDisabled ||
														this.state.currentAsset === null
													}
													size="sm"
													color="primary"
													className="w-100"
												>
													Download
												</Button>
												{this.state.downloadBtnDisabled ? (
													<p className="text-light py-2"> Downloading ... </p>
												) : (
													''
												)}
												{this.state.downloadDoneAlert ? (
													<Alert
														isOpen={this.state.downloadDoneAlert}
														toggle={() =>
															this.setState({
																downloadDoneAlert: false
															})}
														color="info"
														className="text-break small my-2"
													>
														Download done, saved to {this.state.downloadPath}
													</Alert>
												) : (
													''
												)}
											</CardBody>
										</Card>
									</NavItem>
								) : (
									''
								)}
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
