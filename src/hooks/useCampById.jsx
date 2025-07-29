// hooks/useCampById.js
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useCampById = (campId) => {
  const axiosSecure = useAxiosSecure();

  return useQuery({
    queryKey: ["camp", campId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/camps/${campId}`);
      return res.data?.camp;
    },
    enabled: !!campId,
    staleTime: 5 * 60 * 1000,
  });
};

export default useCampById;
