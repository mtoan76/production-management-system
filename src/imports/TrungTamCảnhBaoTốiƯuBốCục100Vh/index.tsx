import svgPaths from "./svg-2ebun1nx7y";

function HeaderHeading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Header → Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#191c1e] text-[24px] w-full">
        <p className="leading-[32px]">Trung tâm cảnh báo</p>
      </div>
    </div>
  );
}

function HeaderMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[32px] relative shrink-0 w-full" data-name="Header:margin">
      <HeaderHeading />
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Container">
          <path d={svgPaths.p30837e80} fill="var(--fill-0, #0037B0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(218,226,253,0.3)] relative rounded-[8px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[12px] relative size-full">
        <Container />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Tổng cảnh báo</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#0037b0] text-[48px] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[57.6px]">7</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Trong 7 ngày qua</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-[98.89px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container2 />
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function TotalAlerts() {
  return (
    <div className="bg-white drop-shadow-[0px_4px_2px_rgba(0,0,0,0.02)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Total Alerts">
      <div aria-hidden className="absolute border border-[#e0e3e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex gap-[16px] items-start p-[25px] relative size-full">
        <Overlay />
        <Container1 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p28843fc0} fill="var(--fill-0, #BA1A1A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(255,218,214,0.3)] relative rounded-[8px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[12px] relative size-full">
        <Container5 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Nghiêm trọng</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#ba1a1a] text-[48px] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[57.6px]">2</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Cần xử lý ngay</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-[85.5px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container7 />
        <Container8 />
        <Container9 />
      </div>
    </div>
  );
}

function Critical() {
  return (
    <div className="bg-white drop-shadow-[0px_4px_2px_rgba(0,0,0,0.02)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Critical">
      <div aria-hidden className="absolute border border-[#e0e3e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex gap-[16px] items-start p-[25px] relative size-full">
        <Overlay1 />
        <Container6 />
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[19px] relative shrink-0 w-[22px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 19">
        <g id="Container">
          <path d={svgPaths.p7555480} fill="var(--fill-0, #A73400)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay2() {
  return (
    <div className="bg-[rgba(167,52,0,0.1)] relative rounded-[8px] shrink-0" data-name="Overlay">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[12px] relative size-full">
        <Container10 />
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Cảnh báo</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#a73400] text-[48px] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[57.6px]">5</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Đang theo dõi</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 w-[79.42px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container12 />
        <Container13 />
        <Container14 />
      </div>
    </div>
  );
}

function Warning() {
  return (
    <div className="bg-white drop-shadow-[0px_4px_2px_rgba(0,0,0,0.02)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Warning">
      <div aria-hidden className="absolute border border-[#e0e3e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex gap-[16px] items-start p-[25px] relative size-full">
        <Overlay2 />
        <Container11 />
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p1caa9380} fill="var(--fill-0, #137333)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#e6f4ea] relative rounded-[8px] shrink-0" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[12px] relative size-full">
        <Container15 />
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Đã xử lý</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#137333] text-[48px] tracking-[-0.96px] whitespace-nowrap">
        <p className="leading-[57.6px]">2</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Tỉ lệ 29%</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="relative shrink-0 w-[53.86px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Container17 />
        <Container18 />
        <Container19 />
      </div>
    </div>
  );
}

function Resolved() {
  return (
    <div className="bg-white drop-shadow-[0px_4px_2px_rgba(0,0,0,0.02)] flex-[1_0_0] min-w-px relative rounded-[8px]" data-name="Resolved">
      <div aria-hidden className="absolute border border-[#e0e3e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex gap-[16px] items-start p-[25px] relative size-full">
        <Background />
        <Container16 />
      </div>
    </div>
  );
}

function SummaryCards4Grid() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-full" data-name="Summary Cards (4 Grid)">
      <TotalAlerts />
      <Critical />
      <Warning />
      <Resolved />
    </div>
  );
}

function SummaryCards4GridMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[32px] relative shrink-0 w-full" data-name="Summary Cards (4 Grid):margin">
      <SummaryCards4Grid />
    </div>
  );
}

function Container22() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[14px] w-full">
          <p className="leading-[normal]">Tìm kiếm cảnh báo...</p>
        </div>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f7f9fb] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-center pb-[11px] pl-[41px] pr-[17px] pt-[10px] relative size-full">
          <Container22 />
        </div>
      </div>
      <div aria-hidden className="absolute border border-[#c4c5d7] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute bottom-[23.68%] content-stretch flex flex-col items-start left-[12px] top-[23.68%]" data-name="Container">
      <div className="relative shrink-0 size-[15px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
          <path d={svgPaths.p2dbaedc0} fill="var(--fill-0, #747686)" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[256px]" data-name="Container">
      <Input />
      <Container23 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center px-[16px] py-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Tất cả</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Nghiêm trọng</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Cảnh báo</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center px-[16px] py-[6px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[20px]">Bình thường</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#eceef0] content-stretch flex items-start p-[4px] relative rounded-[8px] shrink-0" data-name="Background">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Container20() {
  return (
    <div className="flex-[1_0_0] min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container21 />
        <Background1 />
      </div>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="relative shrink-0 w-full" data-name="Toolbar">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[25px] pt-[24px] px-[24px] relative size-full">
          <Container20 />
        </div>
      </div>
    </div>
  );
}

function Cell() {
  return (
    <div className="relative shrink-0 w-[86.72px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[13px] whitespace-nowrap">
          <p className="leading-[18px]">Thời gian</p>
        </div>
      </div>
    </div>
  );
}

function Cell1() {
  return (
    <div className="relative shrink-0 w-[165.11px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[13px] whitespace-nowrap">
          <p className="leading-[18px]">Vị trí</p>
        </div>
      </div>
    </div>
  );
}

function Cell2() {
  return (
    <div className="relative shrink-0 w-[286.19px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[13px] whitespace-nowrap">
          <p className="leading-[18px]">Nội dung</p>
        </div>
      </div>
    </div>
  );
}

function Cell3() {
  return (
    <div className="relative shrink-0 w-[131.09px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[13px] whitespace-nowrap">
          <p className="leading-[18px]">Loại cảnh báo</p>
        </div>
      </div>
    </div>
  );
}

function Cell4() {
  return (
    <div className="relative shrink-0 w-[119.53px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[13px] whitespace-nowrap">
          <p className="leading-[18px]">Trạng thái</p>
        </div>
      </div>
    </div>
  );
}

function Cell5() {
  return (
    <div className="relative shrink-0 w-[165.36px]" data-name="Cell">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[13px] whitespace-nowrap">
          <p className="leading-[18px]">Người xử lý</p>
        </div>
      </div>
    </div>
  );
}

function Row() {
  return (
    <div className="absolute content-stretch flex items-start justify-center left-0 pb-px right-0 top-0" data-name="Row">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <Cell />
      <Cell1 />
      <Cell2 />
      <Cell3 />
      <Cell4 />
      <Cell5 />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white h-[50.5px] relative shrink-0 w-full z-[2]" data-name="Header">
      <Row />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] w-full">
        <p className="leading-[20px]">14:22:15</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] w-full">
        <p className="leading-[16px]">15/10/2023</p>
      </div>
    </div>
  );
}

function Data() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 pb-[18.5px] pt-[16.5px] px-[12px] right-[867.28px] top-0" data-name="Data">
      <Container24 />
      <Container25 />
    </div>
  );
}

function Data1() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[86.72px] pb-[39px] pt-[16px] px-[12px] right-[702.17px] top-0" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Lò thượng - Vỉa 14</p>
      </div>
    </div>
  );
}

function Data2() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[251.83px] pb-[39px] pl-[12px] pr-[32px] pt-[16px] right-[415.98px] top-0" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Nồng độ khí CH4 vượt mức</p>
      </div>
    </div>
  );
}

function OverlayBorder() {
  return (
    <div className="bg-[rgba(255,218,214,0.3)] content-stretch flex gap-[5.99px] items-center pl-[11px] pr-[40px] py-[5px] relative rounded-[9999px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(186,26,26,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#ba1a1a] h-[6px] relative rounded-[9999px] shrink-0 w-[5.63px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ba1a1a] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Nghiêm</p>
        <p className="leading-[16px]">trọng</p>
      </div>
    </div>
  );
}

function Data3() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[538.02px] px-[12px] py-[16.5px] right-[284.89px] top-0" data-name="Data">
      <OverlayBorder />
    </div>
  );
}

function Overlay3() {
  return (
    <div className="bg-[rgba(218,226,253,0.4)] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0037b0] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Đang xử lý</p>
      </div>
    </div>
  );
}

function Data4() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[669.11px] pb-[34.5px] pt-[16.5px] px-[12px] right-[165.36px] top-0" data-name="Data">
      <Overlay3 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#0d652d] content-stretch flex h-[24px] items-center justify-center relative rounded-[9999px] shrink-0 w-[22.27px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">VP</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[37.7px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Hoàng Văn</p>
        <p className="leading-[20px]">Phong</p>
      </div>
    </div>
  );
}

function Data5() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[800.64px] right-[12px] top-[16.5px]" data-name="Data">
      <Background2 />
      <Container26 />
    </div>
  );
}

function Row1() {
  return (
    <div className="h-[75px] mb-[-1px] relative shrink-0 w-full" data-name="Row 1">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <Data />
      <Data1 />
      <Data2 />
      <Data3 />
      <Data4 />
      <Data5 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] w-full">
        <p className="leading-[20px]">13:50:02</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] w-full">
        <p className="leading-[16px]">15/10/2023</p>
      </div>
    </div>
  );
}

function Data6() {
  return (
    <div className="relative shrink-0 w-[86.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[16.5px] relative size-full">
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function Data7() {
  return (
    <div className="relative shrink-0 w-[165.11px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[37px] pt-[16px] px-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Đường lò vận tải 2</p>
        </div>
      </div>
    </div>
  );
}

function Data8() {
  return (
    <div className="relative shrink-0 w-[286.19px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[37px] pl-[12px] pr-[32px] pt-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Băng tải số 3 quá nhiệt</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#fff8e1] content-stretch flex gap-[6px] items-center px-[11px] py-[5px] relative rounded-[9999px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(245,127,23,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#f57f17] relative rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f57f17] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Cảnh báo</p>
      </div>
    </div>
  );
}

function Data9() {
  return (
    <div className="relative shrink-0 w-[131.09px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[30.5px] pt-[16.5px] px-[12px] relative size-full">
        <BackgroundBorder />
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#e6e8ea] content-stretch flex items-start pl-[10px] pr-[37.51px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Chờ tiếp</p>
        <p className="leading-[16px]">nhận</p>
      </div>
    </div>
  );
}

function Data10() {
  return (
    <div className="relative shrink-0 w-[119.53px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[16.5px] relative size-full">
        <Background3 />
      </div>
    </div>
  );
}

function Data11() {
  return (
    <div className="relative shrink-0 w-[165.36px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[41px] pt-[16px] px-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Chưa phân công</p>
        </div>
      </div>
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] py-px relative shrink-0 w-full" data-name="Row 2">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <Data6 />
      <Data7 />
      <Data8 />
      <Data9 />
      <Data10 />
      <Data11 />
    </div>
  );
}

function Container29() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] w-full">
        <p className="leading-[20px]">11:15:30</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] w-full">
        <p className="leading-[16px]">15/10/2023</p>
      </div>
    </div>
  );
}

function Data12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 px-[12px] py-[16.5px] right-[867.28px] top-0" data-name="Data">
      <Container29 />
      <Container30 />
    </div>
  );
}

function Data13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[86.72px] pb-[37px] pt-[16px] px-[12px] right-[702.17px] top-0" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Vỉa 12 - Tây mỏ</p>
      </div>
    </div>
  );
}

function Data14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[251.83px] pb-[37px] pl-[12px] pr-[32px] pt-[16px] right-[415.98px] top-0" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Mất kết nối cảm biến áp suất</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#fff8e1] content-stretch flex gap-[6px] items-center px-[11px] py-[5px] relative rounded-[9999px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(245,127,23,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#f57f17] relative rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f57f17] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Cảnh báo</p>
      </div>
    </div>
  );
}

function Data15() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[538.02px] pb-[30.5px] pt-[16.5px] px-[12px] right-[284.89px] top-0" data-name="Data">
      <BackgroundBorder1 />
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#e6f4ea] content-stretch flex items-start pl-[10px] pr-[37.97px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#137333] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Đã hoàn</p>
        <p className="leading-[16px]">thành</p>
      </div>
    </div>
  );
}

function Data16() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[669.11px] px-[12px] py-[16.5px] right-[165.36px] top-0" data-name="Data">
      <Background4 />
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#6a1b9a] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[24px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">LN</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Lê Nam</p>
      </div>
    </div>
  );
}

function Data17() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[800.64px] right-[12px] top-[16.5px]" data-name="Data">
      <Background5 />
      <Container31 />
    </div>
  );
}

function Row3() {
  return (
    <div className="h-[73px] mb-[-1px] relative shrink-0 w-full" data-name="Row 3">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <Data12 />
      <Data13 />
      <Data14 />
      <Data15 />
      <Data16 />
      <Data17 />
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] w-full">
        <p className="leading-[20px]">10:05:00</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] w-full">
        <p className="leading-[16px]">15/10/2023</p>
      </div>
    </div>
  );
}

function Data18() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 px-[12px] py-[16.5px] right-[867.28px] top-px" data-name="Data">
      <Container32 />
      <Container33 />
    </div>
  );
}

function Data19() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[86.72px] pb-[37px] pt-[16px] px-[12px] right-[702.17px] top-px" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Trạm phát điện 1</p>
      </div>
    </div>
  );
}

function Data20() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[251.83px] pb-[17px] pl-[12px] pr-[32px] pt-[16px] right-[415.98px] top-px" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Cập nhật phần mềm hệ thống định</p>
        <p className="leading-[20px]">kỳ</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#e6f4ea] content-stretch flex gap-[6px] items-center px-[11px] py-[5px] relative rounded-[9999px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(19,115,51,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#137333] relative rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#137333] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Bình thường</p>
      </div>
    </div>
  );
}

function Data21() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[538.02px] pb-[30.5px] pt-[16.5px] px-[12px] right-[284.89px] top-px" data-name="Data">
      <BackgroundBorder2 />
    </div>
  );
}

function Background6() {
  return (
    <div className="bg-[#e6f4ea] content-stretch flex items-start pl-[10px] pr-[37.97px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#137333] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Đã hoàn</p>
        <p className="leading-[16px]">thành</p>
      </div>
    </div>
  );
}

function Data22() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[669.11px] px-[12px] py-[16.5px] right-[165.36px] top-px" data-name="Data">
      <Background6 />
    </div>
  );
}

function Background7() {
  return (
    <div className="bg-[#0037b0] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[24px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">TV</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Trần Văn A</p>
      </div>
    </div>
  );
}

function Data23() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[800.64px] right-[12px] top-[17.5px]" data-name="Data">
      <Background7 />
      <Container34 />
    </div>
  );
}

function Row4() {
  return (
    <div className="h-[74px] mb-[-1px] relative shrink-0 w-full" data-name="Row 4">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <Data18 />
      <Data19 />
      <Data20 />
      <Data21 />
      <Data22 />
      <Data23 />
    </div>
  );
}

function Container35() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] w-full">
        <p className="leading-[20px]">09:40:12</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] w-full">
        <p className="leading-[16px]">15/10/2023</p>
      </div>
    </div>
  );
}

function Data24() {
  return (
    <div className="relative shrink-0 w-[86.72px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pb-[18.5px] pt-[16.5px] px-[12px] relative size-full">
        <Container35 />
        <Container36 />
      </div>
    </div>
  );
}

function Data25() {
  return (
    <div className="relative shrink-0 w-[165.11px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[19px] pt-[16px] px-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] whitespace-nowrap">
          <p className="leading-[20px] mb-0">Phân xưởng Khai</p>
          <p className="leading-[20px]">thác 5</p>
        </div>
      </div>
    </div>
  );
}

function Data26() {
  return (
    <div className="relative shrink-0 w-[286.19px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[39px] pl-[12px] pr-[32px] pt-[16px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Áp lực thông gió giảm nhẹ</p>
        </div>
      </div>
    </div>
  );
}

function OverlayBorder1() {
  return (
    <div className="bg-[rgba(255,218,214,0.3)] content-stretch flex gap-[5.99px] items-center pl-[11px] pr-[40px] py-[5px] relative rounded-[9999px] shrink-0" data-name="Overlay+Border">
      <div aria-hidden className="absolute border border-[rgba(186,26,26,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#ba1a1a] h-[6px] relative rounded-[9999px] shrink-0 w-[5.63px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#ba1a1a] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Nghiêm</p>
        <p className="leading-[16px]">trọng</p>
      </div>
    </div>
  );
}

function Data27() {
  return (
    <div className="relative shrink-0 w-[131.09px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[12px] py-[16.5px] relative size-full">
        <OverlayBorder1 />
      </div>
    </div>
  );
}

function Background8() {
  return (
    <div className="bg-[#e6e8ea] content-stretch flex items-start pl-[10px] pr-[37.51px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Chờ tiếp</p>
        <p className="leading-[16px]">nhận</p>
      </div>
    </div>
  );
}

function Data28() {
  return (
    <div className="relative shrink-0 w-[119.53px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[18.5px] pt-[16.5px] px-[12px] relative size-full">
        <Background8 />
      </div>
    </div>
  );
}

function Data29() {
  return (
    <div className="relative shrink-0 w-[165.36px]" data-name="Data">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-[43px] pt-[16px] px-[12px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] whitespace-nowrap">
          <p className="leading-[16px]">Chưa phân công</p>
        </div>
      </div>
    </div>
  );
}

function Row5() {
  return (
    <div className="content-stretch flex items-start justify-center mb-[-1px] py-px relative shrink-0 w-full" data-name="Row 5">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <Data24 />
      <Data25 />
      <Data26 />
      <Data27 />
      <Data28 />
      <Data29 />
    </div>
  );
}

function Container37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] w-full">
        <p className="leading-[20px]">08:22:55</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] w-full">
        <p className="leading-[16px]">15/10/2023</p>
      </div>
    </div>
  );
}

function Data30() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] items-start left-0 px-[12px] py-[16.5px] right-[867.28px] top-0" data-name="Data">
      <Container37 />
      <Container38 />
    </div>
  );
}

function Data31() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[86.72px] pb-[37px] pt-[16px] px-[12px] right-[702.17px] top-0" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Trạm bơm nước B3</p>
      </div>
    </div>
  );
}

function Data32() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[251.83px] pb-[37px] pl-[12px] pr-[32px] pt-[16px] right-[415.98px] top-0" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Mực nước hầm vượt mức cấp 2</p>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#fff8e1] content-stretch flex gap-[6px] items-center px-[11px] py-[5px] relative rounded-[9999px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(245,127,23,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#f57f17] relative rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#f57f17] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Cảnh báo</p>
      </div>
    </div>
  );
}

function Data33() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[538.02px] pb-[30.5px] pt-[16.5px] px-[12px] right-[284.89px] top-0" data-name="Data">
      <BackgroundBorder3 />
    </div>
  );
}

function Overlay4() {
  return (
    <div className="bg-[rgba(218,226,253,0.4)] content-stretch flex items-start px-[10px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Overlay">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0037b0] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Đang xử lý</p>
      </div>
    </div>
  );
}

function Data34() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[669.11px] pb-[32.5px] pt-[16.5px] px-[12px] right-[165.36px] top-0" data-name="Data">
      <Overlay4 />
    </div>
  );
}

function Background9() {
  return (
    <div className="bg-[#e65100] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[24px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">NT</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Nguyễn Thành</p>
      </div>
    </div>
  );
}

function Data35() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-center left-[800.64px] right-[12px] top-[16.5px]" data-name="Data">
      <Background9 />
      <Container39 />
    </div>
  );
}

function Row6() {
  return (
    <div className="h-[73px] mb-[-1px] relative shrink-0 w-full" data-name="Row 6">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <Data30 />
      <Data31 />
      <Data32 />
      <Data33 />
      <Data34 />
      <Data35 />
    </div>
  );
}

function Container40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] w-full">
        <p className="leading-[20px]">07:15:20</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#747686] text-[12px] w-full">
        <p className="leading-[16px]">15/10/2023</p>
      </div>
    </div>
  );
}

function Data36() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start px-[12px] py-[16px] relative shrink-0 w-[86.72px]" data-name="Data">
      <Container40 />
      <Container41 />
    </div>
  );
}

function Data37() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[36.5px] pt-[16px] px-[12px] relative shrink-0 w-[165.11px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Cổng ra sản phẩm</p>
      </div>
    </div>
  );
}

function Data38() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[36.5px] pl-[12px] pr-[32px] pt-[16px] relative shrink-0 w-[286.19px]" data-name="Data">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Kiểm tra cảm biến bụi</p>
      </div>
    </div>
  );
}

function BackgroundBorder4() {
  return (
    <div className="bg-[#e6f4ea] content-stretch flex gap-[6px] items-center px-[11px] py-[5px] relative rounded-[9999px] shrink-0" data-name="Background+Border">
      <div aria-hidden className="absolute border border-[rgba(19,115,51,0.2)] border-solid inset-0 pointer-events-none rounded-[9999px]" />
      <div className="bg-[#137333] relative rounded-[9999px] shrink-0 size-[6px]" data-name="Background" />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#137333] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Bình thường</p>
      </div>
    </div>
  );
}

function Data39() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[30px] pt-[16.5px] px-[12px] relative shrink-0 w-[131.09px]" data-name="Data">
      <BackgroundBorder4 />
    </div>
  );
}

function Background10() {
  return (
    <div className="bg-[#e6f4ea] content-stretch flex items-start pl-[10px] pr-[37.97px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#137333] text-[12px] whitespace-nowrap">
        <p className="leading-[16px] mb-0">Đã hoàn</p>
        <p className="leading-[16px]">thành</p>
      </div>
    </div>
  );
}

function Data40() {
  return (
    <div className="content-stretch flex flex-col items-start px-[12px] py-[16px] relative shrink-0 w-[119.53px]" data-name="Data">
      <Background10 />
    </div>
  );
}

function Background11() {
  return (
    <div className="bg-[#0d652d] content-stretch flex h-[24px] items-center justify-center relative rounded-[9999px] shrink-0 w-[22.27px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-center text-white whitespace-nowrap">
        <p className="leading-[20px]">VP</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[37.7px] relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
        <p className="leading-[20px] mb-0">Hoàng Văn</p>
        <p className="leading-[20px]">Phong</p>
      </div>
    </div>
  );
}

function Data41() {
  return (
    <div className="content-stretch flex gap-[8px] items-center pl-[12px] relative shrink-0 w-[153.36px]" data-name="Data">
      <Background11 />
      <Container42 />
    </div>
  );
}

function Row7() {
  return (
    <div className="relative shrink-0 w-full" data-name="Row 7">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[12px] pt-px relative size-full">
          <Data36 />
          <Data37 />
          <Data38 />
          <Data39 />
          <Data40 />
          <Data41 />
        </div>
      </div>
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full z-[1]" data-name="Body">
      <Row1 />
      <Row2 />
      <Row3 />
      <Row4 />
      <Row5 />
      <Row6 />
      <Row7 />
    </div>
  );
}

function Table1() {
  return (
    <div className="content-stretch flex flex-col isolate items-start relative shrink-0 w-full" data-name="Table">
      <Header />
      <Body />
    </div>
  );
}

function Table() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Table">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-auto relative rounded-[inherit] size-full">
        <Table1 />
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[14px] whitespace-nowrap">
          <p className="leading-[20px]">Trang 1 / 2</p>
        </div>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Background+HorizontalBorder">
      <div aria-hidden className="absolute border-[#e0e3e5] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pb-[16px] pt-[17px] px-[24px] relative size-full">
          <Container43 />
        </div>
      </div>
    </div>
  );
}

function DataSectionContainer() {
  return (
    <div className="bg-white content-stretch drop-shadow-[0px_4px_2px_rgba(0,0,0,0.02)] flex flex-[1_0_0] flex-col items-start min-h-px p-px relative rounded-[8px] w-full" data-name="Data Section Container">
      <div aria-hidden className="absolute border border-[#e0e3e5] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Toolbar />
      <Table />
      <BackgroundHorizontalBorder />
    </div>
  );
}

function MainContentCanvas() {
  return (
    <div className="bg-[#f4f6f8] flex-[1_0_0] h-[1024px] min-w-px relative" data-name="Main Content Canvas">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[32px] relative size-full">
          <HeaderMargin />
          <SummaryCards4GridMargin />
          <DataSectionContainer />
        </div>
      </div>
    </div>
  );
}

function Background12() {
  return (
    <div className="bg-[#0037b0] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">N</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[20px] text-white whitespace-nowrap">
        <p className="leading-[28px]">Núi Béo</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Hệ thống quản lý sản xuất</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0 w-[147.92px]" data-name="Container">
      <Heading />
      <Container46 />
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
          <Background12 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[32px] relative shrink-0 w-full" data-name="Margin">
      <Container44 />
    </div>
  );
}

function Container47() {
  return (
    <div className="relative shrink-0 size-[13.333px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3333 13.3333">
        <g id="Container">
          <path d={svgPaths.p2b8b1600} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container47 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Nhập báo cáo mới</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p498ff00} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink1() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container48 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Báo cáo tổng quan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p2173abc0} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink2() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative size-full">
          <Container49 />
          <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[14px] whitespace-nowrap">
            <p className="leading-[20px]">Báo cáo chi tiết</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="h-[16.708px] relative shrink-0 w-[16.667px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.7083">
        <g id="Container">
          <path d={svgPaths.p1dcf6b00} fill="var(--fill-0, #CAD3FF)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container50() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pr-[15.44px] relative size-full">
        <Container51 />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#cad3ff] text-[16px] whitespace-nowrap">
          <p className="leading-[24px] mb-0">Trung tâm cảnh</p>
          <p className="leading-[24px]">báo</p>
        </div>
      </div>
    </div>
  );
}

function Background13() {
  return (
    <div className="bg-[#ba1a1a] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start px-[8px] py-[2px] relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
          <p className="leading-[16px]">2</p>
        </div>
      </div>
    </div>
  );
}

function ItemLinkActiveNavigationAlertCenterMatchesUserRequest() {
  return (
    <div className="bg-[#1d4ed8] relative rounded-[8px] shrink-0 w-full" data-name="Item → Link - Active Navigation: Alert Center matches user request">
      <div aria-hidden className="absolute border-l-4 border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Container50 />
          <Background13 />
        </div>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="List">
      <div className="content-stretch flex flex-col gap-[4px] items-start px-[16px] relative size-full">
        <ItemLink />
        <ItemLink1 />
        <ItemLink2 />
        <ItemLinkActiveNavigationAlertCenterMatchesUserRequest />
      </div>
    </div>
  );
}

function Background14() {
  return (
    <div className="bg-[#565e74] content-stretch flex items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[16px]">A</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#3f465c] text-[14px] whitespace-nowrap">
        <p className="leading-[20px]">Nguyễn Văn A</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Background14 />
        <Container54 />
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Container">
          <path d={svgPaths.p2b55a3c0} fill="var(--fill-0, #3F465C)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(63,70,92,0.2)] border-solid border-t inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[12px] pt-[17px] px-[16px] relative size-full">
          <Container53 />
          <Container55 />
        </div>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[16px] relative size-full">
        <HorizontalBorder />
      </div>
    </div>
  );
}

function SideNavBarPredictedRenderedForAlertCenterContext() {
  return (
    <div className="absolute bg-[#131b2e] content-stretch flex flex-col h-[1024px] items-start justify-between left-0 py-[24px] top-0 w-[260px]" data-name="SideNavBar (Predicted & Rendered for Alert Center context)">
      <Margin />
      <List />
      <Container52 />
    </div>
  );
}

export default function TrungTamCnhBaoTiuBCc100Vh() {
  return (
    <div className="content-stretch flex items-start justify-center pl-[260px] relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(247, 249, 251) 0%, rgb(247, 249, 251) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Trung tâm cảnh báo - Tối ưu bố cục 100vh">
      <MainContentCanvas />
      <SideNavBarPredictedRenderedForAlertCenterContext />
    </div>
  );
}