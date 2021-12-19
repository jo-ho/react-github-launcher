import { Nav, NavItem, NavLink } from 'reactstrap';

interface SidebarProps {
  repos: Repo[]
  onTabClick: (repo: Repo) => void
}


export const Sidebar = (props: SidebarProps) => {
	return (
		<Nav vertical pills className="bg-dark  min-vh-100  ">
			{props.repos.map((element) => {
				return (
					<NavItem key={element.id} >
						<NavLink onClick={ () => props.onTabClick(element)} >{element.name}</NavLink>
					</NavItem>
				);
			})}
		</Nav>
	);
};
