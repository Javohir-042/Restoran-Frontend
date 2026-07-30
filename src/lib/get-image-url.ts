export const getImageUrl = (path?: string | null) => {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  const baseUrl = import.meta.env.VITE_BASE_URL?.replace("/api/v1", "") || "http://localhost:3000";
  return `${baseUrl}${path}`;
};