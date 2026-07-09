import svgPaths from "./svg-mo5rjb4tqc";

function Heading1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#191c1e] text-[16px] w-full">
        <p className="leading-[24px]">Báo cáo tổng quan</p>
      </div>
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="h-[96px] relative shrink-0 w-full" data-name="Header - TopAppBar">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex items-end pb-[24px] px-[32px] relative size-full">
          <Heading1 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[24px]">SẢN LƯỢNG LŨY KẾ</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Cập nhật: 10:45 AM, Hôm nay</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[196.48px]" data-name="Container">
      <Heading2 />
      <Container2 />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <Container1 />
    </div>
  );
}

function Margin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">kế hoạch</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#1d4ed8] text-[16px] tracking-[-0.4px] whitespace-nowrap">
        <p className="leading-[24px]">88.8%</p>
      </div>
      <Margin2 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] w-full">
        <p>
          <span className="leading-[24px]">15,349</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic">{` `}</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic text-[#565e74]">/ 17,280 tấn</span>
        </p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <Container4 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex h-[80px] items-end justify-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#1d4ed8] h-[20px] relative rounded-[2px] shrink-0 w-[24px]" data-name="Background" />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T1</p>
      </div>
    </div>
  );
}

function BarsWithLabels() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center max-w-[40px] min-w-px relative" data-name="Bars with Labels">
      <Container5 />
      <Container6 />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-[-3.67px] not-italic text-[#1d4ed8] text-[10px] top-[-8.5px] whitespace-nowrap">
        <p className="leading-[15px]">2,500 tấn</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex h-[80px] items-end justify-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#1d4ed8] h-[32px] relative rounded-[2px] shrink-0 w-[24px]" data-name="Background" />
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T2</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center max-w-[40px] min-w-px relative" data-name="Container">
      <Container8 />
      <Container9 />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-[-3.72px] not-italic text-[#1d4ed8] text-[10px] top-[-8.5px] whitespace-nowrap">
        <p className="leading-[15px]">3,200 tấn</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex h-[80px] items-end justify-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#1d4ed8] h-[56px] relative rounded-[2px] shrink-0 w-[24px]" data-name="Background" />
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T3</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center max-w-[40px] min-w-px relative" data-name="Container">
      <Container11 />
      <Container12 />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-[-2.36px] not-italic text-[#1d4ed8] text-[10px] top-[-8.5px] whitespace-nowrap">
        <p className="leading-[15px]">4,100 tấn</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex h-[80px] items-end justify-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#1d4ed8] h-[68px] relative rounded-[2px] shrink-0 w-[24px]" data-name="Background" />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T4</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center max-w-[40px] min-w-px relative" data-name="Container">
      <Container14 />
      <Container15 />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-[-3.52px] not-italic text-[#1d4ed8] text-[10px] top-[-8.5px] whitespace-nowrap">
        <p className="leading-[15px]">5,500 tấn</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex h-[80px] items-end justify-center relative shrink-0 w-full" data-name="Container">
      <div className="bg-[#1d4ed8] h-[76px] relative rounded-[2px] shrink-0 w-[24px]" data-name="Background" />
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T5</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-center max-w-[40px] min-w-px relative" data-name="Container">
      <Container17 />
      <Container18 />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-[-5.59px] not-italic text-[#1d4ed8] text-[10px] top-[-8.5px] whitespace-nowrap">
        <p className="leading-[15px]">15,349 tấn</p>
      </div>
    </div>
  );
}

function BarChart() {
  return (
    <div className="h-[128px] relative shrink-0 w-full" data-name="Bar Chart">
      <div className="flex flex-row items-end size-full">
        <div className="content-stretch flex items-end justify-between pt-[24px] px-[16px] relative size-full">
          <div className="absolute bg-[rgba(226,232,240,0.3)] bottom-[24px] h-px left-0 right-0" data-name="Y-axis line subtle" />
          <BarsWithLabels />
          <Container7 />
          <Container10 />
          <Container13 />
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function BarChartMargin() {
  return (
    <div className="flex-[1_0_0] min-h-[128px] relative w-full" data-name="Bar Chart:margin">
      <div className="flex flex-col justify-end min-h-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-end min-h-[inherit] pt-[26px] relative size-full">
          <BarChart />
        </div>
      </div>
    </div>
  );
}

function Card1SnLngLuyK() {
  return (
    <div className="bg-white flex-[1_0_0] h-[320px] min-w-px relative rounded-[16px]" data-name="Card 1: Sản lượng lũy k">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[25px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] h-[320px] left-0 right-0 rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.02),0px_2px_4px_-1px_rgba(0,0,0,0.02)] top-0" data-name="Card 1: Sản lượng lũy k:shadow" />
        <Margin />
        <Margin1 />
        <Margin3 />
        <BarChartMargin />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] tracking-[0.8px] uppercase whitespace-nowrap">
        <p className="leading-[24px]">TIẾN ĐỘ ĐÀO LÒ LŨY KẾ</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Cập nhật: 10:30 AM, Hôm nay</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[207.09px]" data-name="Container">
      <Heading3 />
      <Container21 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <Container20 />
    </div>
  );
}

function Margin4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[8px] relative size-full">
        <Container19 />
      </div>
    </div>
  );
}

function Margin6() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Margin">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">kế hoạch</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#ea580c] text-[16px] tracking-[-0.4px] whitespace-nowrap">
        <p className="leading-[24px]">76.6%</p>
      </div>
      <Margin6 />
    </div>
  );
}

function Margin5() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[8px] relative size-full">
        <Container22 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] w-full">
        <p>
          <span className="leading-[24px]">720</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic">{` `}</span>
          <span className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic text-[#565e74]">/ 940 mét</span>
        </p>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-[4px] relative size-full">
        <Container23 />
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T1</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T2</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T3</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T4</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">T5</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute bottom-[24px] content-stretch flex h-[16px] items-start justify-between left-0 px-[16px] right-0" data-name="Container">
      <Container25 />
      <Container26 />
      <Container27 />
      <Container28 />
      <Container29 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[11.616px] left-[9.95px] top-[62.7px] w-[38.372px]" data-name="Text">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[11.616px] justify-center leading-[0] left-0 not-italic text-[#ea580c] text-[9.6px] top-[5.81px] w-[38.372px]">
        <p className="leading-[normal]">720 mét</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[11.616px] left-[99.5px] top-[43.5px] w-[39.412px]" data-name="Text">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[11.616px] justify-center leading-[0] left-0 not-italic text-[#ea580c] text-[9.6px] top-[5.81px] w-[39.412px]">
        <p className="leading-[normal]">300 mét</p>
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[11.616px] left-[199px] top-[24.3px] w-[39.206px]" data-name="Text">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[11.616px] justify-center leading-[0] left-0 not-italic text-[#ea580c] text-[9.6px] top-[5.81px] w-[39.206px]">
        <p className="leading-[normal]">450 mét</p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[11.616px] left-[298.5px] top-[5.1px] w-[39.45px]" data-name="Text">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[11.616px] justify-center leading-[0] left-0 not-italic text-[#ea580c] text-[9.6px] top-[5.81px] w-[39.45px]">
        <p className="leading-[normal]">600 mét</p>
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[11.616px] left-[378.1px] top-[-4.5px] w-[38.372px]" data-name="Text">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[11.616px] justify-center leading-[0] left-0 not-italic text-[#ea580c] text-[9.6px] top-[5.81px] w-[38.372px]">
        <p className="leading-[normal]">720 mét</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="absolute inset-[8px_0_24px_0] overflow-clip" data-name="SVG">
      <div className="absolute inset-[90%_0_10%_0]" data-name="Vector">
        <div className="absolute inset-[-0.49px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 398 0.9775">
            <g id="Vector">
              <path d="M0 0.48875H398H0" fill="var(--fill-0, black)" />
              <path d="M0 0.48875H398H0" stroke="var(--stroke-0, #E2E8F0)" strokeWidth="0.9775" />
            </g>
          </svg>
        </div>
      </div>
      <div className="absolute inset-[10%_2.5%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 378.1 76.8">
          <path d={svgPaths.p1c342d00} fill="url(#paint0_linear_6_1426)" id="Vector" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_6_1426" x1="0" x2="0" y1="0" y2="76.8">
              <stop stopColor="#EA580C" stopOpacity="0.2" />
              <stop offset="1" stopColor="#EA580C" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute inset-[10%_2.5%_15%_2.5%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 378.1 72">
          <path d={svgPaths.p2dbb7100} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[80%_96.25%_10%_1.25%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.95 9.6">
          <path d={svgPaths.p16960b00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[60%_73.75%_30%_23.75%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.95 9.6">
          <path d={svgPaths.p16960b00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute bottom-1/2 left-[48.75%] right-[48.75%] top-[40%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.95 9.6">
          <path d={svgPaths.p16960b00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[20%_23.75%_70%_73.75%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.95 9.6">
          <path d={svgPaths.p16960b00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[5%_1.25%_85%_96.25%]" data-name="Vector">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.95 9.6">
          <path d={svgPaths.p16960b00} fill="var(--fill-0, black)" id="Vector" />
        </svg>
      </div>
      <Text />
      <Text1 />
      <Text2 />
      <Text3 />
      <Text4 />
    </div>
  );
}

function LineChartSvg() {
  return (
    <div className="h-[128px] relative shrink-0 w-full" data-name="Line Chart (SVG)">
      <Container24 />
      <Svg />
    </div>
  );
}

function LineChartSvgMargin() {
  return (
    <div className="flex-[1_0_0] min-h-[128px] relative w-full" data-name="Line Chart (SVG):margin">
      <div className="flex flex-col justify-end min-h-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-end min-h-[inherit] pt-[26px] relative size-full">
          <LineChartSvg />
        </div>
      </div>
    </div>
  );
}

function Card2TinDDaoLoLuyK() {
  return (
    <div className="bg-white flex-[1_0_0] h-[320px] min-w-px relative rounded-[16px]" data-name="Card 2: Tiến độ đào lò lũy k">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col items-start justify-between p-[25px] relative size-full">
        <div className="absolute bg-[rgba(255,255,255,0)] h-[320px] left-0 right-0 rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.02),0px_2px_4px_-1px_rgba(0,0,0,0.02)] top-0" data-name="Card 2: Tiến độ đào lò lũy k:shadow" />
        <Margin4 />
        <Margin5 />
        <Margin7 />
        <LineChartSvgMargin />
      </div>
    </div>
  );
}

function TopRowCards() {
  return (
    <div className="content-stretch flex gap-[24px] items-start justify-center relative shrink-0 w-full" data-name="Top Row Cards">
      <Card1SnLngLuyK />
      <Card2TinDDaoLoLuyK />
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[19px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
        <g id="Container">
          <path d={svgPaths.p7555480} fill="var(--fill-0, #D97706)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Heading4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#191c1e] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Cảnh báo hệ thống</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex items-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">2 nghiêm trọng</p>
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[8px] relative shrink-0" data-name="Margin">
      <Container32 />
    </div>
  );
}

function Container30() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container31 />
        <Heading4 />
        <Margin8 />
      </div>
    </div>
  );
}

function CardHeader() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Card Header">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.6)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[21px] pt-[20px] px-[24px] relative size-full">
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="relative shrink-0 w-[79.72px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[28.5px] pt-[28px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">STT</p>
        </div>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="relative shrink-0 w-[229.5px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[28.5px] pt-[28px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Đường lò</p>
        </div>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="relative shrink-0 w-[367.19px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[28.5px] pt-[28px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Nội dung cảnh báo</p>
        </div>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="relative shrink-0 w-[131.2px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[28.5px] pt-[28px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Loại</p>
        </div>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="relative shrink-0 w-[110.39px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[16px] whitespace-nowrap">
          <p className="leading-[24px] mb-0">Trạng</p>
          <p className="leading-[24px]">thái</p>
        </div>
      </div>
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="bg-[rgba(248,250,252,0.5)] content-stretch flex items-start justify-center mb-[-1px] pb-px relative shrink-0 w-full" data-name="Header → Row">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.6)] border-b border-solid inset-0 pointer-events-none" />
      <Cell />
      <Cell1 />
      <Cell2 />
      <Cell3 />
      <Cell4 />
    </div>
  );
}

function Data() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[31px] pt-[30px] px-[24px] relative shrink-0 w-[79.72px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">01</p>
      </div>
    </div>
  );
}

function Data1() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[28.5px] relative shrink-0 w-[229.5px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] whitespace-nowrap">
        <p className="leading-[24px]">Khu vực Lò thượng</p>
      </div>
    </div>
  );
}

function Data2() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[24px] pr-[32px] py-[16.5px] relative shrink-0 w-[367.19px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] whitespace-nowrap">
        <p className="leading-[24px] mb-0">Nồng độ khí CH4 vượt mức cho phép</p>
        <p className="leading-[24px]">{`(>1.5%) tại gương lò`}</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pl-[12px] pr-[16.95px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="h-[6px] relative rounded-[9999px] shrink-0 w-[3.78px]" data-name="Rectangle" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Nghiêm</p>
        <p className="leading-[16px]">trọng</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative shrink-0 w-[131.2px]" data-name="Data">
      <Container33 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex items-center pl-[12px] pr-[20px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Đang</p>
        <p className="leading-[16px]">xử lý</p>
      </div>
    </div>
  );
}

function Data4() {
  return (
    <div className="content-stretch flex flex-col items-start px-[24px] py-[18.5px] relative shrink-0 w-[110.39px]" data-name="Data">
      <Container34 />
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] relative shrink-0 w-full" data-name="Row 1">
      <Data />
      <Data1 />
      <Data2 />
      <Data3 />
      <Data4 />
    </div>
  );
}

function Data5() {
  return (
    <div className="relative shrink-0 w-[79.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[37px] pt-[36px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">02</p>
        </div>
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="relative shrink-0 w-[229.5px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[22.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] whitespace-nowrap">
          <p className="leading-[24px] mb-0">Phân xưởng Khai thác</p>
          <p className="leading-[24px]">5</p>
        </div>
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[367.19px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[24px] pr-[32px] py-[22.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] whitespace-nowrap">
          <p className="leading-[24px] mb-0">Áp lực thông gió giảm dưới mức tối thiểu</p>
          <p className="leading-[24px]">tại gương lò</p>
        </div>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pl-[12px] pr-[16.95px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="h-[6px] relative rounded-[9999px] shrink-0 w-[3.78px]" data-name="Rectangle" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Nghiêm</p>
        <p className="leading-[16px]">trọng</p>
      </div>
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[131.2px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[24.5px] relative size-full">
        <Container35 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex items-center pl-[12px] pr-[21.91px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Chờ</p>
        <p className="leading-[16px] mb-0">tiếp</p>
        <p className="leading-[16px]">nhận</p>
      </div>
    </div>
  );
}

function Data9() {
  return (
    <div className="relative shrink-0 w-[110.39px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative size-full">
        <Container36 />
      </div>
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Row 2">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.4)] border-solid border-t inset-0 pointer-events-none" />
      <Data5 />
      <Data6 />
      <Data7 />
      <Data8 />
      <Data9 />
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[79.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[37px] pt-[36px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">03</p>
        </div>
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[229.5px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[34.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Đường lò vận tải số 2</p>
        </div>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="relative shrink-0 w-[367.19px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[24px] pr-[32px] py-[22.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] whitespace-nowrap">
          <p className="leading-[24px] mb-0">Băng tải số 3 có dấu hiệu quá nhiệt động</p>
          <p className="leading-[24px]">cơ chính</p>
        </div>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pl-[12px] pr-[29.89px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="h-[6px] relative rounded-[9999px] shrink-0 w-[5.25px]" data-name="Rectangle" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Cảnh</p>
        <p className="leading-[16px]">báo</p>
      </div>
    </div>
  );
}

function Data13() {
  return (
    <div className="relative shrink-0 w-[131.2px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[24.5px] relative size-full">
        <Container37 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex items-center pl-[12px] pr-[21.91px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Chờ</p>
        <p className="leading-[16px] mb-0">tiếp</p>
        <p className="leading-[16px]">nhận</p>
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="relative shrink-0 w-[110.39px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative size-full">
        <Container38 />
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Row 3">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.4)] border-solid border-t inset-0 pointer-events-none" />
      <Data10 />
      <Data11 />
      <Data12 />
      <Data13 />
      <Data14 />
    </div>
  );
}

function Data15() {
  return (
    <div className="relative shrink-0 w-[79.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[37px] pt-[36px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">04</p>
        </div>
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="relative shrink-0 w-[229.5px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[34.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Vỉa 12 - Tây mỏ</p>
        </div>
      </div>
    </div>
  );
}

function Data17() {
  return (
    <div className="relative shrink-0 w-[367.19px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pl-[24px] pr-[32px] py-[22.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] whitespace-nowrap">
          <p className="leading-[24px] mb-0">Mất kết nối cảm biến áp suất thủy lực</p>
          <p className="leading-[24px]">chân lò</p>
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pl-[12px] pr-[29.89px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="h-[6px] relative rounded-[9999px] shrink-0 w-[5.25px]" data-name="Rectangle" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Cảnh</p>
        <p className="leading-[16px]">báo</p>
      </div>
    </div>
  );
}

function Data18() {
  return (
    <div className="relative shrink-0 w-[131.2px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[24.5px] relative size-full">
        <Container39 />
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex items-center pl-[12px] pr-[17.81px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Đã</p>
        <p className="leading-[16px] mb-0">hoàn</p>
        <p className="leading-[16px]">thành</p>
      </div>
    </div>
  );
}

function Data19() {
  return (
    <div className="relative shrink-0 w-[110.39px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16.5px] relative size-full">
        <Container40 />
      </div>
    </div>
  );
}

function Row3() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] pt-px relative shrink-0 w-full" data-name="Row 4">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.4)] border-solid border-t inset-0 pointer-events-none" />
      <Data15 />
      <Data16 />
      <Data17 />
      <Data18 />
      <Data19 />
    </div>
  );
}

function Data20() {
  return (
    <div className="relative shrink-0 w-[79.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[30.5px] pt-[30px] px-[24px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">05</p>
        </div>
      </div>
    </div>
  );
}

function Data21() {
  return (
    <div className="relative shrink-0 w-[229.5px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[24px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] whitespace-nowrap">
          <p className="leading-[24px] mb-0">Trạm bơm nước ngầm</p>
          <p className="leading-[24px]">B3</p>
        </div>
      </div>
    </div>
  );
}

function Data22() {
  return (
    <div className="relative shrink-0 w-[367.19px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[28px] pl-[24px] pr-[32px] pt-[28.5px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] whitespace-nowrap">
          <p className="leading-[24px]">Mực nước hầm vượt mức cảnh báo cấp 2</p>
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex gap-[6px] items-center pl-[12px] pr-[29.89px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="h-[6px] relative rounded-[9999px] shrink-0 w-[5.25px]" data-name="Rectangle" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Cảnh</p>
        <p className="leading-[16px]">báo</p>
      </div>
    </div>
  );
}

function Data23() {
  return (
    <div className="relative shrink-0 w-[131.2px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[18px] pt-[18.5px] px-[24px] relative size-full">
        <Container41 />
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex items-center pl-[12px] pr-[20px] py-[6px] relative rounded-[9999px] shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Đang</p>
        <p className="leading-[16px]">xử lý</p>
      </div>
    </div>
  );
}

function Data24() {
  return (
    <div className="relative shrink-0 w-[110.39px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[18px] pt-[18.5px] px-[24px] relative size-full">
        <Container42 />
      </div>
    </div>
  );
}

function Row4() {
  return (
    <div className="content-stretch flex items-start justify-center pt-px relative shrink-0 w-full" data-name="Row 5">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.4)] border-solid border-t inset-0 pointer-events-none" />
      <Data20 />
      <Data21 />
      <Data22 />
      <Data23 />
      <Data24 />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Body">
      <Row />
      <Row1 />
      <Row2 />
      <Row3 />
      <Row4 />
    </div>
  );
}

function TableTable() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table → Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <HeaderRow />
        <Body />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Trang 1 / 2</p>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[13px] py-[7px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#565e74] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Trước</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#1d4ed8] content-stretch flex items-center justify-center pb-[6.5px] pt-[5.5px] relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">1</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex items-center justify-center pb-[6.5px] pt-[5.5px] px-px relative rounded-[4px] shrink-0 size-[32px]" data-name="Button">
      <div aria-hidden className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">2</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[13px] py-[7px] relative rounded-[4px] shrink-0" data-name="Button">
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Sau</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Button />
        <Button1 />
        <Button2 />
        <Button3 />
      </div>
    </div>
  );
}

function Pagination() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Pagination">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.6)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-[16px] pt-[17px] px-[24px] relative size-full">
          <Container43 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function WarningTableCard() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Warning Table Card">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <CardHeader />
        <TableTable />
        <Pagination />
      </div>
      <div aria-hidden className="absolute border border-[#e2e8f0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.02),0px_2px_4px_-1px_rgba(0,0,0,0.02)]" />
    </div>
  );
}

function ContentCanvas() {
  return (
    <div className="relative shrink-0 w-full" data-name="Content Canvas">
      <div className="content-stretch flex flex-col gap-[24px] items-start pb-[48px] px-[32px] relative size-full">
        <TopRowCards />
        <WarningTableCard />
      </div>
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="content-stretch flex flex-col items-start min-h-[1097px] relative shrink-0 w-full" data-name="Main Content Area">
      <HeaderTopAppBar />
      <ContentCanvas />
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#1d4ed8] content-stretch flex items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[4px] shrink-0 size-[40px]" data-name="Background">
      <div className="-translate-y-1/2 absolute bg-[rgba(255,255,255,0)] left-0 rounded-[4px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[40px] top-1/2" data-name="Overlay+Shadow" />
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">N</p>
      </div>
    </div>
  );
}

function Margin9() {
  return (
    <div className="h-[40px] relative shrink-0 w-[52px]" data-name="Margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pr-[12px] relative size-full">
        <Background />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#f7f9fb] text-[16px] whitespace-nowrap">
        <p className="leading-[16px]">Núi Béo</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start opacity-80 relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Hệ thống quản lý sản xuất</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-[147.92px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading />
        <Container46 />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="relative shrink-0 w-full" data-name="Header">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[33px] pt-[32px] px-[24px] relative size-full">
          <Margin9 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Margin10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[32px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 20">
        <g id="Margin">
          <path d={svgPaths.p11fdd840} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container47() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[129.67px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-0 not-italic text-[#bec6e0] text-[15px] top-[10.5px] whitespace-nowrap">
        <p className="leading-[22.5px]">Nhập báo cáo mới</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="absolute content-stretch flex items-center left-0 px-[24px] py-[14px] right-0 top-[24px]" data-name="Link">
      <Margin10 />
      <Container47 />
    </div>
  );
}

function Margin11() {
  return (
    <div className="h-[18px] relative shrink-0 w-[34px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 18">
        <g id="Margin">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[110.08px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-0 not-italic text-[#bec6e0] text-[15px] top-[10.5px] whitespace-nowrap">
        <p className="leading-[22.5px]">Báo cáo chi tiết</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[24px] py-[14px] relative size-full">
          <Margin11 />
          <Container48 />
        </div>
      </div>
    </div>
  );
}

function LinkMargin() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[4px] right-0 top-[132px]" data-name="Link:margin">
      <Link1 />
    </div>
  );
}

function Margin12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[32px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 20">
        <g id="Margin">
          <path d={svgPaths.p164b49c0} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[143.33px]" data-name="Container">
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] left-0 not-italic text-[#bec6e0] text-[15px] top-[10.5px] whitespace-nowrap">
        <p className="leading-[22.5px]">Trung tâm cảnh báo</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Margin12 />
      <Container50 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#ba1a1a] content-stretch flex flex-col items-start px-[8px] py-[2px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
        <p className="leading-[16px]">2</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[14px] relative size-full">
          <Container49 />
          <Background1 />
        </div>
      </div>
    </div>
  );
}

function LinkMargin1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[4px] right-0 top-[188px]" data-name="Link:margin">
      <Link2 />
    </div>
  );
}

function Margin13() {
  return (
    <div className="h-[18px] relative shrink-0 w-[34px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34 18">
        <g id="Margin">
          <path d={svgPaths.p186f5ba0} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[22.5px] relative shrink-0 w-[135.72px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] left-0 not-italic text-[15px] text-white top-[10.5px] whitespace-nowrap">
          <p className="leading-[22.5px]">Báo cáo tổng quan</p>
        </div>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="bg-[#1d4ed8] relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center pl-[28px] pr-[24px] py-[14px] relative size-full">
          <Margin13 />
          <Container51 />
          <div className="absolute bg-[rgba(255,255,255,0.1)] inset-[0_0_-0.5px_4px] opacity-0" data-name="Overlay" />
        </div>
      </div>
      <div aria-hidden className="absolute border-[#f7f9fb] border-l-4 border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function LinkMargin2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pt-[4px] right-0 top-[76px]" data-name="Link:margin">
      <Link3 />
    </div>
  );
}

function NavigationLinks() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Navigation Links">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Link />
        <LinkMargin />
        <LinkMargin1 />
        <LinkMargin2 />
      </div>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,255,255,0.1)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f7f9fb] text-[16px] text-center whitespace-nowrap">
        <p className="leading-[24px]">A</p>
      </div>
    </div>
  );
}

function Margin14() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pr-[12px] relative shrink-0 w-[44px]" data-name="Margin">
      <Overlay />
    </div>
  );
}

function Container53() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[14px] whitespace-nowrap">
        <p className="leading-[21px]">Nguyễn Văn A</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Margin14 />
      <Container53 />
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p3e9df400} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Link4() {
  return (
    <div className="relative shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between px-[24px] py-[20px] relative size-full">
          <Container52 />
          <Container54 />
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Footer">
      <div aria-hidden className="absolute border-[rgba(255,255,255,0.05)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pt-px relative size-full">
        <Link4 />
      </div>
    </div>
  );
}

function SideNavBar() {
  return (
    <div className="absolute bg-[#2d3133] content-stretch flex flex-col h-[1097px] items-start justify-between left-0 pr-px top-0 w-[260px]" data-name="SideNavBar">
      <div aria-hidden className="absolute border-[rgba(226,232,240,0.1)] border-r border-solid inset-0 pointer-events-none" />
      <Header />
      <NavigationLinks />
      <Footer />
    </div>
  );
}

function Container55() {
  return (
    <div className="h-[19px] relative shrink-0 w-[10.9px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.9 19">
        <g id="Container">
          <path d={svgPaths.p29464e00} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function FloatingActionButtonHelp() {
  return (
    <div className="absolute bg-[#2d3133] bottom-[78px] content-stretch flex items-center justify-center right-[32px] rounded-[9999px] size-[48px]" data-name="Floating Action Button (Help)">
      <div className="absolute bg-[rgba(255,255,255,0)] bottom-0 right-0 rounded-[9999px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[48px]" data-name="Floating Action Button (Help):shadow" />
      <Container55 />
    </div>
  );
}

export default function BaoCaoTngQuanChiTitBiuD() {
  return (
    <div className="content-stretch flex flex-col items-start pl-[260px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 250, 252) 0%, rgb(248, 250, 252) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Báo cáo tổng quan - Chi tiết biểu đồ">
      <MainContentArea />
      <SideNavBar />
      <FloatingActionButtonHelp />
    </div>
  );
}