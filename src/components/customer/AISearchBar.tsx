import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useAskAI } from "@/features/customer/useCustomerAI";
import type { IMenuItem } from "@/features/customer/types";

export const AISearchBar = ({ onResult }: { onResult: (reply: string, items: IMenuItem[]) => void }) => {
    const [message, setMessage] = useState("");
    const askAI = useAskAI();

    const handleAsk = () => {
        if (!message.trim() || askAI.isPending) return;
        askAI.mutate(message, {
            onSuccess: (res) => {
                onResult(res.reply, res.items);
                setMessage("");
            },
        });
    };

    return (
        <div className="px-4 py-3">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity duration-500"></div>
                <div className="relative flex items-center bg-white border border-blue-50 rounded-2xl shadow-sm overflow-hidden p-1.5 pl-4">
                    <Sparkles className="text-blue-500 shrink-0" size={18} />
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                        placeholder="AI yordamida qidiring (masalan: Go'shtli ovqatlar)"
                        className="w-full px-3 py-2 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none font-medium"
                        disabled={askAI.isPending}
                    />
                    <button
                        onClick={handleAsk}
                        disabled={!message.trim() || askAI.isPending}
                        className="w-10 h-10 shrink-0 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 disabled:opacity-50 transition-colors"
                    >
                        {askAI.isPending ? (
                            <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <ArrowRight size={18} />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
