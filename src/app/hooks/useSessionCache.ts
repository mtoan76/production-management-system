import { useState, useEffect, useRef } from "react";

// ─── Module-level cache cho tất cả các màn hình ──────────────────────────────
// Cache nằm trong RAM, tự động bị xóa khi:
//   - F5/reload trang (memory reset)
//   - Đóng tab và mở tab mới (memory reset trong session mới)
// → Đảm bảo F5/phiên mới luôn fetch lại API
//
// Trong cùng 1 phiên làm việc (không F5), cache giữ nguyên →
// user chuyển qua lại giữa các màn hình không phải chờ API.
type CacheEntry<T> = {
  data: T;
  fetchedAt: number;
};
const cacheStore = new Map<string, CacheEntry<any>>();

/**
 * Hook fetch + cache theo phiên làm việc.
 * - Lần đầu mount: gọi `fetcher()`, lưu vào cache, trả về {data, loading: true}
 * - Lần sau mount (cùng key): trả về data ngay từ cache, KHÔNG gọi lại API (loading: false)
 * - Bấm `refresh()`: xóa cache + gọi lại API
 * - F5 / mở tab mới: cache mất → fetch lại
 */
export function useSessionCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  defaultValue?: T
) {
  const [data, setData] = useState<T>(() => {
    const cached = cacheStore.get(key);
    return cached ? cached.data : (defaultValue ?? ([] as unknown as T));
  });
  const [loading, setLoading] = useState<boolean>(() => !cacheStore.has(key));
  const [error, setError] = useState<string | null>("");
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const runFetch = async (isRefresh: boolean) => {
    if (isRefresh) cacheStore.delete(key);
    setLoading(true);
    setError("");
    try {
      const result = await fetcherRef.current();
      if (!mountedRef.current) return;
      cacheStore.set(key, { data: result, fetchedAt: Date.now() });
      setData(result);
    } catch (err: any) {
      if (!mountedRef.current) return;
      setError(err?.message || "Lỗi tải dữ liệu");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    // Nếu đã có cache → không gọi API, hiển thị ngay
    if (cacheStore.has(key)) {
      const cached = cacheStore.get(key)!;
      setData(cached.data);
      setLoading(false);
      return;
    }
    // Chưa có → fetch lần đầu
    runFetch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ...deps]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = () => runFetch(true);

  return { data, loading, error, refresh };
}

/**
 * Xóa toàn bộ cache (debug / trường hợp đặc biệt).
 */
export function clearSessionCache() {
  cacheStore.clear();
}