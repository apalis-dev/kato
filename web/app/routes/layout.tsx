import { NavLink, Outlet, useLocation } from "react-router";
import { useEffect, useState } from "react";

import { Workflow, Activity, ScrollText, Bot } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
	{ to: "/workflows", label: "Workflows", icon: Workflow },
	{ to: "/executions", label: "Executions", icon: Activity },
	{ to: "/logs", label: "Logs", icon: ScrollText },
	{ to: "/agents", label: "Agents", icon: Bot },
];

const FOCUS_ROUTES = ["/workflows/"];

export default function Layout() {
	const location = useLocation();
	const isFocusRoute = FOCUS_ROUTES.some((route) =>
		location.pathname.startsWith(route),
	) && location.pathname !== "/workflows";

	const [userOpen, setUserOpen] = useState(true);
	const [open, setOpen] = useState(!isFocusRoute);

	useEffect(() => {
		if (isFocusRoute) {
			setOpen(false);
		} else {
			setOpen(userOpen);
		}
	}, [isFocusRoute, userOpen]);

	return (
		<SidebarProvider
			open={open}
			onOpenChange={(value) => {
				setOpen(value);
				if (!isFocusRoute) setUserOpen(value);
			}}
		>
			<Sidebar collapsible="icon">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{navItems.map((item) => {
									const Icon = item.icon;
									const active = location.pathname.startsWith(item.to);

									return (
										<SidebarMenuItem key={item.to}>
											<SidebarMenuButton
												asChild
												isActive={active}
												tooltip={item.label}
											>
												<NavLink to={item.to}>
													<Icon />
													<span>{item.label}</span>
												</NavLink>
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<SidebarTrigger />
				</SidebarFooter>

				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	);
}
