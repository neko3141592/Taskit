'use client'

import { useState } from "react";
import { CalendarIcon, CheckIcon, Clock, ListTodo , Plus, Paintbrush} from "lucide-react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { useFirebaseUser } from "@/hooks/use-firebase-user";
import { useSubject } from "@/hooks/use-subject";


export default function CreateTaskModal() {
    const user = useFirebaseUser();
    const { subjects } = useSubject(user?.uid);

    console.log("Subjects in CreateTaskModal:", subjects);

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "NOT_STARTED",
        subjectId: "",
        dueDate: undefined as Date | undefined,
    });
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // タグ追加
    const handleAddTag = () => {
        const value = tagInput.trim();
        if (value && !tags.includes(value)) {
            setTags([...tags, value]);
            setTagInput("");
        }
    };

    // タグ削除
    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            // タイトルが空の場合は送信しない
            return;
        }
        
        setIsLoading(true);
            try {
                // APIを呼び出してタスクを作成
                // const response = await axios.post('/api/tasks', {
                //   ...formData,
                //   tags,
                //   userId: user?.uid,
                //   dueDate: formData.dueDate?.toISOString(),
                // });

                setFormData({
                    title: "",
                    description: "",
                    status: "NOT_STARTED",
                    subjectId: "",
                    dueDate: undefined,
                });
                setTags([]);
            
            } catch (error) {
            
            } finally {
                setIsLoading(false);
            }
    };

    return (
        <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
            <ListTodo className="h-6 w-6" />
                新規タスク
            </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
            <input
                id="title"
                placeholder="タイトルを入力"
                value={formData.title ?? ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full text-2xl font-bold focus:outline-none focus:ring-0"
                required
            />
            </div>
            
            <div className="space-y-2">
                <textarea
                    id="description"
                    placeholder="説明を入力..."
                    value={formData.description}
                    onChange={e => handleChange("description", e.target.value)}
                    className="min-h-[50px] pl-0 border-none w-full resize-none focus:ring-0 focus:outline-none"
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium">タグ</Label>
                <div className="flex gap-2">
                    <Input
                        id="tags"
                        type="text"
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                        placeholder="タグを追加"
                        onKeyDown={e => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                    />
                    <Button
                        type="button"
                        onClick={handleAddTag}
                        disabled={!tagInput.trim()}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        onClick={handleAddTag}
                        className="bg-teal-500 hover:bg-teal-600 "
                    >
                        <Paintbrush className="h-4 w-4 text-white" />
                    </Button>
                </div>
                {/* タグリスト表示 */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                        <span key={tag} className="bg-teal-100 text-teal-700 px-2 py-1 rounded-sm flex items-center gap-1 text-xs">
                            {tag}
                            <button
                                type="button"
                                className="ml-1 text-teal-500"
                                onClick={() => handleRemoveTag(tag)}
                                aria-label="タグ削除"
                            >×</button>
                        </span>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium">
                教科
                </Label>
                <Select 
                value={formData.subjectId} 
                onValueChange={(value) => handleChange("subjectId", value)}
                >
                <SelectTrigger>
                    <SelectValue placeholder="教科を選択" />
                </SelectTrigger>
                <SelectContent>
                    {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                        <div className="flex items-center">
                        <div 
                            className="h-3 w-3 rounded-full mr-2" 
                            style={{ backgroundColor: subject.color }} 
                        />
                        {subject.name}
                        </div>
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                ステータス
                </Label>
                <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange("status", value)}
                >
                <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="NOT_STARTED">未着手</SelectItem>
                    <SelectItem value="IN_PROGRESS">進行中</SelectItem>
                    <SelectItem value="COMPLETED">完了</SelectItem>
                </SelectContent>
                </Select>
            </div>
            </div>
            
            <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
                期限
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                    format(formData.dueDate, "PPP", { locale: ja })
                    ) : (
                    <span>期限を選択</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => handleChange("dueDate", date)}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            </div>
            
            <DialogFooter className="pt-4">
            <DialogClose asChild>
                <Button variant="outline" type="button">
                キャンセル
                </Button>
            </DialogClose>
            <Button 
                type="submit" 
                className="gap-2"
                disabled={isLoading}
            >
                {isLoading ? (
                <>
                    <Clock className="h-4 w-4 animate-spin" />
                    作成中...
                </>
                ) : (
                <>
                    <CheckIcon className="h-4 w-4" />
                    作成
                </>
                )}
            </Button>
            </DialogFooter>
        </form>
        </DialogContent>
    );
}