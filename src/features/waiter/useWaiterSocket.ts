import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
const SOCKET_URL = API_BASE.replace("/api/v1", "");

export const useWaiterSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const queryClient = useQueryClient();
    const socketRef = useRef<Socket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audioRef.current) {
            const audio = new Audio("/ding.mp3");
            const fallbackDing = "data:audio/wav;base64,AAA"; // Simplified fallback for brevity
            audio.onerror = () => { audio.src = fallbackDing; };
            audioRef.current = audio;
        }

        const socket = io(`${SOCKET_URL}/order-item`, {
            autoConnect: false,
            transports: ["websocket", "polling"],
        });

        socketRef.current = socket;
        socket.connect();

        socket.on("connect", () => {
            setIsConnected(true);
            socket.emit("join", "waiter");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        // Triggered when kitchen marks item as READY
        socket.on("item-ready", (payload: { billId?: string }) => {
            audioRef.current?.play().catch(() => { });

            // Explicitly invalidate targeted query or fallback to generalized invalidation
            if (payload?.billId) {
                queryClient.invalidateQueries({ queryKey: ["bill-items", payload.billId] });
            } else {
                queryClient.invalidateQueries({ queryKey: ["bill-items"] });
            }
            queryClient.invalidateQueries({ queryKey: ["ready-items"] });

            toast.info("Bir nechta taom tayyor bo'ldi! 🔔", { duration: 5000 });
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("item-ready");
            socket.disconnect();
        };
    }, [queryClient]);

    return { isConnected, socket: socketRef.current };
};
