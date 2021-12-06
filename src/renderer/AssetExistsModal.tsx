import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';



interface AssetExistsModalProps {
  isOpen: boolean;
	onClickCancel: () => void;
  onClickConfirm: () => void;
}



export const AssetExistsModal = (props: AssetExistsModalProps) => {



	return (
			<Modal size="small" isOpen={props.isOpen}>
				<ModalHeader>Warning</ModalHeader>
				<ModalBody>
          Asset already exists, do you want to replace it?
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={props.onClickConfirm} >Confirm</Button>
					<Button onClick={props.onClickCancel} >Cancel</Button>

				</ModalFooter>
			</Modal>
	);
};

