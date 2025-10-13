import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner"
import { useFirebaseUser } from "@/hooks/use-firebase-user";

const COLORS = [
    "#ff0000", "#ff4d4d", "#ff8080", "#ffb3b3",
    "#ff8000", "#ffa64d", "#ffbf80", "#ffd9b3",
    "#ffff00", "#ffff4d", "#ffff80", "#ffffb3",
    "#b3ff66", "#80ff00", "#4dff4d", "#00ff00",
    "#00ff80", "#00ffbf", "#00ffff", "#4dffff",
    "#80e1ff", "#4da6ff", "#0080ff", "#0055ff",
    "#0000ff", "#4d4dff", "#8080ff", "#b3b3ff",
    "#8000ff", "#a64dff", "#bf80ff", "#d9b3ff",
    "#ff00ff", "#ff4da6", "#ff80bf", "#ffb3d9",
    "#795548", "#bdbdbd", "#757575", "#607d8b",
    "#000000", "#ffffff",
];

type SubjectAddDialogProps = {
    onAdd: () => void
}

export default function SubjectAddDialog({ onAdd }: SubjectAddDialogProps) {

    const user = useFirebaseUser();
    const [name, setName] = useState("");
    const [color, setColor] = useState(COLORS[0]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); // 追加

    const validate = () => {
        if (name.trim() === "") {
            toast.error("教科名を入力してください");
            return false;
        }
        return true;
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;
        if (!user) {
            toast.error("作成に失敗しました");
            return;
        }

        setLoading(true);
        try {
            await axios.post("/api/subjects", 
                { name, color },
                { headers: { "Authorization": `Bearer ${await user.getIdToken()}` } }
            );
            setName("");
            setColor(COLORS[0]);
            toast.success("教科を作成しました");
            onAdd();
            setOpen(false); 
        } catch (error) {
            toast.error("作成に失敗しました");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="shadow-none border-none bg-black text-white hover:bg-gray-800 hover:text-white rounded-full"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>教科を追加</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="教科名を入力"
                            className="w-full shadow-none border-none pl-0 text-xl font-semibold focus:outline-none focus:ring-0"
                        />
                    </div>
                    <div>
                        <div className="flex gap-2 flex-wrap mt-2">
                            {COLORS.map((c) => (
                                <button
                                    type="button"
                                    key={c}
                                    className={`w-8 h-8 rounded-full border-2 ${color === c ? "border-black" : "border-transparent"}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setColor(c)}
                                    aria-label={`色: ${c}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? "作成中..." : "作成"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
