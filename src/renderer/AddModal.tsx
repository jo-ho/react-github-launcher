import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Alert } from 'reactstrap';
import { useState } from 'react'

interface AddModalProps {
	isOpen: boolean;
	onClickCancel: () => void;
  onClickConfirm: (ownerName: string, repoName: string) => void
  errorMsg: string
  errorMsgToggle: () => void
}



export const AddModal = (props: AddModalProps) => {

  const [repoName, setRepoName] = useState("")
  const [ownerName, setOwnerName] = useState("")

  const handleNameInputChange = (e : React.FormEvent<HTMLInputElement>) => {
    setRepoName(e.currentTarget.value)
  }
  const handleOwnerInputChange = (e : React.FormEvent<HTMLInputElement>) => {
    setOwnerName(e.currentTarget.value)
  }



	return (
		<div>
			<Modal size="sm" isOpen={props.isOpen}>
				<ModalHeader>Add repo</ModalHeader>

				<ModalBody>
					<p>Enter a github link:</p>
					<Input onChange={handleOwnerInputChange} />

					<Input onChange={handleNameInputChange} />
          <Alert toggle={props.errorMsgToggle} isOpen={props.errorMsg !== ""} color="danger">{props.errorMsg}</Alert>
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={() => props.onClickConfirm(ownerName, repoName)}>Add</Button>
					<Button onClick={props.onClickCancel}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
