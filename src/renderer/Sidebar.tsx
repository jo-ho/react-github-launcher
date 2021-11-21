import { Nav, NavItem, NavLink } from 'reactstrap';

interface SidebarProps {
  repos: Repo[]
  onTabClick: (repo:any) => void
}


export const Sidebar = (props: SidebarProps) => {
	return (
		<Nav vertical className="bg-dark  min-vh-100 ">
			{props.repos.map((element) => {
				return (
					<NavItem>
						<NavLink onClick={ () => props.onTabClick(element.content)} >{element.name}</NavLink>
					</NavItem>
				);
			})}
		</Nav>
	);
};
