import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOutIcon, User2Icon } from "lucide-react"
import { AuthContext } from "@/contexts/AuthContext"
import { useContext } from "react"

export function DropdownUser({children, side, align}) {
  const { logout, user } = useContext(AuthContext)

  if (!user) {
    return null
  }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent
        className="w-fit"
        side={side}
        align={align}
        sideOffset={4}>
        {/* <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.displayName}</span>
                <span className="truncate text-xs">{user.email}</span>
            </div>
            </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
            <DropdownMenuItem>
            <User2Icon />
            Profile
            </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={async () => { await logout() }}>
            <LogOutIcon />
            Log out
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}
