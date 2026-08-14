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
                    <a href="https://github.com/dchen117/TeamTaskManager" target="_blank">
                        <SidebarMenuButton>
                        <IconBrandGithub/>
                        <span>Github</span>
                        </SidebarMenuButton>
                    </a>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}