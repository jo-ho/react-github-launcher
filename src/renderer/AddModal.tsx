import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Alert,
	InputGroup,
	InputGroupText
} from 'reactstrap';
import { useEffect, useState } from 'react';
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';

interface AddModalProps {
	addNewRepo: (repo: Repo) => void;
}

export const AddModal = (props: AddModalProps) => {
	const [ repoName, setRepoName ] = useState('');
	const [ ownerName, setOwnerName ] = useState('');
	const [ isOpen, setIsOpen ] = useState(false);
	const [ addAsRepo, setAddAsRepo ] = useState(false);
	const [ errorMsg, setErrorMsg ] = useState('');

	useEffect(() => {
		window.api.onShowAddModalRequested((_event, addAsRepo) => {

			setAddAsRepo(addAsRepo);
			setIsOpen(true);
		});
	}, []);


	const handleOnClickConfirm = async () => {
		let newRepo: Repo = {
      id: uuidv4(),
			name: repoName,
			owner: ownerName,
			content: '',
			assets: [],
			pathToExe: '',
		};

		if (addAsRepo) {
			try {
				await window.api.getRepo(ownerName, repoName);

				try {

					var readme = await window.api.getRepoInfoFromGitHub(ownerName, repoName);

					newRepo.content = readme;
				} catch (error) {

				} finally {
					try {
						var assets = await window.api.getRepoReleasesFromGitHub(ownerName, repoName);
						newRepo.assets = assets;


						setIsOpen(false);
						props.addNewRepo(newRepo);
					} catch (error) {
						setErrorMsg('Releases not found');


					}
				}
			} catch (error) {
				setErrorMsg('repo not found');


			}
		} else {
			setIsOpen(false);
			props.addNewRepo(newRepo);
		}
	};

	return (
		<div>
			<Modal size="sm" isOpen={isOpen}>
				<ModalHeader>Add repo</ModalHeader>

				<ModalBody>
					{addAsRepo ? (
						<InputGroup size="sm">
							<InputGroupText>Owner:</InputGroupText>
							<Input onChange={(e) => setOwnerName(e.currentTarget.value)} />
						</InputGroup>
					) : (
						""
					)}

					<InputGroup size="sm">
						<InputGroupText>Repo:</InputGroupText>
						<Input onChange={(e) => setRepoName(e.currentTarget.value)} />
					</InputGroup>
					<Alert toggle={() => setErrorMsg('')} isOpen={errorMsg !== ''} color="danger">
						{errorMsg}
					</Alert>
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={handleOnClickConfirm}>
						Add
					</Button>
					<Button onClick={() => setIsOpen(false)}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
