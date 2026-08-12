import { IconSettings, IconBrandGithub } from "@tabler/icons-react"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { WorkspaceSettingsSheet } from "./workspace-settings-sheet"

export function NavSecondary({...props}) {
    return (
        <SidebarGroup {...props}>
            <SidebarMenu>
                <SidebarMenuItem>
                    <WorkspaceSettingsSheet>
                        <SidebarMenuButton>
                            <IconSettings/>
                            <span>Settings</span>
                        </SidebarMenuButton>
                    </WorkspaceSettingsSheet>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton>
                    <IconBrandGithub/>
                    <span>Github</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}