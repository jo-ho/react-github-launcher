import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useEffect, useState } from 'react'


interface EditModalProps {
  content: string;
  setCurrentRepoContent: (content: string) => void
}



export const EditModal = (props: EditModalProps) => {


  const [content, setContent] = useState("")
  const [isOpen, setIsOpen] = useState(false)




  useEffect(() => {
    window.api.onShowEditModalRequested(() => {
			setIsOpen(true)
    })
  }, [])

  const handleContentChange = (e : React.FormEvent<HTMLInputElement>) => {

    setContent(e.currentTarget.value)

  }

  const onClickConfirm = () => {
    setIsOpen(false)
    props.setCurrentRepoContent(content)
  }




	return (
		<div>
			<Modal className="modal-fullscreen" size="lg" isOpen={isOpen}>
				<ModalHeader>Edit readme</ModalHeader>
				<ModalBody className="h-100">
          <Input className="h-100"
          defaultValue={props.content}
      type="textarea"
      onChange={handleContentChange}
    ></Input>
				</ModalBody>

				<ModalFooter>
					<Button color="primary" onClick={onClickConfirm} >Confirm</Button>
					<Button onClick={() => setIsOpen(false)} >Cancel</Button>

				</ModalFooter>
			</Modal>
		</div>
	);
};

