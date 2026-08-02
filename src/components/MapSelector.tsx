import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, LocateFixed, Loader2 } from "lucide-react";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
import { toast } from "sonner";

// Fix for default Leaflet marker icons in React/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});

interface MapSelectorProps {
    latitude: number | null;
    longitude: number | null;
    onChange: (lat: number, lng: number) => void;
}

const LocationMarker = ({ position, setPosition }: { position: L.LatLng | null; setPosition: (p: L.LatLng) => void }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
                Bizning manzil
            </Tooltip>
        </Marker>
    );
};

const MapController = ({ center }: { center: L.LatLng | null }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { duration: 1.5 });
        }
    }, [center, map]);
    return null;
};

export const MapSelector = ({ latitude, longitude, onChange }: MapSelectorProps) => {
    const defaultCenter: L.LatLngTuple = [41.2995, 69.2401]; // Tashkent default
    const [position, setPosition] = useState<L.LatLng | null>(
        latitude && longitude ? new L.LatLng(latitude, longitude) : null
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<{ lat: number, lon: number, display_name: string }[]>([]);

    const handleSetPosition = useCallback((p: L.LatLng) => {
        setPosition(p);
        onChange(p.lat, p.lng);
    }, [onChange]);

    useEffect(() => {
        if (latitude && longitude && (!position || position.lat !== latitude || position.lng !== longitude)) {
            setPosition(new L.LatLng(latitude, longitude));
        }
    }, [latitude, longitude]);

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Added bias for Uzbekistan to improve local searches like "Chilonzor 2"
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=uz`);
            const data = await res.json();

            if (data && data.length > 0) {
                setSearchResults(data);
            } else {
                toast.error("Bunday joy topilmadi");
                setSearchResults([]);
            }
        } catch (error) {
            toast.error("Qidiruvda xatolik yuz berdi");
        } finally {
            setIsSearching(false);
        }
    };

    const selectResult = (result: { lat: number, lon: number, display_name: string }) => {
        const p = new L.LatLng(result.lat, result.lon);
        handleSetPosition(p);
        setSearchResults([]);
        setSearchQuery("");
    };

    const getMyLoc = () => {
        if ("geolocation" in navigator) {
            toast.info("Lokatsiya aniqlanmoqda...");
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const p = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
                    handleSetPosition(p);
                    toast.success("Lokatsiyangiz aniqlandi!");
                },
                () => toast.error("Lokatsiyangizni bilishga ruxsat etilmadi!")
            );
        } else {
            toast.error("Brauzeringiz qidirishga xizmat qilmaydi");
        }
    };

    return (
        <div className="h-full w-full relative rounded-xl overflow-hidden border border-gray-200 z-10 shrink-0 flex flex-col">
            {/* Top Search Bar with isolated DOM events so Map doesn't swallow clicks */}
            <div
                className="absolute top-3 left-14 right-3 z-[999] flex flex-col gap-1 max-w-[300px]"
                onMouseDown={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
                onDoubleClick={e => e.stopPropagation()}
                onWheel={e => e.stopPropagation()}
            >
                <div className="flex gap-2">
                    <form onSubmit={handleSearch} className="flex-1 bg-white rounded-lg shadow-md border border-gray-200 flex items-center px-2 py-1.5 focus-within:ring-2 focus-within:ring-blue-500">
                        <input
                            type="text"
                            placeholder="Joyni qidirish..."
                            className="flex-1 min-w-0 bg-transparent px-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" disabled={isSearching} className="p-1.5 text-gray-400 hover:text-blue-600 cursor-pointer disabled:opacity-50">
                            {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                        </button>
                    </form>
                    <button type="button" onClick={getMyLoc} title="Mening lokatsiyam" className="bg-white p-2.5 rounded-lg shadow-md border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer">
                        <LocateFixed size={18} />
                    </button>
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="bg-white mt-1 rounded-lg shadow-lg border border-gray-100 max-h-40 overflow-y-auto w-full mr-11">
                        {searchResults.map((res, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => selectResult(res)}
                                className="w-full text-left px-3 py-2 text-xs border-b border-gray-50 hover:bg-blue-50 hover:text-blue-700 last:border-0 truncate cursor-pointer transition-colors"
                                title={res.display_name}
                            >
                                {res.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <MapContainer
                center={position ? [position.lat, position.lng] : defaultCenter}
                zoom={position ? 15 : 12}
                scrollWheelZoom={true}
                style={{ flex: 1, width: "100%", zIndex: 1, height: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={position} setPosition={handleSetPosition} />
                <MapController center={position} />
            </MapContainer>
        </div>
    );
};
