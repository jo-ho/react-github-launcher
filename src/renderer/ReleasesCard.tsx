import { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Card,
	CardBody,
	CardTitle,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle
} from 'reactstrap';
import { AssetExistsModal } from './AssetExistsModal';

interface ReleasesCardProps {
	currentAsset: any;
	currentRepo: Repo;
	setCurrentAsset: (asset: any) => void;
	updateCurrentRepoReleases: () => void;
}

export const ReleasesCard = (props: ReleasesCardProps) => {
	const [ isOpen, setIsOpen ] = useState(false);
	const [ assetExistsModalOpen, setAssetExistsModalOpen ] = useState(false);
	const [ downloadBtnDisabled, setDownloadBtnDisabled ] = useState(false);
	const [ downloadDoneAlertMsg, setDownloadDoneAlertMsg ] = useState('');

	const onClickDownloadAsset = async () => {
		if (await window.api.checkAssetDirExists(props.currentRepo.owner, props.currentRepo.name, props.currentAsset)) {
			setAssetExistsModalOpen(true);
		} else {
			downloadCurrentAsset();
		}
	};

	const onAssetExistsModalConfirm = () => {
		setAssetExistsModalOpen(false);
		downloadCurrentAsset();
	};

	const downloadCurrentAsset = async () => {
		setDownloadBtnDisabled(true);

		if (await window.api.downloadAsset(props.currentRepo.owner, props.currentRepo.name, props.currentAsset)) {
			setDownloadDoneAlertMsg(
				' Download done, saved to ' +
					globalThis.app.gamesFolderPath +
					'/' +
					props.currentRepo.owner +
					'/' +
					props.currentRepo.name +
					'/'
			);
		} else {
			setDownloadDoneAlertMsg('Error occured when download/extracting the asset');
		}
		setDownloadBtnDisabled(false);
	};

	const onDropdownToggle = () => {
		setIsOpen(!isOpen);
		if (!isOpen) props.updateCurrentRepoReleases();
	};

	useEffect(
		() => {
			setDownloadDoneAlertMsg('');
		},
		[ props.currentRepo ]
	);

	return (
		<Card className="bg-dark border-0">
			<AssetExistsModal
				isOpen={assetExistsModalOpen}
				onClickCancel={() => setAssetExistsModalOpen(false)}
				onClickConfirm={onAssetExistsModalConfirm}
			/>

			<CardTitle className="text-light" tag="h5">
				Releases
			</CardTitle>
			<CardBody>
				<Dropdown toggle={onDropdownToggle} isOpen={isOpen} size="sm">
					<DropdownToggle block caret className="text-break">
						{props.currentAsset !== null ? props.currentAsset.name : 'Select'}
					</DropdownToggle>
					<DropdownMenu dark>
						{props.currentRepo.assets.map((element) => {
							return (
								<DropdownItem key={element.id} onClick={() => props.setCurrentAsset(element)}>
									{element.browser_download_url}
								</DropdownItem>
							);
						})}
					</DropdownMenu>
				</Dropdown>

				<Button
					onClick={onClickDownloadAsset}
					disabled={downloadBtnDisabled || props.currentAsset === null}
					size="sm"
					color="primary"
					className="w-100"
				>
					Download
				</Button>
				{downloadBtnDisabled ? <p className="text-light py-2"> Downloading ... </p> : ''}
				<Alert
					isOpen={downloadDoneAlertMsg !== ''}
					toggle={() => setDownloadDoneAlertMsg('')}
					color="info"
					className="text-break small my-2"
				>
					{downloadDoneAlertMsg}
				</Alert>
			</CardBody>
		</Card>
	);
};
