import { Loader2 } from "lucide-react";

export default function Spinner({ size = 32, className = "" }: { size?: number; className?: string }) {
    return (
        <div className={`flex justify-center items-center h-full ${className}`}>
            <Loader2 className={`animate-spin text-gray-400`} style={{ width: size, height: size }} />
        </div>
    );
}