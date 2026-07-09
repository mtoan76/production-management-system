import svgPaths from "./svg-6z3zqe8hdj";
import imgImage from "./d36a746160b8cc688c574bcd71e2400aa0a01098.png";
import imgImage1 from "./8bba9863eb0ade274317608d08e717fa18e9ceb9.png";

function Svg() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_4_224)" id="SVG">
          <path d={svgPaths.p11231e00} id="Vector" opacity="0.25" stroke="var(--stroke-0, white)" strokeWidth="3.33333" />
          <path d={svgPaths.p10ae56c0} fill="var(--fill-0, white)" id="Vector_2" opacity="0.75" />
        </g>
        <defs>
          <clipPath id="clip0_4_224">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function LivePreviewToastFromImage() {
  return (
    <div className="absolute bg-[#1f2937] bottom-[24px] content-stretch flex gap-[12px] items-center left-[435.15px] pl-[16px] pr-[20px] py-[12px] rounded-[12px] w-[409.7px] z-[4]" data-name="Live Preview Toast (From Image)">
      <div className="absolute bg-[rgba(255,255,255,0)] bottom-0 left-0 rounded-[12px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-0 w-[409.7px]" data-name="Live Preview Toast (From Image):shadow" />
      <Svg />
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[20px]">Live preview loading, interactions may not be saved</p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#111827] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Lò 101 - Vận tải</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[6px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g clipPath="url(#clip0_4_218)" id="SVG">
          <path d={svgPaths.p1d33abc0} fill="var(--fill-0, #047857)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_4_218">
            <rect fill="white" height="6" width="6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#d1fae5] content-stretch flex gap-[6px] items-center px-[11px] py-[3px] relative rounded-[9999px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(16,185,129,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <Svg1 />
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#047857] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Bình thường</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading1 />
      <BackgroundBorder />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Tổng cộng lũy kế</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-[257.37px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container1 />
        <Container2 />
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path d="M6 18L18 6M6 6L18 18" id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCloseModal() {
  return (
    <div className="relative shrink-0" data-name="Button - Close modal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start p-[4px] relative size-full">
        <Svg2 />
      </div>
    </div>
  );
}

function ModalHeader() {
  return (
    <div className="relative shrink-0 w-full" data-name="Modal Header">
      <div aria-hidden className="absolute border-[#e6e8ea] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start justify-between pb-[25px] pt-[24px] px-[32px] relative size-full">
        <Container />
        <ButtonCloseModal />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Tổng sản lượng (lũy kế)</p>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[8px] items-baseline leading-[0] relative shrink-0 w-full whitespace-nowrap" data-name="Paragraph">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#1d4ed8] text-[36px]">
        <p className="leading-[40px]">1,440</p>
      </div>
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[#4b5563] text-[16px]">
        <p className="leading-[24px]">tấn</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start px-[16px] relative size-full">
        <Container4 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] w-full">
          <p className="leading-[20px]">Tiến độ đào lò (lũy kế)</p>
        </div>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="[word-break:break-word] bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-baseline leading-[0] relative size-full whitespace-nowrap">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#f97316] text-[36px]">
          <p className="leading-[40px]">92</p>
        </div>
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center relative shrink-0 text-[#4b5563] text-[16px]">
          <p className="leading-[24px]">mét</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[#e6e8ea] border-l border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pl-[33px] pr-[32px] relative size-full">
        <Container5 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function MetricsRow() {
  return (
    <div className="content-stretch flex gap-[32px] items-start justify-center relative shrink-0 w-full" data-name="Metrics Row">
      <Container3 />
      <VerticalBorder />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[16px]">SẢN LƯỢNG THEO NGÀY (TẤN)</p>
      </div>
    </div>
  );
}

function Heading3Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Heading 3:margin">
      <Heading2 />
    </div>
  );
}

function Image() {
  return (
    <div className="h-[224px] relative shrink-0 w-[456px]" data-name="image">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage} />
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative w-full" data-name="Container">
      <Image />
    </div>
  );
}

function BarChartContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[256px] items-start min-w-px relative" data-name="Bar Chart Container">
      <Heading3Margin />
      <Container6 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[16px]">TIẾN ĐỘ ĐÀO LÒ THEO NGÀY (MÉT)</p>
      </div>
    </div>
  );
}

function Heading3Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Heading 3:margin">
      <Heading3 />
    </div>
  );
}

function Image1() {
  return (
    <div className="h-[224px] relative shrink-0 w-[456px]" data-name="image">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage1} />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative w-full" data-name="Container">
      <Image1 />
    </div>
  );
}

function LineChartContainer() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[256px] items-start min-w-px relative" data-name="Line Chart Container">
      <Heading3Margin1 />
      <Container7 />
    </div>
  );
}

function ChartsRow() {
  return (
    <div className="content-stretch flex gap-[48px] items-start justify-center relative shrink-0 w-full" data-name="Charts Row">
      <BarChartContainer />
      <LineChartContainer />
    </div>
  );
}

function ChartsRowMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-full" data-name="Charts Row:margin">
      <ChartsRow />
    </div>
  );
}

function ModalBodyMetricsCharts() {
  return (
    <div className="relative shrink-0 w-full" data-name="Modal Body (Metrics & Charts)">
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[32px] relative size-full">
        <MetricsRow />
        <ChartsRowMargin />
      </div>
    </div>
  );
}

function ModalContainer() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start max-w-[1024px] overflow-clip relative rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] shrink-0 w-[1024px]" data-name="Modal Container">
      <ModalHeader />
      <ModalBodyMetricsCharts />
    </div>
  );
}

function ModalOverlay() {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[rgba(17,24,39,0.4)] content-stretch flex inset-0 items-center justify-center p-[16px] z-[3]" data-name="Modal Overlay">
      <ModalContainer />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#1d4ed8] relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pb-[6.5px] pt-[5.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[18px] text-center text-white whitespace-nowrap">
          <p className="leading-[28px]">N</p>
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-white whitespace-nowrap">
        <p className="leading-[20px]">Núi Béo</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#9ca3af] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Hệ thống quản lý sản xuất</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[142.52px]" data-name="Container">
      <Heading />
      <Container9 />
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[12px] relative size-full">
        <Container8 />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#1f2937] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pb-[25px] pt-[24px] px-[24px] relative size-full">
          <Background />
          <Margin />
        </div>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p2dd2d200} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative size-full">
          <Svg3 />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#9ca3af] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Nhập báo cáo mới</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p2864a080} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative size-full">
          <Svg4 />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#9ca3af] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Báo cáo tổng hợp</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p3fec76a0} id="Vector" stroke="var(--stroke-0, #3B82F6)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-[#1e3a8a] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative size-full">
          <Svg5 />
          <div className="-translate-y-1/2 absolute bg-[#3b82f6] h-[32px] left-0 rounded-br-[9999px] rounded-tr-[9999px] top-1/2 w-[4px]" data-name="Background" />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-white whitespace-nowrap">
            <p className="leading-[20px]">Báo cáo chi tiết</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path d={svgPaths.p1c877100} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Link3() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[10px] relative size-full">
          <Svg6 />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#9ca3af] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Trung tâm cảnh báo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="flex-[1_0_0] min-h-[40px] relative w-full" data-name="Link:margin">
      <div className="flex flex-col justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-end min-h-[inherit] pt-[650px] relative size-full">
          <Link3 />
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Nav">
      <div className="overflow-auto rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[16px] relative size-full">
          <Link />
          <Link1 />
          <Link2 />
          <LinkMargin />
        </div>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#4b5563] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">A</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[14px] text-white w-full">
        <p className="leading-[20px]">Nguyễn Văn A</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Margin">
      <div className="content-stretch flex flex-col items-start pl-[12px] relative size-full">
        <Container11 />
      </div>
    </div>
  );
}

function Svg8() {
  return (
    <div className="flex-[1_0_0] min-h-px overflow-clip relative w-[20px]" data-name="SVG">
      <div className="absolute inset-[16.67%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-6.25%_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 15">
            <path d={svgPaths.p28bc7580} id="Vector" stroke="var(--stroke-0, #9CA3AF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Svg7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center overflow-clip relative shrink-0 size-[20px]" data-name="SVG">
      <Svg8 />
    </div>
  );
}

function SvgMargin() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pl-[12px] relative shrink-0 w-[32px]" data-name="SVG:margin">
      <Svg7 />
    </div>
  );
}

function Container10() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center p-[8px] relative size-full">
          <Background1 />
          <Margin1 />
          <SvgMargin />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#1f2937] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pb-[16px] pt-[17px] px-[16px] relative size-full">
        <Container10 />
      </div>
    </div>
  );
}

function AsideSidebar() {
  return (
    <div className="bg-[#111827] content-stretch flex flex-col h-full items-start relative shrink-0 w-[256px] z-[2]" data-name="Aside - Sidebar">
      <HorizontalBorder />
      <Nav />
      <HorizontalBorder1 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#111827] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">Báo cáo chi tiết</p>
      </div>
    </div>
  );
}

function TopHeader() {
  return (
    <div className="bg-[#f7f9fb] h-[80px] relative shrink-0 w-full" data-name="Top Header">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[32px] relative size-full">
          <Heading4 />
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-white opacity-50 relative rounded-[8px] self-stretch shrink-0 w-[309.33px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#c8c9ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[17px] py-[9px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Tổng công ty</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-white opacity-50 relative rounded-[8px] self-stretch shrink-0 w-[309.34px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#c8c9ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[17px] py-[9px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Cảnh báo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-white opacity-50 relative rounded-[8px] self-stretch shrink-0 w-[309.33px]" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#c8c9ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[17px] py-[9px] relative size-full">
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] text-center whitespace-nowrap">
            <p className="leading-[20px]">Tình trạng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FiltersMockup() {
  return (
    <div className="content-stretch flex gap-[16px] h-[38px] items-start justify-center relative shrink-0 w-full" data-name="Filters Mockup">
      <BackgroundBorder1 />
      <BackgroundBorder2 />
      <BackgroundBorder3 />
    </div>
  );
}

function FiltersMockupMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Filters Mockup:margin">
      <FiltersMockup />
    </div>
  );
}

function Heading5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#111827] text-[16px] w-full">
        <p className="leading-[24px]">Lò 101 - Vận tải</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Phân xưởng khai thác 1</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading5 />
        <Container14 />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="[word-break:break-word] h-[28px] leading-[0] relative shrink-0 text-center w-full whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center left-[calc(50%-10.74px)] text-[#111827] text-[18px] top-[13.5px]">
        <p className="leading-[28px]">{`1,440 `}</p>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center left-[calc(50%+26.12px)] text-[#4b5563] text-[14px] top-[15px]">
        <p className="leading-[20px]">tấn</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">105% kế hoạch</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph2 />
        <Container16 />
      </div>
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-[6px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g clipPath="url(#clip0_4_218)" id="SVG">
          <path d={svgPaths.p1d33abc0} fill="var(--fill-0, #047857)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_4_218">
            <rect fill="white" height="6" width="6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#d1fae5] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center pb-[4.5px] pt-[3.5px] px-[10px] relative size-full">
          <Svg9 />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#047857] text-[12px] text-right whitespace-nowrap">
            <p className="leading-[16px]">Bình thường</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Background2 />
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Row 1">
      <div aria-hidden className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[21px] relative size-full">
          <Container13 />
          <Container15 />
          <Container17 />
        </div>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#111827] text-[16px] w-full">
        <p className="leading-[24px]">Lò Chợ I-10-6</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Diện khai thác chính</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading6 />
        <Container19 />
      </div>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="[word-break:break-word] h-[28px] leading-[0] relative shrink-0 text-center w-full whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center left-[calc(50%-10.73px)] text-[#111827] text-[18px] top-[13.5px]">
        <p className="leading-[28px]">{`1,180 `}</p>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center left-[calc(50%+23.43px)] text-[#4b5563] text-[14px] top-[15px]">
        <p className="leading-[20px]">tấn</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b45309] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">84% kế hoạch</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph3 />
        <Container21 />
      </div>
    </div>
  );
}

function Svg10() {
  return (
    <div className="relative shrink-0 size-[6px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g clipPath="url(#clip0_4_218)" id="SVG">
          <path d={svgPaths.p1d33abc0} fill="var(--fill-0, #047857)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_4_218">
            <rect fill="white" height="6" width="6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#d1fae5] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center pb-[4.5px] pt-[3.5px] px-[10px] relative size-full">
          <Svg10 />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#047857] text-[12px] text-right whitespace-nowrap">
            <p className="leading-[16px]">Bình thường</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Background3 />
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Row 2">
      <div aria-hidden className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[21px] relative size-full">
          <Container18 />
          <Container20 />
          <Container22 />
        </div>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#111827] text-[16px] w-full">
        <p className="leading-[24px]">Lò 102 - Chuẩn bị</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Phân xưởng đào lò 2</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading7 />
        <Container24 />
      </div>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="[word-break:break-word] h-[28px] leading-[0] relative shrink-0 text-center w-full whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center left-[calc(50%-13.39px)] text-[#111827] text-[18px] top-[13.5px]">
        <p className="leading-[28px]">{`92 `}</p>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center left-[calc(50%+12.36px)] text-[#4b5563] text-[14px] top-[15px]">
        <p className="leading-[20px]">mét</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">98% kế hoạch</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph4 />
        <Container26 />
      </div>
    </div>
  );
}

function Svg11() {
  return (
    <div className="relative shrink-0 size-[6px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g clipPath="url(#clip0_4_218)" id="SVG">
          <path d={svgPaths.p1d33abc0} fill="var(--fill-0, #047857)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_4_218">
            <rect fill="white" height="6" width="6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#d1fae5] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center pb-[4.5px] pt-[3.5px] px-[10px] relative size-full">
          <Svg11 />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#047857] text-[12px] text-right whitespace-nowrap">
            <p className="leading-[16px]">Bình thường</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Background4 />
      </div>
    </div>
  );
}

function RepeatRowsForVisualFill() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Repeat rows for visual fill">
      <div aria-hidden className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[21px] relative size-full">
          <Container23 />
          <Container25 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function Heading8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#111827] text-[16px] w-full">
        <p className="leading-[24px]">Bơm nước trung tâm</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Hệ thống thoát nước</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading8 />
        <Container29 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="[word-break:break-word] h-[28px] leading-[0] relative shrink-0 text-center w-full whitespace-nowrap" data-name="Paragraph">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center left-[calc(50%-17.64px)] text-[#111827] text-[18px] top-[13.5px]">
        <p className="leading-[28px]">{`450 `}</p>
      </div>
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center left-[calc(50%+19.37px)] text-[#4b5563] text-[14px] top-[15px]">
        <p className="leading-[20px]">m3/h</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b91c1c] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Lưu lượng thấp</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Paragraph5 />
        <Container31 />
      </div>
    </div>
  );
}

function Svg12() {
  return (
    <div className="relative shrink-0 size-[6px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g clipPath="url(#clip0_4_221)" id="SVG">
          <path d={svgPaths.p1d33abc0} fill="var(--fill-0, #B91C1C)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_4_221">
            <rect fill="white" height="6" width="6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#fee2e2] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center pb-[4.5px] pt-[3.5px] px-[10px] relative size-full">
          <Svg12 />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b91c1c] text-[12px] text-right whitespace-nowrap">
            <p className="leading-[16px]">Báo động</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Background5 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border border-[#ef4444] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[21px] relative size-full">
          <Container28 />
          <Container30 />
          <Container32 />
        </div>
      </div>
    </div>
  );
}

function Heading9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#111827] text-[16px] w-full">
        <p className="leading-[24px]">Băng tải B1</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[14px] w-full">
        <p className="leading-[20px]">Vận tải chính</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading9 />
        <Container34 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#111827] text-[18px] text-center whitespace-nowrap">
        <p className="leading-[28px]">--</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#4b5563] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">Đang bảo dưỡng</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container36 />
        <Container37 />
      </div>
    </div>
  );
}

function Svg13() {
  return (
    <div className="relative shrink-0 size-[6px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
        <g clipPath="url(#clip0_4_198)" id="SVG">
          <path d={svgPaths.p1d33abc0} fill="var(--fill-0, #B45309)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_4_198">
            <rect fill="white" height="6" width="6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#fef3c7] relative rounded-[9999px] self-stretch shrink-0" data-name="Background">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[6px] items-center pb-[4.5px] pt-[3.5px] px-[10px] relative size-full">
          <Svg13 />
          <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#b45309] text-[12px] text-right whitespace-nowrap">
            <p className="leading-[16px]">Bảo dưỡng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-end relative size-full">
        <Background6 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow1() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] relative rounded-[12px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border border-[#e6e8ea] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between p-[21px] relative size-full">
          <Container33 />
          <Container35 />
          <Container38 />
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-name="Container">
      <Row />
      <Row1 />
      <RepeatRowsForVisualFill />
      <BackgroundBorderShadow />
      <BackgroundBorderShadow1 />
    </div>
  );
}

function ListAreaMockup() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px opacity-30 overflow-auto relative w-full" data-name="List Area Mockup">
      <Container12 />
    </div>
  );
}

function ContentFiltersListBlurredBackground() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Content Filters & List (Blurred Background)">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pb-[32px] px-[32px] relative size-full">
          <FiltersMockupMargin />
          <ListAreaMockup />
        </div>
      </div>
    </div>
  );
}

function MainContentAreaBackground() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px relative z-[1]" data-name="Main Content Area (Background)">
      <TopHeader />
      <ContentFiltersListBlurredBackground />
    </div>
  );
}

export default function HtmlBody() {
  return (
    <div className="bg-white content-stretch flex isolate items-start relative size-full" data-name="Html → Body">
      <LivePreviewToastFromImage />
      <ModalOverlay />
      <AsideSidebar />
      <MainContentAreaBackground />
    </div>
  );
}