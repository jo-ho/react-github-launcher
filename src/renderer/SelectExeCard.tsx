import { Button, Card, CardBody, CardTitle } from 'reactstrap';

interface SelectExeCardProps {
	currentExePath: string;
  setCurrentPathToExe: () => void;
}

export const SelectExeCard = (props: SelectExeCardProps) => {


	return (
    <Card className="bg-dark border-0">
    <CardTitle className="text-light" tag="h5">
      App path
    </CardTitle>
    <CardBody>
      <p className=" text-break small text-secondary">
        {props.currentExePath}
      </p>
      <Button
        className="w-100"
        onClick={props.setCurrentPathToExe}
        size="sm"
        color="primary"
      >
        Select exe
      </Button>
    </CardBody>
  </Card>
	);
};
