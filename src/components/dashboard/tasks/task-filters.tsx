'use client';

import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SlidersHorizontal } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type TaskFiltersType = {
    status: string;
    subjectId: string;
    tagId: string;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
};

type TaskFiltersProps = {
    subjects: Subject[];
    tags: Tag[];
    filters: TaskFiltersType;
    onFilterChange: (filters: TaskFiltersType) => void;
    onReset: () => void;
};

export default function TaskFilters({ subjects, tags, filters, onFilterChange, onReset }: TaskFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleChange = (key: string, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const hasActiveFilters = filters.status !== 'all' || filters.subjectId !== 'all' || filters.tagId !== 'all' || filters.search !== '';

    // 選択中の教科を取得
    const selectedSubject = subjects.find(s => s.id === filters.subjectId);

    return (
        <div className="space-y-0 ">
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 shadow-none overflow-hidden">
                <div className="hidden md:flex items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                        <Input
                            placeholder="タスクを検索..."
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                            className="pl-11 pr-4 py-6 border-0 dark:bg-neutral-900 dark:text-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div className="flex items-center gap-2 pr-3">
                        <Select value={filters.status} onValueChange={(value) => handleChange('status', value)}>
                            <SelectTrigger className="w-[120px] h-9 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white shadow-none rounded-lg text-sm">
                                <SelectValue placeholder="すべて" />
                            </SelectTrigger>
                            <SelectContent className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                                <SelectItem value="all">すべて</SelectItem>
                                <SelectItem value="NOT_STARTED">未着手</SelectItem>
                                <SelectItem value="IN_PROGRESS">進行中</SelectItem>
                                <SelectItem value="COMPLETED">完了</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* 教科セレクト */}
                        <Select value={filters.subjectId} onValueChange={(value) => handleChange('subjectId', value)}>
                            <SelectTrigger className="w-[120px] h-9 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white shadow-none rounded-lg text-sm">
                                {selectedSubject ? (
                                    <div className="flex items-center gap-2 overflow-hidden w-full">
                                        <div
                                            className="h-3 w-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: selectedSubject.color }}
                                        />
                                        <span className="truncate">{selectedSubject.name}</span>
                                    </div>
                                ) : (
                                    <SelectValue placeholder="すべて" />
                                )}
                            </SelectTrigger>
                            <SelectContent className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                                <SelectItem value="all">すべて</SelectItem>
                                {subjects.map((subject) => (
                                    <SelectItem key={subject.id} value={subject.id}>
                                        <div className="flex items-center gap-2 max-w-full">
                                            <div
                                                className="h-3 w-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: subject.color }}
                                            />
                                            <span className="truncate">{subject.name}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* タグセレクト */}
                        <Select value={filters.tagId} onValueChange={(value) => handleChange('tagId', value)}>
                            <SelectTrigger className="w-[120px] h-9 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white shadow-none rounded-lg text-sm">
                                <SelectValue placeholder="すべて" />
                            </SelectTrigger>
                            <SelectContent className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                                <SelectItem value="all">すべて</SelectItem>
                                {tags.map((tag) => (
                                    <SelectItem key={tag.id} value={tag.id}>
                                        {tag.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* 並び替えセレクト */}
                        <Select value={filters.sortBy} onValueChange={(value) => handleChange('sortBy', value)}>
                            <SelectTrigger className="w-[100px] h-9 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white shadow-none rounded-lg text-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                                <SelectItem value="dueDate">期限日</SelectItem>
                                <SelectItem value="createdAt">作成日</SelectItem>
                                <SelectItem value="title">タイトル</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* リセットボタン */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onReset}
                                className="h-9 w-9 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* モバイル表示 */}
                <div className="md:hidden flex items-center p-3">
                    {/* 検索バー */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-neutral-500" />
                        <Input
                            placeholder="タスクを検索..."
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                            className="h-9 pl-10 pr-4 border-0 dark:bg-neutral-900 dark:text-white shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>

                    {/* フィルターポップオーバー */}
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-9 w-9 relative"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                {hasActiveFilters && (
                                    <span className="absolute top-1 right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                            className="w-[280px] p-4 border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900"
                            align="end"
                        >
                            <div className="space-y-4">
                                <div className="font-semibold text-sm text-gray-900 dark:text-white">フィルター</div>
                                
                                {/* ステータス */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600 dark:text-neutral-400">ステータス</label>
                                    <Select value={filters.status} onValueChange={(value) => handleChange('status', value)}>
                                        <SelectTrigger className="h-9 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white shadow-none rounded-lg text-sm">
                                            <SelectValue placeholder="すべて" />
                                        </SelectTrigger>
                                        <SelectContent className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                                            <SelectItem value="all">すべて</SelectItem>
                                            <SelectItem value="NOT_STARTED">未着手</SelectItem>
                                            <SelectItem value="IN_PROGRESS">進行中</SelectItem>
                                            <SelectItem value="COMPLETED">完了</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 教科 */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600 dark:text-neutral-400">教科</label>
                                    <Select value={filters.subjectId} onValueChange={(value) => handleChange('subjectId', value)}>
                                        <SelectTrigger className="h-9 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white shadow-none rounded-lg text-sm">
                                            {selectedSubject ? (
                                                <div className="flex items-center gap-2 overflow-hidden w-full">
                                                    <div
                                                        className="h-3 w-3 rounded-full flex-shrink-0"
                                                        style={{ backgroundColor: selectedSubject.color }}
                                                    />
                                                    <span className="truncate">{selectedSubject.name}</span>
                                                </div>
                                            ) : (
                                                <SelectValue placeholder="すべて" />
                                            )}
                                        </SelectTrigger>
                                        <SelectContent className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                                            <SelectItem value="all">すべて</SelectItem>
                                            {subjects.map((subject) => (
                                                <SelectItem key={subject.id} value={subject.id}>
                                                    <div className="flex items-center gap-2 max-w-full">
                                                        <div
                                                            className="h-3 w-3 rounded-full flex-shrink-0"
                                                            style={{ backgroundColor: subject.color }}
                                                        />
                                                        <span className="truncate">{subject.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* タグ */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600 dark:text-neutral-400">タグ</label>
                                    <Select value={filters.tagId} onValueChange={(value) => handleChange('tagId', value)}>
                                        <SelectTrigger className="h-9 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white shadow-none rounded-lg text-sm">
                                            <SelectValue placeholder="すべて" />
                                        </SelectTrigger>
                                        <SelectContent className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                                            <SelectItem value="all">すべて</SelectItem>
                                            {tags.map((tag) => (
                                                <SelectItem key={tag.id} value={tag.id}>
                                                    {tag.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* 並び替え */}
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600 dark:text-neutral-400">並び替え</label>
                                    <Select value={filters.sortBy} onValueChange={(value) => handleChange('sortBy', value)}>
                                        <SelectTrigger className="h-9 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white shadow-none rounded-lg text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                                            <SelectItem value="dueDate">期限日</SelectItem>
                                            <SelectItem value="createdAt">作成日</SelectItem>
                                            <SelectItem value="title">タイトル</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* リセットボタン */}
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            onReset();
                                            setIsOpen(false);
                                        }}
                                        className="h-9 w-full gap-2 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-lg text-sm"
                                    >
                                        <X className="h-4 w-4" />
                                        リセット
                                    </Button>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}
