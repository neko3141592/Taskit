'use client';

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2, X } from "lucide-react";
import axios from "axios";

type TestSubjectsProps = {
    subjects?: Subject[];
    handleAdd: (subject: Subject) => void;
    handleDelete: (subject: Subject) => void;
    className?: string;
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
        <div className={`bg-white dark:bg-neutral-900 border border-gray-900/10 dark:border-neutral-700 rounded-sm ${className}`}>
            <div className="px-6 py-4 border-b border-gray-900/5 dark:border-neutral-800">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">教科</h2>
            </div>

            <div className="px-6 py-4 ">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-neutral-400" />
                    <Input
                        ref={inputRef}
                        placeholder="教科を追加..."
                        className="w-full pl-10 bg-white dark:bg-neutral-800 border-gray-900/10 dark:border-neutral-700 rounded-sm shadow-none transition-all"
                        value={search}
                        onChange={handleInputChange}
                        onFocus={() => {
                            setFocused(true);
                            fetchSubjects(search); 
                        }}
                        onBlur={() => setTimeout(() => setFocused(false), 150)}
                    />
                    {focused && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-900 border border-gray-900/10 dark:border-neutral-700 max-w-xs rounded-sm max-h-48 overflow-auto z-20">
                            {loading ? (
                                <div className="flex items-center justify-center px-4 py-8">
                                    <Loader2 className="h-5 w-5 text-gray-400 dark:text-neutral-400 animate-spin" />
                                </div>
                            ) : filteredSubjects.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-400 dark:text-neutral-400">候補がありません</div>
                            ) : (
                                filteredSubjects.map(subject => (
                                    <div
                                        key={subject.id}
                                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors border-b border-gray-900/5 dark:border-neutral-800 last:border-0"
                                        onClick={() => {
                                            handleAdd(subject);
                                            setFocused(false);
                                            setSearch('');
                                        }}
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: subject.color ?? "#000" }}
                                        />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {!subjects || subjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className="w-12 h-12 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-gray-400 dark:text-neutral-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">教科がありません</p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">教科を追加してテストを管理しましょう</p>
                </div>
            ) : (
                <div className="px-6 py-2 min-h-[200px]  overflow-y-auto">
                    <div className="space-y-0.5">
                        {subjects.map((subject, idx) => (
                            <div
                                key={subject.id}
                                className="group flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-sm transition-colors"
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ backgroundColor: subject.color ?? "#000" }}
                                />
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                                    {subject.name}
                                </h4>
                                <span className="text-xs text-gray-400 dark:text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    #{idx + 1}
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(subject);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded"
                                    aria-label="削除"
                                >
                                    <X className="h-4 w-4 text-gray-500 dark:text-neutral-400" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}