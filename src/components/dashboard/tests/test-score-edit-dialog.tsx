import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TestScoreEditDialogProps = {
    score: Score;
    onEdit: (updatedScore: Score) => void;
};

export default function TestScoreEditDialog({ score, onEdit }: TestScoreEditDialogProps) {
    const [value, setValue] = useState<number>(score.value ?? 0);

    const handleSave = () => {  
        onEdit({ ...score, value });
    };

    return (
        <div>
            <h3 className="font-semibold mb-2">{score.subject?.name ?? "教科未設定"}</h3>
            <div className="mb-4">
                <label className="block text-sm mb-1">点数</label>
                <Input
                    type="number"
                    value={value}
                    min={0}
                    max={score.maxValue ?? 100}
                    onChange={e => setValue(Number(e.target.value))}
                />
            </div>
            <div className="flex gap-2 justify-end">
                <Button onClick={handleSave}>
                    保存
                </Button>
            </div>
        </div>
    );
}