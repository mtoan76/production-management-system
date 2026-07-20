import { useEffect, useState } from "react";

/**
 * Auto-detect xem người dùng đang mở web trên desktop hay mobile.
 *
 * Cách hoạt động:
 *   1. Ưu tiên khớp user-agent (chính xác, không phụ thuộc resize cửa sổ).
 *   2. Nếu không có UA → dùng `matchMedia('(pointer: coarse)')`
 *      (true = thiết bị cảm ứng, false = có chuột).
 *   3. Còn lại dựa vào breakpoint chiều ngang 768px.
 *
 * Hook có SSR-safe: mặc định trả về `false` (desktop) cho đến khi chạy được trên client.
 *
 * @param mobileWidth  Ngưỡng chiều ngang để phân loại mobile (mặc định 768px).
 */
export function useDeviceDetect(mobileWidth = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const compute = () => {
      if (typeof window === "undefined") return false;

      const ua =
        navigator.userAgent ||
        (navigator as unknown as { vendor?: string }).vendor ||
        "";
      const uaMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(
        ua
      );

      // Tablet cũng tính là mobile UI cho UX nhất quán
      const isSmallScreen = window.innerWidth < mobileWidth;
      const isTouchOnly =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(pointer: coarse)").matches &&
        window.matchMedia("(max-width: 1024px)").matches;

      setIsMobile(Boolean(uaMobile || isSmallScreen || isTouchOnly));
    };

    compute();

    // Nghe resize + orientationchange để chuyển đổi UI khi xoay máy / kéo cửa sổ
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);

    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [mobileWidth]);

  return isMobile;
}
