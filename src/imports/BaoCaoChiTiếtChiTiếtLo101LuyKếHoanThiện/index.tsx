import svgPaths from "./svg-y0t6yp5t19";
import imgImage from "./227c784b7e3a5318350e13605c8bca31f944ac5c.png";
import imgImage1 from "./054b73a066a163b7a4eaca9ab53ece9a6d36b57d.png";

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#191c1e] text-[24px] w-full">
        <p className="leading-[32px]">Báo cáo chi tiết</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start relative size-full">
        <div className="bg-[#eceef0] h-[40px] relative rounded-[4px] shrink-0 w-[192px]" data-name="Background" />
        <div className="bg-[#eceef0] h-[40px] relative rounded-[4px] shrink-0 w-[192px]" data-name="Background" />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <div className="bg-[#f2f4f6] h-[64px] relative rounded-[4px] shrink-0 w-full" data-name="Background" />
        <div className="bg-[#f2f4f6] h-[64px] relative rounded-[4px] shrink-0 w-full" data-name="Background" />
        <div className="bg-[#f2f4f6] h-[64px] relative rounded-[4px] shrink-0 w-full" data-name="Background" />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] min-h-[600px] relative rounded-[8px] shrink-0 w-full" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border border-[#e0e3e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start min-h-[inherit] pb-[287px] pt-[25px] px-[25px] relative size-full">
        <Container />
        <Container1 />
      </div>
    </div>
  );
}

function MainContentPlaceholder() {
  return (
    <div className="bg-[#f7f9fb] blur-[2px] flex-[1_0_0] h-full min-w-px relative" data-name="Main Content Placeholder">
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[32px] relative size-full">
        <Heading />
        <BackgroundBorderShadow />
      </div>
    </div>
  );
}

function BackgroundContextBlurred() {
  return (
    <div className="absolute content-stretch flex inset-0 items-start justify-center pl-[260px]" data-name="Background Context (Blurred)">
      <MainContentPlaceholder />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#0037b0] content-stretch flex items-center justify-center pb-[12.5px] pt-[11.5px] relative rounded-[9999px] shrink-0 size-[40px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">L</p>
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[20px] text-white tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[28px]">Lò 101</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c4c5d7] text-[11px] tracking-[0.55px] uppercase whitespace-nowrap">
        <p className="leading-[16px]">ACTIVE PRODUCTION</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[126.06px]" data-name="Container">
      <Heading1 />
      <Container4 />
    </div>
  );
}

function Container2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[8px] relative size-full">
          <Background />
          <Container3 />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[16px] relative shrink-0 w-full" data-name="Margin">
      <Container2 />
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p20793584} fill="var(--fill-0, #C4C5D7)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c4c5d7] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Overview</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="flex h-[32.3px] items-center justify-center relative shrink-0 w-[216.6px]">
      <div className="flex-none scale-x-95 scale-y-95">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] w-[228px]" data-name="Link">
          <Container6 />
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function LinkCssTransform() {
  return (
    <div className="content-stretch flex flex-col items-start px-[5.7px] relative shrink-0 w-[228px]" data-name="Link:css-transform">
      <Link />
    </div>
  );
}

function Container8() {
  return (
    <div className="h-[14.15px] relative shrink-0 w-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 14.15">
        <g id="Container">
          <path d={svgPaths.p793b600} fill="var(--fill-0, #C4C5D7)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c4c5d7] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Live Feed</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="flex h-[30.4px] items-center justify-center relative shrink-0 w-[216.6px]">
      <div className="flex-none scale-x-95 scale-y-95">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] w-[228px]" data-name="Link">
          <Container8 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function LinkCssTransform1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[5.7px] relative shrink-0 w-[228px]" data-name="Link:css-transform">
      <Link1 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[18.506px] relative shrink-0 w-[18.032px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.0318 18.5059">
        <g id="Container">
          <path d={svgPaths.p1154e780} fill="var(--fill-0, #CAD3FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#cad3ff] text-[12px] tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[16px]">Tunnel Analytics</p>
        </div>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="flex h-[32.781px] items-center justify-center relative shrink-0 w-[216.6px]">
      <div className="flex-none scale-x-95 scale-y-95">
        <div className="bg-[#1d4ed8] content-stretch flex gap-[12px] items-center pl-[16px] pr-[12px] py-[8px] relative rounded-[8px] w-[228px]" data-name="Link">
          <div aria-hidden className="absolute border-[#0039b5] border-l-4 border-solid inset-0 pointer-events-none rounded-[8px]" />
          <Container10 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function LinkCssTransform2() {
  return (
    <div className="content-stretch flex flex-col items-start px-[5.7px] relative shrink-0 w-[228px]" data-name="Link:css-transform">
      <Link2 />
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[18.025px] relative shrink-0 w-[18.525px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18.525 18.025">
        <g id="Container">
          <path d={svgPaths.p3ce88680} fill="var(--fill-0, #C4C5D7)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c4c5d7] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Equipment</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="flex h-[32.324px] items-center justify-center relative shrink-0 w-[216.6px]">
      <div className="flex-none scale-x-95 scale-y-95">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] w-[228px]" data-name="Link">
          <Container12 />
          <Container13 />
        </div>
      </div>
    </div>
  );
}

function LinkCssTransform3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[5.7px] relative shrink-0 w-[228px]" data-name="Link:css-transform">
      <Link3 />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[20px] relative shrink-0 w-[16px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 20">
        <g id="Container">
          <path d={svgPaths.p2bdb86e0} fill="var(--fill-0, #C4C5D7)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c4c5d7] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Safety</p>
      </div>
    </div>
  );
}

function Link4() {
  return (
    <div className="flex h-[34.2px] items-center justify-center relative shrink-0 w-[216.6px]">
      <div className="flex-none scale-x-95 scale-y-95">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative rounded-[8px] w-[228px]" data-name="Link">
          <Container14 />
          <Container15 />
        </div>
      </div>
    </div>
  );
}

function LinkCssTransform4() {
  return (
    <div className="content-stretch flex flex-col items-start px-[5.7px] relative shrink-0 w-[228px]" data-name="Link:css-transform">
      <Link4 />
    </div>
  );
}

function Container5() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="content-stretch flex flex-col gap-[10px] items-start pb-[480px] pt-px relative size-full">
        <LinkCssTransform />
        <LinkCssTransform1 />
        <LinkCssTransform2 />
        <LinkCssTransform3 />
        <LinkCssTransform4 />
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#0037b0] content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex items-center justify-center py-[10px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[20px]">Generate Report</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p256c25e0} fill="var(--fill-0, #C4C5D7)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container17 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c4c5d7] text-[14px] tracking-[0.6px] whitespace-nowrap">
            <p className="leading-[20px]">Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 size-[13.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.5 13.5">
        <g id="Container">
          <path d={svgPaths.p2268c500} fill="var(--fill-0, #C4C5D7)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center px-[12px] py-[8px] relative size-full">
          <Container18 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c4c5d7] text-[14px] tracking-[0.6px] whitespace-nowrap">
            <p className="leading-[20px]">Logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pt-[17px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(63,70,92,0.5)] border-solid border-t inset-0 pointer-events-none" />
      <Link5 />
      <Link6 />
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-name="Container">
      <Button />
      <HorizontalBorder />
    </div>
  );
}

function SideNavPlaceholder() {
  return (
    <div className="absolute bg-[#2d3133] blur-[2px] content-stretch flex flex-col gap-[24px] h-[1024px] items-start left-0 px-[16px] py-[24px] top-0 w-[260px]" data-name="Side Nav Placeholder">
      <div className="absolute bg-[rgba(255,255,255,0)] h-[1024px] left-0 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] top-0 w-[260px]" data-name="Side Nav Placeholder:shadow" />
      <Margin />
      <Container5 />
      <Container16 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#191c1e] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">Lò 101 - Vận tải</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#ecfdf5] content-stretch flex gap-[6px] items-center px-[11px] py-[5px] relative rounded-[9999px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[#d1fae5] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#10b981] relative rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#047857] text-[11px] whitespace-nowrap">
        <p className="leading-[16.5px]">Bình thường</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full" data-name="Container">
      <Heading2 />
      <BackgroundBorder />
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Tổng cộng lũy kế</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-[281.47px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Container">
          <path d={svgPaths.p15494480} fill="var(--fill-0, #747686)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ButtonCloseModal() {
  return (
    <div className="relative rounded-[4px] shrink-0" data-name="Button - Close modal">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[10px] pt-[4px] px-[4px] relative size-full">
        <Container22 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex items-start justify-between pb-[25px] pt-[24px] px-[32px] relative size-full">
        <Container19 />
        <ButtonCloseModal />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] w-full">
          <p className="leading-[24px]">Tổng sản lượng (lũy kế)</p>
        </div>
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="relative shrink-0 w-full" data-name="Paragraph">
      <div className="[word-break:break-word] bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-baseline leading-[0] relative size-full whitespace-nowrap">
        <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#0037b0] text-[48px] tracking-[-0.96px]">
          <p className="leading-[57.6px]">1,440</p>
        </div>
        <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center not-italic relative shrink-0 text-[#434655] text-[16px]">
          <p className="leading-[24px]">tấn</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[#e0e3e5] border-r border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.5px] items-start pl-[32px] pr-[33px] py-[32px] relative size-full">
        <Container23 />
        <Paragraph />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] w-full">
        <p className="leading-[24px]">Tiến độ đào lò (lũy kế)</p>
      </div>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="[word-break:break-word] content-stretch flex gap-[8px] items-baseline leading-[0] relative shrink-0 w-full whitespace-nowrap" data-name="Paragraph">
      <div className="flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center relative shrink-0 text-[#f97316] text-[48px] tracking-[-0.96px]">
        <p className="leading-[57.6px]">92</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center not-italic relative shrink-0 text-[#434655] text-[16px]">
        <p className="leading-[24px]">mét</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[7.5px] items-start p-[32px] relative size-full">
        <Container25 />
        <Paragraph1 />
      </div>
    </div>
  );
}

function SummaryMetrics() {
  return (
    <div className="content-stretch flex items-start justify-center pb-px relative shrink-0 w-full" data-name="Summary Metrics">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <VerticalBorder />
      <Container24 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[16px]">SẢN LƯỢNG THEO NGÀY (TẤN)</p>
      </div>
    </div>
  );
}

function Heading3Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Heading 3:margin">
      <Heading3 />
    </div>
  );
}

function Image() {
  return (
    <div className="h-[150px] relative shrink-0 w-[464px]" data-name="image">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage} />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Image />
    </div>
  );
}

function LeftChartProduction() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Left Chart: Production">
      <Heading3Margin />
      <Container26 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[16px]">TIẾN ĐỘ ĐÀO LÒ THEO NGÀY (MÉT)</p>
      </div>
    </div>
  );
}

function Heading3Margin1() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[24px] relative shrink-0 w-full" data-name="Heading 3:margin">
      <Heading4 />
    </div>
  );
}

function Image1() {
  return (
    <div className="h-[150px] relative shrink-0 w-[464px]" data-name="image">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute left-0 max-w-none size-full top-0" src={imgImage1} />
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Image1 />
    </div>
  );
}

function RightChartProgress() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Right Chart: Progress">
      <Heading3Margin1 />
      <Container27 />
    </div>
  );
}

function ChartsSection() {
  return (
    <div className="bg-[#f7f9fb] relative shrink-0 w-full" data-name="Charts Section">
      <div className="flex flex-row justify-center size-full">
        <div className="content-stretch flex gap-[32px] items-start justify-center p-[32px] relative size-full">
          <LeftChartProduction />
          <RightChartProgress />
        </div>
      </div>
    </div>
  );
}

function ModalContainer() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start max-w-[1024px] overflow-clip relative rounded-[12px] shadow-[0px_12px_24px_-4px_rgba(0,0,0,0.1),0px_4px_8px_-2px_rgba(0,0,0,0.05)] shrink-0 w-[1024px]" data-name="Modal Container">
      <Header />
      <SummaryMetrics />
      <ChartsSection />
    </div>
  );
}

function OverlayModal() {
  return (
    <div className="absolute backdrop-blur-[1px] bg-[rgba(25,28,30,0.4)] content-stretch flex inset-0 items-center justify-center p-[16px]" data-name="Overlay & Modal">
      <ModalContainer />
    </div>
  );
}

export default function BaoCaoChiTitChiTitLo101LuyKHoanThin() {
  return (
    <div className="relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(247, 249, 251) 0%, rgb(247, 249, 251) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Báo cáo chi tiết - Chi tiết lò 101 (Lũy kế hoàn thiện)">
      <BackgroundContextBlurred />
      <SideNavPlaceholder />
      <OverlayModal />
    </div>
  );
}