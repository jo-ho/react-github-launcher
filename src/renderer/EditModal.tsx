import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useState } from 'react'


interface EditModalProps {
	isOpen: boolean;
  content: string;
	onClickCancel: () => void;
  onClickConfirm: (content: string) => void
}



export const EditModal = (props: EditModalProps) => {


  const [content, setContent] = useState("")


  const handleContentChange = (e : React.FormEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.value)
    setContent(e.currentTarget.value)

  }


	return (
		<div>
			<Modal className="modal-fullscreen" size="lg" isOpen={props.isOpen}>
				<ModalHeader>Edit readme</ModalHeader>
				<ModalBody className="h-100">
          <Input className="h-100"
          defaultValue={props.content}
      type="textarea"
      onChange={handleContentChange}
    ></Input>
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={() => props.onClickConfirm(content)} >Confirm</Button>
					<Button onClick={props.onClickCancel} >Cancel</Button>

				</ModalFooter>
			</Modal>
		</div>
	);
};

