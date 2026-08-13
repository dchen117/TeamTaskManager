import { Button } from "./ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { DeleteDialog } from "./delete-dialog";
import { useState } from "react";
import { Input } from "./ui/input";
import { Edit2Icon } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";


export function ProfileSheet({children, open, onOpenChange}) {
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [editName, setEditName] = useState(false);
  const { user, deleteUser } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [deletingUser, setDeletingUser] = useState(false);
  const [ internalOpen, setInternalOpen ] = useState(false)
  const isOpen = open ? open : internalOpen
  const setOpen = (nextOpen) => {
    if (!open) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  function handleSubmit(event) {
    event.preventDefault()
    // const formData = new FormData(event.target)
    const button = event.nativeEvent.submitter
    if (button.value === "saveName") {
        // TODO: update display name
    //   updateUser({name: formData.get("display-name")})
      setEditName(false);
    }
  }

  return (
    <>    
        <Sheet open={isOpen} onOpenChange={(open) => {setOpen(open); if (!open) setEditName(false);}}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>

            <SheetContent className="sm:max-w-lg">
                <SheetHeader>
                <SheetTitle>Profile Settings</SheetTitle>
                <SheetDescription>
                    Manage your profile settings.
                </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="grid flex-1 auto-rows-min gap-6 px-4">
                    <section>
                        <h3 className="mb-4 text-sm font-medium">
                            Display Name
                        </h3>
                        {/* Input / Select / Switch, etc. */}
                        <div className="flex items-center gap-2">
                            <Input name="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} disabled={!editName} />
                            {!editName &&
                                <Button variant="outline" onClick={() => setEditName(true)}>
                                    <Edit2Icon />
                                </Button>
                            }
                            {editName &&
                                <>
                                    <Button type="submit" name="action" value="saveName">
                                        Save
                                    </Button>
                                    <Button variant="outline" onClick={() => {setDisplayName(user.displayName); setEditName(false);}}>
                                        Cancel
                                    </Button>
                                </>
                            }
                        </div>
                    </section>
                    <Separator />
                    <section>
                        <h3 className="mb-4 text-sm font-medium">
                            Preferences
                        </h3>

                        {/* More settings */}
                    </section>
                    <Separator />
                    <section>
                        <h3 className="mb-4 text-sm font-medium text-destructive">
                            Danger Zone
                        </h3>
                        <Button variant="destructive" onClick={() => setDeleteUserDialogOpen(true)}>
                            Delete Account
                        </Button>
                    </section>
                </form>
            </SheetContent>
        </Sheet>
        <DeleteDialog
            open={deleteUserDialogOpen}
            onOpenChange={setDeleteUserDialogOpen}
            title="Delete Account"
            description="Are you sure you want to delete your account? This action cannot be undone."
            handleSubmit={async (e) => {
                e.preventDefault();
                setDeletingUser(true)
                deleteUser();
            }}
            isLoading={deletingUser}
        />
    </>
  )
}