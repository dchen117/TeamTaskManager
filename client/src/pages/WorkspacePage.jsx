import { WorkspaceForm } from "@/components/workspace-form"
import { AuthContext } from "@/contexts/AuthContext"
import { useContext } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ChevronsUpDownIcon } from "lucide-react"
import { DropdownUser } from "@/components/dropdown-user"

export default function WorkspacePage() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex min-h-svh flex-col">
      {user &&    
        <div className="w-full p-2 sm:w-64">
          <DropdownUser side="top" align="end">
            <button
              type="button"
              className="flex h-12 w-full items-center gap-2 rounded-lg px-2 text-left text-sm
              hover:bg-accent hover:text-accent-foreground
              data-[state=open]:bg-accent data-[state=open]:text-accent-foreground"
            >
              <Avatar className="h-8 w-8 shrink-0 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.displayName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              {/* <ChevronsUpDownIcon className="ml-auto size-4 shrink-0" /> */}
            </button>
          </DropdownUser>
        </div>
      }
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <WorkspaceForm />
        </div>
      </div>
    </div>
  )
}