import { useEffect, useState } from 'react';
import { Button, Card, CardBody, Alert } from 'reactstrap';

interface RefreshCardProps {
	currentRepo: Repo;
	updateCurrentRepoReadme: () => boolean;
}

export const RefreshCard = (props: RefreshCardProps) => {
	const [ canRefreshAlertMsg, setCanRefreshAlertMsg ] = useState('');

	useEffect(
		() => {
			setCanRefreshAlertMsg('');
		},
		[ props.currentRepo ]
	);

	const updateCurrentRepoReadme = async () => {
		if (props.updateCurrentRepoReadme()) {
			setCanRefreshAlertMsg('Updated README.');
		} else {
			setCanRefreshAlertMsg('Please wait for cooldown to expire.');
		}
	}

	return (
		<Card className="bg-dark border-0">
			<CardBody>
				<Button
					onClick={updateCurrentRepoReadme}
					disabled={props.currentRepo.assets.length == 0}
					size="sm"
					color="primary"
					className="w-100 py-3"
				>
					Refresh README
				</Button>
				<Alert
					isOpen={canRefreshAlertMsg !== ''}
					toggle={() => setCanRefreshAlertMsg('')}
					color="info"
					className="text-break small my-2"
				>
					{canRefreshAlertMsg}
				</Alert>
			</CardBody>
		</Card>
	);
};
