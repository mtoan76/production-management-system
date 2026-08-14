import { useState, useRef } from "react";
import {
  Upload, X, FileSpreadsheet, FileImage, Loader2, LayoutDashboard, History,
} from "lucide-react";
import { TabId, SubmitStatus, ReportItem } from '../types';
import { N8N_WEBHOOK_URL } from '../utils/constants';
import { C, Sheet, ReportItemCard } from '../components/mobile';
import { pad2 } from '../utils/format';

// ─── Validate file Excel (mobile) ────────────────────────────
type MobileTemplateType = "daolo" | "khai_thac";
type MobileFileValidation = { valid: boolean; type?: MobileTemplateType; error?: string };
const MOBILE_TEMPLATE_FILES: Record<MobileTemplateType, { url: string; name: string; label: string }> = {
  daolo: { url: "/templates/baocaocongtruong_daolo.xlsx", name: "baocaocongtruong_daolo.xlsx", label: "Đào lò" },
  khai_thac: { url: "/templates/baocaocongtruong_Khai thac.xlsx", name: "baocaocongtruong_Khai thac.xlsx", label: "Khai thác" },
};

async function validateMobileExcelFile(file: File): Promise<MobileFileValidation> {
  if (!file.name.match(/\.xlsx$/i)) {
    return { valid: false, error: "Chỉ chấp nhận file Excel (.xlsx) theo đúng template mẫu. Vui lòng tải template Đào lò hoặc Khai thác." };
  }
  try {
    const buffer = await file.arrayBuffer();
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buffer);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet?.["!ref"]) return { valid: false, error: "File Excel rỗng" };
    const range = XLSX.utils.decode_range(sheet["!ref"]!);
    const headers: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: 2, c });
      headers.push(sheet[addr]?.v?.toString().trim() || "");
    }
    const col5 = (headers[5] || "").toLowerCase();
    if (col5.includes("tấn than") || col5.includes("lò chợ")) return { valid: true, type: "khai_thac" };
    if (col5.includes("đường lò đào")) return { valid: true, type: "daolo" };
    return { valid: false, error: "File không đúng cấu trúc template. Vui lòng tải template mẫu và điền theo đúng định dạng." };
  } catch (e: any) {
    return { valid: false, error: "Không thể đọc file Excel: " + (e?.message || "lỗi không xác định") };
  }
}

// ─── MobileSubmit Component ───────────────────────────────────
export default function MobileSubmit({ onNav }: { onNav: (t: TabId) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [validation, setValidation] = useState<MobileFileValidation | null>(null);
  const [validating, setValidating] = useState(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [items, setItems] = useState<ReportItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const validateAndSetMobileFile = async (f: File | null) => {
    setFile(f);
    setValidation(null);
    if (!f) return;
    setValidating(true);
    const result = await validateMobileExcelFile(f);
    setValidation(result);
    setValidating(false);
  };

  const handleDownloadMobileTemplate = (type: MobileTemplateType) => {
    const tpl = MOBILE_TEMPLATE_FILES[type];
    const link = document.createElement("a");
    link.href = tpl.url;
    link.download = tpl.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async () => {
    if (status === "processing") return;
    if (!file) { alert("Vui lòng tải lên tệp báo cáo!"); return; }
    if (validation && !validation.valid) { alert(validation.error || "File không hợp lệ"); return; }
    const formData = new FormData();
    if (file) formData.append("file", file);
    const today = new Date();
    formData.append("ngay_bao_cao", `${pad2(today.getDate())}/${pad2(today.getMonth() + 1)}/${today.getFullYear()}`);
    setStatus("processing");
    setErrMsg("");
    try {
      const res = await fetch(N8N_WEBHOOK_URL, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Server trả về ${res.status}`);
      const data = await res.json().catch(() => null);
      let result: ReportItem[] = [];
      if (Array.isArray(data)) result = data;
      else if (data && Array.isArray(data.data)) result = data.data;
      else if (data && typeof data === "object" && Object.keys(data).length > 0) result = [data];
      const hasErr = !!(data?.error || data?.success === false || (typeof data?.message === "string" && /error|lỗi|exception/i.test(data.message)));
      if (result.length === 0 || hasErr) {
        setErrMsg(hasErr && typeof data.error === "string" ? `n8n báo lỗi: ${data.error}` : "n8n đã xử lý xong nhưng không trả về dữ liệu. Kiểm tra workflow.");
        setStatus("error");
        return;
      }
      setItems(result);
      setStatus("success");
      setFile(null);
    } catch (err: any) {
      setErrMsg(err?.message || "Không thể kết nối n8n. Kiểm tra URL webhook.");
      setStatus("error");
    }
  };

  const closeOverlay = () => { setStatus("idle"); setItems([]); };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-4 pb-3" style={{ background: "linear-gradient(135deg, #0F2744 0%, #1a4980 50%, #1e3a5f 100%)" }}>
        <div className="font-extrabold text-white text-[17px]" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Nhập báo cáo mới</div>
        <div className="text-[11px] text-slate-500 mt-1">Tải lên file Excel hoặc nhập thông tin thủ công</div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ background: C.bg }}>
        <div className="p-3 pb-32">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer?.files?.[0]; if (f) validateAndSetMobileFile(f); }}
            onClick={() => fileRef.current?.click()}
            className="rounded-2xl p-6 text-center mb-3 cursor-pointer"
            style={{
              border: `2px dashed ${dragging ? C.primary : (validation && !validation.valid ? "#FCA5A5" : file ? C.success : C.border)}`,
              background: dragging ? C.primaryLight : (validation && !validation.valid ? "#FEF2F2" : file ? C.successLight : C.card),
            }}
          >
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.xlsx,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) validateAndSetMobileFile(f); }} />
            {file ? (
              <>
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center" style={{ background: validation && !validation.valid ? "#FEE2E2" : C.successLight }}>
                  {file.name.match(/\.(xlsx|csv)$/i) ? (
                    <FileSpreadsheet size={26} className={validation && !validation.valid ? "text-red-600" : "text-emerald-600"} />
                  ) : (
                    <FileImage size={26} className={validation && !validation.valid ? "text-red-600" : "text-emerald-600"} />
                  )}
                </div>
                <div className={`font-bold text-[13px] ${validation && !validation.valid ? "text-red-700" : "text-emerald-700"}`}>{file.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</div>
                {validating && <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-blue-600"><Loader2 size={12} className="animate-spin" />Đang kiểm tra...</div>}
                {!validating && validation?.valid && <div className="mt-2 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block">✓ {validation.type === "daolo" ? "Đào lò" : validation.type === "khai_thac" ? "Khai thác" : "Ảnh"}</div>}
                {!validating && validation && !validation.valid && <div className="mt-2 text-[10px] text-red-700 bg-red-50 px-2 py-1.5 rounded-md leading-tight max-w-xs">⚠ {validation.error}</div>}
                <button onClick={e => { e.stopPropagation(); validateAndSetMobileFile(null); }} className="mt-2 text-[11px] font-semibold text-red-600 bg-red-50 rounded-md px-3 py-1">Xóa file</button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center" style={{ background: dragging ? C.primaryLight : "#F1F5F9" }}>
                  <Upload size={22} color={dragging ? C.primary : "#94A3B8"} />
                </div>
                <div className="font-bold text-slate-800 text-[13px]">Kéo thả file hoặc nhấn để chọn</div>
                <div className="text-[11px] text-slate-500 mt-1 mb-3">Excel (.xlsx, .csv) hoặc ảnh (.jpg, .png) — tối đa 25MB</div>
                <button onClick={e => { e.stopPropagation(); fileRef.current?.click(); }} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[12px] font-bold active:opacity-80">Chọn tệp</button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex gap-1 flex-1">
              <button onClick={() => handleDownloadMobileTemplate("daolo")} className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-1 active:opacity-70"><FileSpreadsheet size={11} /> Đào lò</button>
              <button onClick={() => handleDownloadMobileTemplate("khai_thac")} className="flex-1 flex items-center justify-center gap-1 text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-md px-2 py-1 active:opacity-70"><FileSpreadsheet size={11} /> Khai thác</button>
            </div>
            <span className="text-[10px] text-slate-500">tối đa 25MB</span>
          </div>
        </div>
      </div>

      <div className="absolute left-0 right-0 flex gap-2 p-3 border-t bg-white" style={{ bottom: 80, borderColor: C.border }}>
        <button onClick={() => setFile(null)} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold text-[13px] active:opacity-70">Hủy</button>
        <button onClick={handleSubmit} disabled={status === "processing" || !file || (validation !== null && !validation.valid)} className="flex-[2] py-3 rounded-xl text-white font-bold text-[13px] flex items-center justify-center gap-2 disabled:cursor-not-allowed active:opacity-80" style={{ background: !file ? "#CBD5E1" : "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>
          {status === "processing" ? <><Loader2 size={14} className="animate-spin" />Đang xử lý…</> : "Lưu báo cáo"}
        </button>
      </div>

      {status === "processing" && (
        <div className="absolute inset-0 z-50 bg-slate-900/85 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center"><Loader2 size={36} className="text-blue-500 animate-spin" /></div>
          <div className="text-white font-bold text-[15px]">Đang xử lý…</div>
          <div className="text-slate-500 text-[12px]">AI đang phân tích báo cáo của bạn</div>
        </div>
      )}

      {status === "success" && (
        <Sheet open onClose={closeOverlay} title="Đã xử lý xong báo cáo!" subtitle={`n8n trả về ${items.length} dòng dữ liệu`}>
          <div className="flex flex-col gap-2.5 mb-4">
            {items.map((it, idx) => <ReportItemCard key={it.ma_bao_cao || idx} item={it} />)}
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={closeOverlay} className="w-full py-3 rounded-xl text-white font-bold text-[13px] active:opacity-80" style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>Đóng và nhập báo cáo khác</button>
            <div className="flex gap-2">
              <button onClick={() => { closeOverlay(); onNav("overview"); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[11px] flex items-center justify-center gap-1.5"><LayoutDashboard size={12} />Tổng quan</button>
              <button onClick={() => { closeOverlay(); onNav("history"); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-[11px] flex items-center justify-center gap-1.5"><History size={12} />Lịch sử</button>
            </div>
          </div>
        </Sheet>
      )}
      {status === "error" && (
        <Sheet open onClose={closeOverlay} title="Gửi báo cáo thất bại" subtitle={errMsg}>
          <button onClick={closeOverlay} className="w-full py-3 rounded-xl text-white font-bold text-[13px] active:opacity-80" style={{ background: "linear-gradient(135deg,#2563EB,#1D4ED8)" }}>Thử lại</button>
        </Sheet>
      )}
    </div>
  );
}