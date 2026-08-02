import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Change this based on your environment
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
// Extract just the host for websocket if needed, or io() will figure it out if it's full URL 
// Usually, we pass the base URL if the namespace is /order-item:
const SOCKET_URL = API_BASE.replace("/api/v1", "");

export const useKitchenSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const queryClient = useQueryClient();
    const socketRef = useRef<Socket | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element for the ding sound if it doesn't exist
        if (!audioRef.current) {
            const audio = new Audio("/ding.mp3"); // Ensure this file exists in /public or we fallback
            // fallback generic base64 short ding so it works out of the box
            const fallbackDing = "data:audio/wav;base64,UklGRnoTAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YVgTAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAhICbgIiLjo+QkpOUlZaYmZqbnJ2en6ChoqOkpaanqKmqqaqqqaqpqKenpaOioaOenZybmpeWlZSUkJCPjo6LioqIh4eGhYSDg4KBgIB/fn18e3t6eXl4d3d3dnd2dXZ1dXV1dXR0dHR0dHR0dHR1dXV1dnZ2d3d4eHl6e3x8fX9+f4CAgIGCg4ODg4SEhISFhoWGiIiHiIqKioqJiIiIh4eGhoaGhYWFhYWFhYWGhoaHh4iIiImJiYqKioqKioqKioqKioqKiYmJiYiH"; // extremely short fragment just for illustration, real usage relies on /ding.mp3 in public
            audio.src = "/ding.mp3";
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
            socket.emit("join", "kitchen");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("new-order", () => {
            // Play sound
            audioRef.current?.play().catch(console.error);
            // Invalidate queries
            queryClient.invalidateQueries({ queryKey: ["kitchen-queue"] });
            toast.info("Yangi buyurtma keldi!");
        });

        socket.on("status-changed", () => {
            queryClient.invalidateQueries({ queryKey: ["kitchen-queue"] });
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("new-order");
            socket.off("status-changed");
            socket.disconnect();
        };
    }, [queryClient]);

    return { isConnected, socket: socketRef.current };
};
