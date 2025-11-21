'use client';

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

type TestSubjectsProps = {
    readonly subjects?: Subject[];
    readonly handleAdd: (subject: Subject) => void;
    readonly handleDelete: (subject: Subject) => void;
    readonly className?: string;
}

export default function TestSubjects({ subjects, handleAdd, handleDelete, className }: TestSubjectsProps) {
    const [search, setSearch] = useState('');
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>(subjects || []);

    const fetchSubjects = async (query: string) => {
        setLoading(true);
        try {
            const res = await axios.get<APIResponse<Subject[]>>(`/api/subjects`, {
                params: { search: query }
            });
            const data = res.data.data;
            const filtered = data.filter(subject => !subjects?.some(s => s.id === subject.id));
            setFilteredSubjects(filtered);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        fetchSubjects(e.target.value);
    };

    return (
        <Card className={`shadow-none border-neutral-200 dark:border-neutral-700 h-full ${className}`}>
            <CardHeader className="">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">教科</CardTitle>
                    <span className="text-sm text-muted-foreground">{subjects?.length || 0}件</span>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        ref={inputRef}
                        placeholder="教科を検索..."
                        className="pl-10 shadow-none rounded-sm"
                        value={search}
                        onChange={handleInputChange}
                        onFocus={() => {
                            setFocused(true);
                            fetchSubjects(search); 
                        }}
                        onBlur={() => setTimeout(() => setFocused(false), 200)}
                    />
                    {focused && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-sm shadow-lg max-h-60 overflow-auto z-50">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />
                                </div>
                            ) : filteredSubjects.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-muted-foreground text-center">候補がありません</div>
                            ) : (
                                <div className="py-1">
                                    {filteredSubjects.map(subject => (
                                        <button
                                            key={subject.id}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left"
                                            onClick={() => {
                                                handleAdd(subject);
                                                setFocused(false);
                                                setSearch('');
                                            }}
                                        >
                                            <span
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: subject.color ?? "#000" }}
                                            />
                                            <span className="text-sm font-medium">{subject.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {!subjects || subjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium mb-1">教科がありません</p>
                        <p className="text-xs text-muted-foreground">教科を追加して管理を始めましょう</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                        {subjects.map((subject) => (
                            <div
                                key={subject.id}
                                className="group flex items-center gap-3 p-3 rounded-sm border border-neutral-200 dark:border-neutral-700 hover:border-teal-500 dark:hover:border-teal-500 transition-colors"
                            >
                                <span
                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: subject.color ?? "#000" }}
                                />
                                <span className="text-sm font-medium flex-1 truncate">
                                    {subject.name}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(subject);
                                    }}
                                    className="h-7 w-7 p-0 transition-opacity"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}