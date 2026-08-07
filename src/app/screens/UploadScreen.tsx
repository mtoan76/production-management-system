import { useState, useRef } from "react";
import {
  Upload, X, FileSpreadsheet, FileImage, Download, Loader2, AlertCircle,
  CheckCircle2, BarChart2, List, XCircle, AlertTriangle, Clock, User, MapPin,
} from "lucide-react";
import { Screen, SubmitStatus, ReportItem, TemplateType, FileValidation } from '../types';
import { N8N_WEBHOOK_URL, TEMPLATE_FILES } from '../utils/constants';
import Header from '../components/Header';

// ─── Validate file Excel ──────────────────────────────────────

async function validateExcelFile(file: File): Promise<FileValidation> {
  const excelMatch = file.name.match(/\.xlsx$/i);
  if (!excelMatch) {
    return { valid: false, error: "Chỉ chấp nhận file Excel (.xlsx) theo đúng template mẫu. Vui lòng tải template Đào lò hoặc Khai thác ở mục 1." };
  }
  try {
    const buffer = await file.arrayBuffer();
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buffer);
    const sheetName = wb.SheetNames[0];
    if (!sheetName) return { valid: false, error: "File Excel rỗng" };
    const sheet = wb.Sheets[sheetName];
    const ref = sheet["!ref"];
    if (!ref) return { valid: false, error: "Không đọc được header file" };
    const range = XLSX.utils.decode_range(ref);
    const headers: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: 2, c });
      const cell = sheet[addr];
      headers.push(cell?.v?.toString().trim() || "");
    }
    const col5 = (headers[5] || "").toLowerCase();
    const hasTanThan = col5.includes("tấn than") || col5.includes("lò chợ");
    const hasDuongLoDao = col5.includes("đường lò đào");
    if (hasTanThan) return { valid: true, type: "khai_thac" };
    if (hasDuongLoDao) return { valid: true, type: "daolo" };
    return {
      valid: false,
      error: "File không đúng cấu trúc template. Vui lòng tải template mẫu (Đào lò hoặc Khai thác) và điền theo đúng định dạng.",
    };
  } catch (e: any) {
    return { valid: false, error: "Không thể đọc file Excel: " + (e?.message || "lỗi không xác định") };
  }
}

// ─── Helper functions ─────────────────────────────────────────

function normalizeVN(s?: string) {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function getSanLuong(item: ReportItem) {
  const v = item.san_luong_tan ?? item.san_luong;
  return v === undefined || v === null || v === "" ? undefined : v;
}

// ─── Status Pill ──────────────────────────────────────────────

function StatusPill({ status }: { status?: string }) {
  const norm = normalizeVN(status);
  let label = "Không rõ";
  let bg = "#F3F4F6";
  let color = "#6B7280";
  if (norm.includes("nghiem trong")) {
    label = "Nghiêm trọng"; bg = "#FEF2F2"; color = "#DC2626";
  } else if (norm.includes("canh bao")) {
    label = "Cảnh báo"; bg = "#FFFBEB"; color = "#D97706";
  } else if (norm.includes("binh thuong")) {
    label = "Bình thường"; bg = "#ECFDF5"; color = "#059669";
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

// ─── Report Item Card ─────────────────────────────────────────

function ReportItemCard({ item }: { item: ReportItem }) {
  const sanLuong = getSanLuong(item);
  const tienDo = item.tien_do_dao_lo ?? item.xen_lo_2;
  const tinhTrang = item.tinh_trang;
  const canhBao = item.noi_dung_canh_bao;
  const hasCanhBao = !!canhBao && !normalizeVN(canhBao).includes("khong co");

  return (
    <div className="border border-gray-200 rounded-xl p-4 text-left">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">{item.don_vi_thi_cong || "Không rõ đơn vị"}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
            <span className="inline-flex items-center gap-1"><Clock size={11} />{item.ngay || "--"} · Ca {item.ca ?? "--"}</span>
            {item.nguoi_bao_cao && <span className="inline-flex items-center gap-1"><User size={11} />{item.nguoi_bao_cao}</span>}
            {item.duong_lo && <span className="inline-flex items-center gap-1"><MapPin size={11} />{item.duong_lo}</span>}
          </div>
        </div>
        {tinhTrang && <StatusPill status={tinhTrang} />}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-center">
          <p className="text-base font-black text-blue-700">
            {sanLuong !== undefined ? sanLuong.toLocaleString("vi-VN") : "—"}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Sản lượng (tấn)</p>
        </div>
        <div className="rounded-lg bg-orange-50 border border-orange-100 px-3 py-2 text-center">
          <p className="text-base font-black text-orange-600">
            {tienDo !== undefined && tienDo !== null ? tienDo : "—"}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Tiến độ đào (mét)</p>
        </div>
        <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 text-center">
          <p className="text-sm font-bold text-gray-900 truncate" title={item.bo_tri_lao_dong || ""}>
            {item.bo_tri_lao_dong || (item.so_lao_dong ? `${item.so_lao_dong} LĐ` : "—")}
          </p>
          <p className="text-[10px] text-gray-500 mt-0.5">Bố trí / LĐ</p>
        </div>
      </div>

      {item.ghi_chu && (
        <p className="text-xs text-gray-600 mb-2 px-2 py-1 rounded bg-gray-50 border border-gray-100">
          <span className="text-gray-400 font-semibold">Ghi chú:</span> {item.ghi_chu}
        </p>
      )}

      <div
        className="flex items-start gap-1.5 mt-2 px-2.5 py-1.5 rounded-lg"
        style={hasCanhBao ? { background: "#FEF2F2", border: "1px solid #FECACA" } : { background: "#F9FAFB", border: "1px solid #E5E7EB" }}
      >
        <AlertTriangle size={13} color={hasCanhBao ? "#DC2626" : "#9CA3AF"} className="mt-0.5 flex-shrink-0" />
        <p className="text-xs" style={{ color: hasCanhBao ? "#991B1B" : "#6B7280" }}>
          <span className="font-semibold">Cảnh báo: </span>
          {hasCanhBao ? canhBao : "Không có"}
        </p>
      </div>
    </div>
  );
}

// ─── Submit Overlay ───────────────────────────────────────────

function SubmitOverlay({
  status, errorMessage, reportItems, onClose, onNavigate,
}: {
  status: SubmitStatus;
  errorMessage: string;
  reportItems: ReportItem[];
  onClose: () => void;
  onNavigate: (s: Screen) => void;
}) {
  if (status === "idle") return null;
  const hasReport = status === "success" && reportItems.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.45)" }}>
      <div className={`bg-white rounded-2xl shadow-xl w-full flex flex-col items-center text-center transition-all ${hasReport ? "max-w-[720px] max-h-[85vh]" : "max-w-[420px] p-8"}`}>
        {status === "processing" && (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#EFF6FF" }}>
              <Loader2 size={30} color="#2563EB" className="animate-spin" />
            </div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Đang xử lý dữ liệu báo cáo...
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Hệ thống đang gửi báo cáo lên n8n để trích xuất và phân tích dữ liệu. Vui lòng chờ trong giây lát.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className={`w-full flex flex-col items-center text-center ${hasReport ? "p-6 overflow-hidden" : ""}`}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 flex-shrink-0" style={{ background: "#ECFDF5" }}>
              <CheckCircle size={30} color="#059669" />
            </div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Đã xử lý xong báo cáo!
            </h3>
            <p className="text-sm text-gray-500 mt-1 mb-4 leading-relaxed">
              {hasReport
                ? `n8n đã phân tích và trả về ${reportItems.length} dòng báo cáo bên dưới.`
                : "Dữ liệu đã được lưu và phân tích thành công."}
            </p>

            {hasReport && (
              <div className="w-full flex flex-col gap-2.5 overflow-y-auto text-left pr-1" style={{ maxHeight: "48vh" }}>
                {reportItems.map((item, idx) => (
                  <ReportItemCard key={item.ma_bao_cao || idx} item={item} />
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2 w-full mt-5 flex-shrink-0">
              <button onClick={onClose} className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "#2563EB" }}>
                Đóng và nhập báo cáo khác
              </button>
              <div className="flex gap-2 w-full">
                <button onClick={() => onNavigate("overview")} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                  <BarChart2 size={13} />
                  Báo cáo tổng quan
                </button>
                <button onClick={() => onNavigate("detail")} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">
                  <List size={13} />
                  Báo cáo chi tiết
                </button>
              </div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#FEF2F2" }}>
              <XCircle size={30} color="#DC2626" />
            </div>
            <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              Gửi báo cáo thất bại
            </h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">{errorMessage}</p>
            <button onClick={onClose} className="w-full mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ background: "#2563EB" }}>
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── UploadScreen Component ───────────────────────────────────

export default function UploadScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [validation, setValidation] = useState<FileValidation | null>(null);
  const [validating, setValidating] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [reportItems, setReportItems] = useState<ReportItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = async (f: File | null) => {
    setFile(f);
    setValidation(null);
    if (!f) return;
    setValidating(true);
    const result = await validateExcelFile(f);
    setValidation(result);
    setValidating(false);
  };

  const handleDownloadTemplate = (type: TemplateType) => {
    const tpl = TEMPLATE_FILES[type];
    const link = document.createElement("a");
    link.href = tpl.url;
    link.download = tpl.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmitReport = async () => {
    if (status === "processing") return;
    if (!file) {
      alert("Vui lòng tải lên tệp báo cáo!");
      return;
    }
    if (validation && !validation.valid) {
      alert(validation.error || "File không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    const today = new Date();
    const ngayBaoCao = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;
    formData.append("ngay_bao_cao", ngayBaoCao);

    setStatus("processing");

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json().catch(() => null);
        console.log("n8n response:", data);

        let items: ReportItem[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data && Array.isArray((data as any).data)) {
          items = (data as any).data;
        } else if (data && typeof data === "object" && Object.keys(data).length > 0) {
          items = [data as ReportItem];
        }

        const hasExplicitError = !!(
          data?.error ||
          data?.success === false ||
          (typeof data?.message === "string" && /error|lỗi|exception/i.test(data.message))
        );

        if (items.length === 0 || hasExplicitError) {
          setErrorMessage(
            hasExplicitError && typeof data.error === "string"
              ? `n8n báo lỗi: ${data.error}`
              : "n8n đã xử lý xong nhưng không trả về dữ liệu báo cáo. Vui lòng kiểm tra workflow (đặc biệt là HTTP Request gọi AI)."
          );
          setStatus("error");
          return;
        }

        setReportItems(items);
        setStatus("success");
        setFile(null);
      } else {
        setErrorMessage(`Server n8n trả về lỗi (mã ${response.status}). Vui lòng kiểm tra workflow.`);
        setStatus("error");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setErrorMessage("Không thể kết nối đến Backend n8n. Kiểm tra n8n đã bật (Active) và đúng URL webhook chưa.");
      setStatus("error");
    }
  };

  const closeOverlay = () => {
    setStatus("idle");
    setReportItems([]);
  };

  return (
    <div className="p-4 md:p-8 min-h-full flex flex-col relative">
      <SubmitOverlay status={status} errorMessage={errorMessage} reportItems={reportItems} onClose={closeOverlay} onNavigate={onNavigate} />
      <Header title="Nhập báo cáo mới" avatar="NA" />

      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {/* Bước 1: Tải template mẫu */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">1</div>
            <span className="text-sm font-semibold text-gray-800">Tải template mẫu</span>
            <span className="text-xs text-gray-500 ml-1">— chọn đúng loại công trường bạn muốn nộp báo cáo</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleDownloadTemplate("daolo")}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-400 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet size={20} className="text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">Template Đào lò</div>
                <div className="text-[11px] text-gray-500 truncate">Báo cáo công trường đào lò (m, m², vì)</div>
              </div>
              <Download size={16} className="text-blue-600 flex-shrink-0" />
            </button>
            <button
              onClick={() => handleDownloadTemplate("khai_thac")}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-orange-200 bg-orange-50/40 hover:bg-orange-50 hover:border-orange-400 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet size={20} className="text-orange-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 text-sm truncate">Template Khai thác</div>
                <div className="text-[11px] text-gray-500 truncate">Báo cáo sản lượng than (tấn)</div>
              </div>
              <Download size={16} className="text-orange-600 flex-shrink-0" />
            </button>
          </div>
        </div>

        {/* Bước 2 + 3: Điền dữ liệu + Upload file */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">2</div>
            <span className="text-sm font-semibold text-gray-800">Tải lên tệp đã điền</span>
            <span className="text-xs text-gray-400 ml-1">— chỉ chấp nhận Excel (.xlsx) theo đúng template mẫu, tối đa 25MB</span>
          </div>
          <div
            className="flex-1 min-h-[420px] flex flex-col items-center justify-center gap-8 m-6 py-16 px-10 rounded-xl transition-colors cursor-pointer"
            style={{
              border: `2px dashed ${dragging ? "#2563EB" : (validation && !validation.valid ? "#FCA5A5" : "#D1D5DB")}`,
              background: dragging ? "#EFF6FF" : (validation && !validation.valid ? "#FEF2F2" : "#FAFAFA"),
            }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) validateAndSetFile(f); }}
            onClick={() => fileRef.current?.click()}
          >
            {!file ? (
              <>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "#EFF6FF" }}>
                  <Upload size={36} color="#2563EB" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-gray-800 text-lg">Kéo &amp; thả tệp vào đây</p>
                  <p className="text-sm text-gray-400 mt-2">hoặc nhấn để chọn từ máy tính</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ background: "#2563EB", whiteSpace: "nowrap" }}
                >
                  Chọn tệp
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 py-2 w-full">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-gray-200 shadow-sm w-full max-w-md">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                    background: file.name.match(/\.(xlsx|csv)$/i) ? "#DCFCE7" : "#DBEAFE"
                  }}>
                    {file.name.match(/\.(xlsx|csv)$/i) ? (
                      <FileSpreadsheet size={20} className="text-green-700" />
                    ) : (
                      <FileImage size={20} className="text-blue-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-semibold text-gray-800 text-sm truncate">{file.name}</div>
                    <div className="text-[11px] text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); validateAndSetFile(null); }}
                    className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                    title="Xóa file"
                  >
                    <X size={16} />
                  </button>
                </div>

                {validating && (
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <Loader2 size={14} className="animate-spin" />
                    Đang kiểm tra cấu trúc file...
                  </div>
                )}
                {!validating && validation?.valid && (
                  <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200 w-full max-w-md">
                    <CheckCircle2 size={16} />
                    <span className="font-semibold">Hợp lệ</span>
                    <span className="text-gray-600">·</span>
                    <span>{validation.type === "daolo" ? "Template Đào lò" : validation.type === "khai_thac" ? "Template Khai thác" : "Ảnh"}</span>
                  </div>
                )}
                {!validating && validation && !validation.valid && (
                  <div className="flex items-start gap-2 text-xs text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200 w-full max-w-md">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span className="text-left">{validation.error}</span>
                  </div>
                )}
              </div>
            )}
            <input ref={fileRef} type="file" className="hidden" accept=".xlsx" onChange={e => validateAndSetFile(e.target.files?.[0] ?? null)} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 mt-5 pt-5 border-t border-gray-200">
        <button
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
          style={{ whiteSpace: "nowrap" }}
          onClick={() => { setFile(null); }}
        >
          Hủy
        </button>
        <button
          onClick={handleSubmitReport}
          disabled={status === "processing" || !file || (validation !== null && !validation.valid)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "#2563EB", whiteSpace: "nowrap" }}
        >
          {status === "processing" ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {status === "processing" ? "Đang gửi..." : "Lưu báo cáo"}
        </button>
      </div>
    </div>
  );
}