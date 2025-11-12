'use client';

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import axios from "axios";

type TestSubjectsProps = {
    subjects?: Subject[];
}

export default function TestSubjects({ subjects }: TestSubjectsProps) {
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(subjects || []);
    if (!subjects || subjects.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center h-[280px] bg-white border border-gray-900/10 rounded-sm">
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-900">科目がありません</p>
                <p className="text-xs text-gray-500 mt-1">科目を追加してテストを管理しましょう</p>
            </Card>
        );
    }

    const fetchSubjects = async (query: string) => {
        setLoading(true);
        try {
            // ダミーの遅延を追加
            await new Promise((resolve) => setTimeout(resolve, 500));
            // 実際のAPI呼び出しはここで行う
            const res = await axios.get<APIResponse<Subject[]>>(`/api/subjects`, {
                params: { search: query }
            });
            setFilteredSubjects(res.data.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    }


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div className="bg-white border border-gray-900/10 rounded-sm">
            {/* ヘッダー */}
            <div className="px-6 py-4 border-b border-gray-900/5">
                <h2 className="text-base font-semibold text-gray-900 tracking-tight">登録済みの科目</h2>
            </div>

            {/* 検索入力 */}
            <div className="px-6 py-4 bg-gray-50/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        ref={inputRef}
                        placeholder="科目を追加..."
                        className="w-full pl-10 bg-white border-gray-900/10 rounded-sm shadow-none transition-all"
                        value={search}
                        onChange={handleInputChange}
                        onFocus={() => {
                            setFocused(true);
                            fetchSubjects(search); 
                        }}
                        onBlur={() => setTimeout(() => setFocused(false), 1)}
                    />
                    {focused  && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-900/10 rounded-sm max-h-48 overflow-auto z-20">
                            {filteredSubjects.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-400">候補がありません</div>
                            ) : (
                                filteredSubjects.map(subject => (
                                    <div
                                        key={subject.id}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-900/5 last:border-0"
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: subject.color ?? "#000" }}
                                        />
                                        <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 科目リスト */}
            <div className="px-6 py-2 max-h-[340px] overflow-y-auto">
                <div className="space-y-0.5">
                    {subjects.map((subject, idx) => (
                        <div
                            key={subject.id}
                            className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-sm cursor-pointer transition-colors"
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: subject.color ?? "#000" }}
                            />
                            <h4 className="text-sm font-medium text-gray-900 truncate flex-1">
                                {subject.name}
                            </h4>
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                #{idx + 1}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}