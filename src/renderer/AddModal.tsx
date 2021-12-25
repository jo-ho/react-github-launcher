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
	const [ name, setName ] = useState('');
	const [ owner, setOwner ] = useState('');
	const [ isOpen, setIsOpen ] = useState(false);
	const [ addAsRepo, setAddAsRepo ] = useState(false);
	const [ errorMsg, setErrorMsg ] = useState('');

	useEffect(() => {
		window.api.onShowAddModalRequested((_event, addAsRepo) => {

			setAddAsRepo(addAsRepo);
			resetFieldsOnExit(true);
		});
	}, []);


  const resetFieldsOnExit = (isOpen: boolean) => {
    setIsOpen(isOpen)
    setName("")
    setOwner("")
    setErrorMsg("")
  }

	const handleOnClickConfirm = async () => {



		let newRepo: Repo = {
      id: uuidv4(),
			name: name,
			owner: addAsRepo ? owner : "",
			content: '',
			assets: [],
			pathToExe: '',
		};

		if (addAsRepo) {
			try {
        if (!name || !owner) {
          setErrorMsg('All fields required');
          return
        }
				await window.api.getRepo(owner, name);

				try {
					var readme = await window.api.getRepoInfoFromGitHub(owner, name);
					newRepo.content = readme;
				} catch (error) {

				} finally {
					try {
						var assets = await window.api.getRepoReleasesFromGitHub(owner, name);
						newRepo.assets = assets;

						resetFieldsOnExit(false);
						props.addNewRepo(newRepo);
					} catch (error) {
						setErrorMsg('Releases not found');
					}
				}
			} catch (error) {
				setErrorMsg('Repo not found, or github API rate limit exceeded');


			}
		} else { // Custom add

      if (!name) {
        setErrorMsg('All fields required');
        return
      }

			resetFieldsOnExit(false);
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
							<Input onChange={(e) => setOwner(e.currentTarget.value)} />
						</InputGroup>
					) : (
						""
					)}

					<InputGroup size="sm">
						<InputGroupText>Name:</InputGroupText>
						<Input  onChange={(e) => setName(e.currentTarget.value)} />
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
