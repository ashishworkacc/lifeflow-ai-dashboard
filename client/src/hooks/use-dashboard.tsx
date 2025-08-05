import { useQuery } from "@tanstack/react-query";

export function useDashboard() {
  return useQuery({
    queryKey: ["/api/dashboard"],
    staleTime: 30000, // 30 seconds
  });
}
