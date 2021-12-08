import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useEffect, useState } from 'react'


interface DeleteModalProps {
  deleteCurrentRepo: () => void
}





export const DeleteModal = (props: DeleteModalProps) => {

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    window.api.onShowDeleteModalRequested(() => {
      setIsOpen(true)
    })
  }, [])

  const onClickConfirm = () => {
    setIsOpen(false)
    props.deleteCurrentRepo()
  }

	return (
		<div>
			<Modal  size="sm" isOpen={isOpen}>
				<ModalHeader>Delete Modal</ModalHeader>
				<ModalBody >
          Are you sure you want delete this repo?
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={onClickConfirm} >Confirm</Button>
					<Button onClick={ () => setIsOpen(false)} >Cancel</Button>

				</ModalFooter>
			</Modal>
		</div>
	);
};

