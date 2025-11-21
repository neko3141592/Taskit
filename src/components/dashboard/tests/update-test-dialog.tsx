'use client';

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

type UpdateTestDialogProps = {
    readonly test: Test;
    readonly onClose?: () => void;
};

export default function UpdateTestDialog({ test, onClose }: UpdateTestDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: test.name,
        description: test.description ?? "",
        startDate: new Date(test.startDate),
        endDate: new Date(test.endDate),
    });

    const handleChange = (field: string, value: string | Date) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("テスト名を入力してください");
            return false;
        }
        if (formData.startDate >= formData.endDate) {
            toast.error("終了日は開始日より後に設定してください");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await axios.patch(`/api/tests/${test.id}`, {
                ...formData,
                startDate: formData.startDate.toISOString(),
                endDate: formData.endDate.toISOString(),
            });
            toast.success("テストを更新しました");
            onClose?.();
            router.refresh();
        } catch (error) {
            console.error("テストの更新中にエラーが発生しました:", error);
            toast.error("テストの更新に失敗しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                    テスト名 <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="name"
                    placeholder="中間テスト"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="rounded-sm shadow-none"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                    説明
                </Label>
                <Textarea
                    id="description"
                    placeholder="テストの詳細を入力..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className="min-h-[100px] rounded-sm shadow-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        開始日 <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal rounded-sm shadow-none",
                                    !formData.startDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.startDate ? (
                                    format(formData.startDate, "PPP", { locale: ja })
                                ) : (
                                    <span>日付を選択</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-sm" align="start">
                            <Calendar
                                mode="single"
                                selected={formData.startDate}
                                onSelect={(date) => date && handleChange("startDate", date)}
                                locale={ja}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        終了日 <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal rounded-sm shadow-none",
                                    !formData.endDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.endDate ? (
                                    format(formData.endDate, "PPP", { locale: ja })
                                ) : (
                                    <span>日付を選択</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-sm" align="start">
                            <Calendar
                                mode="single"
                                selected={formData.endDate}
                                onSelect={(date) => date && handleChange("endDate", date)}
                                locale={ja}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="rounded-sm shadow-none"
                >
                    キャンセル
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-sm shadow-none"
                >
                    {isLoading ? "更新中..." : "更新"}
                </Button>
            </div>
        </form>
    );
}
