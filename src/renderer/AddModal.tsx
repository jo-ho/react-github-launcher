import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

interface AddModalProps {
	isOpen: boolean;
	onClickCancel: () => void;
  onClickConfirm: () => void
}

export const AddModal = (props: AddModalProps) => {
	return (
		<div>
			<Modal size="sm" isOpen={props.isOpen}>
				<ModalHeader>Add repo</ModalHeader>

				<ModalBody>
					<p>Enter a github link:</p>
					<Input />
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={props.onClickConfirm}>Add</Button>
					<Button onClick={props.onClickCancel}>Cancel</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};
