import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-hot-toast";

export default function useInfiniteScroll(fetchFunction, limit = 10) {
  const [allData, setAllData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [visibleCount, setVisibleCount] = useState(limit);
  const observer = useRef();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setVisibleData(allData.slice(0, visibleCount));
  }, [visibleCount, allData]);

  const loadData = async () => {
    try {
      const res = await fetchFunction();
      setAllData(res);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  const lastElementRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + limit);
      }
    });

    if (node) observer.current.observe(node);
  }, [limit]);

  return { visibleData, lastElementRef, reload: loadData };
}