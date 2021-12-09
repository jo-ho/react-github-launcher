import { Button, Card, CardBody } from 'reactstrap';

interface LaunchCardProps {
	currentExePath: string;
}

export const LaunchCard = (props: LaunchCardProps) => {
	const onClick = async () => {
		window.api.launchExeFile(props.currentExePath);
	};

	return (
		<Card className="bg-dark border-0">
			<CardBody>
				<Button
					onClick={onClick}
					disabled={props.currentExePath === ''}
					size="sm"
					color="primary"
					className="w-100 py-3"
				>
					Launch
				</Button>
			</CardBody>
		</Card>
	);
};
