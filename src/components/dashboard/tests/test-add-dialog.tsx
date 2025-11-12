import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, CalendarIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner"
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type TestAddDialogProps = {
    onAdd: () => void
}

export default function TestAddDialog({ onAdd }: TestAddDialogProps) {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false); 

    const validate = () => {
        if (name.trim() === "") {
            toast.error("テスト名を入力してください");
            return false;
        }
        if (!startDate) {
            toast.error("開始日を選択してください");
            return false;
        }
        if (!endDate) {
            toast.error("終了日を選択してください");
            return false;
        }
        if (startDate > endDate) {
            toast.error("開始日は終了日より前にしてください");
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await axios.post("/api/tests", {
                name,
                startDate: startDate?.toISOString(),
                endDate: endDate?.toISOString()
            });
            setName("");
            setStartDate(undefined);
            setEndDate(undefined);
            toast.success("テストを作成しました");
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
                    <DialogTitle>テストを追加</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="テスト名を入力"
                            className="w-full shadow-none border-none pl-0 text-xl font-semibold focus:outline-none focus:ring-0"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-gray-600" htmlFor="startDate">開始日</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={"w-full justify-start text-left font-normal"}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "yyyy-MM-dd") : <span className="text-gray-400">日付を選択</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 text-sm text-gray-600" htmlFor="endDate">終了日</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={"w-full justify-start text-left font-normal"}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "yyyy-MM-dd") : <span className="text-gray-400">日付を選択</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
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