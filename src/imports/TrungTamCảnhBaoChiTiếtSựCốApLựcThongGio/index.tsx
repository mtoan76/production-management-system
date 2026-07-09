import svgPaths from "./svg-2b9amaucm8";

function Background() {
  return (
    <div className="bg-[#0037b0] content-stretch flex items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[8px] shrink-0 size-[40px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">N</p>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#f7f9fb] text-[20px] whitespace-nowrap">
        <p className="leading-[28px]">Núi Béo</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#d8dadc] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Hệ thống quản lý sản xuất</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[164.17px]" data-name="Container">
      <Heading />
      <Container3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[24px] relative size-full">
          <Background />
          <Container2 />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[32px] relative shrink-0 w-full" data-name="Margin">
      <Container1 />
    </div>
  );
}

function Margin1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 20">
        <g id="Margin">
          <path d={svgPaths.p11fdd840} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Nhập báo cáo mới</p>
      </div>
    </div>
  );
}

function ItemLink() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <Margin1 />
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div className="h-[18px] relative shrink-0 w-[30px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 18">
        <g id="Margin">
          <path d={svgPaths.p186f5ba0} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Báo cáo tổng quan</p>
      </div>
    </div>
  );
}

function ItemLink1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <Margin2 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div className="h-[18px] relative shrink-0 w-[30px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 18">
        <g id="Margin">
          <path d={svgPaths.p4c2b800} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.6px] whitespace-nowrap">
        <p className="leading-[16px]">Báo cáo chi tiết</p>
      </div>
    </div>
  );
}

function ItemLink2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Item → Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <Margin3 />
          <Container7 />
        </div>
      </div>
    </div>
  );
}

function Margin4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[28px]" data-name="Margin">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 20">
        <g id="Margin">
          <path d={svgPaths.p210fe134} fill="var(--fill-0, white)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container8() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white tracking-[0.6px] whitespace-nowrap">
          <p className="leading-[16px]">Trung tâm cảnh báo</p>
        </div>
      </div>
    </div>
  );
}

function ItemLink3() {
  return (
    <div className="bg-[#0037b0] relative shrink-0 w-full" data-name="Item → Link">
      <div aria-hidden className="absolute border-[#f7f9fb] border-l-4 border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[20px] pr-[16px] py-[12px] relative size-full">
          <Margin4 />
          <Container8 />
        </div>
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full" data-name="List">
      <ItemLink />
      <ItemLink1 />
      <ItemLink2 />
      <ItemLink3 />
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px overflow-auto relative w-full" data-name="Container">
      <List />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#eceef0] content-stretch flex items-center justify-center pb-[8.5px] pt-[7.5px] relative rounded-[9999px] shrink-0 size-[32px]" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[16px]">NA</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#bec6e0] text-[12px] tracking-[0.6px] w-full">
        <p className="leading-[16px]">Nguyễn Văn A</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="relative shrink-0 size-[10.5px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 10.5">
        <g id="Container">
          <path d={svgPaths.p28fadc40} fill="var(--fill-0, #BEC6E0)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Container9() {
  return (
    <div className="relative rounded-[8px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center p-[8px] relative size-full">
          <Background1 />
          <Container10 />
          <Container11 />
        </div>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[rgba(196,197,215,0.2)] border-solid border-t inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start pt-[17px] px-[16px] relative size-full">
        <Container9 />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-between py-[24px] relative size-full">
        <Margin />
        <Container4 />
        <HorizontalBorder />
      </div>
    </div>
  );
}

function NavSidebarBlurredInBackground() {
  return (
    <div className="absolute bg-[#2d3133] blur-[1px] content-stretch flex flex-col h-[1024px] items-start justify-center left-0 opacity-70 pr-px top-0 w-[265.17px]" data-name="Nav - Sidebar (Blurred in background)">
      <div aria-hidden className="absolute border-[#c4c5d7] border-r border-solid inset-0 pointer-events-none" />
      <Container />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:Bold',sans-serif] font-bold justify-center leading-[0] relative shrink-0 text-[#191c1e] text-[24px] whitespace-nowrap">
        <p className="leading-[32px]">Trung tâm cảnh báo</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p2816f2c0} fill="var(--fill-0, #434655)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center pb-[6px] relative shrink-0" data-name="Button">
      <Container12 />
    </div>
  );
}

function HeaderTopAppBar() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Header - Top App Bar">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[16px] pt-[32px] px-[32px] relative size-full">
          <Heading1 />
          <Button />
        </div>
      </div>
    </div>
  );
}

function TableHeaderSimulation() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Table header simulation">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <div className="absolute bg-[#e0e3e5] h-[16px] left-0 rounded-[4px] top-0 w-[96px]" data-name="Background" />
        <div className="absolute bg-[#e0e3e5] h-[16px] left-[144px] rounded-[4px] top-0 w-[128px]" data-name="Background" />
        <div className="absolute bg-[#e0e3e5] h-[16px] left-[288px] rounded-[4px] top-0 w-[80px]" data-name="Background" />
        <div className="absolute bg-[#e0e3e5] h-[16px] left-[432px] rounded-[4px] top-0 w-[112px]" data-name="Background" />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center pb-[17px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-[#e0e3e5] flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Background" />
      <div className="bg-[#e0e3e5] flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Background" />
      <div className="bg-[#e0e3e5] flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Background" />
      <div className="bg-[#e0e3e5] flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Background" />
    </div>
  );
}

function HorizontalBorder2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center pb-[17px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-[#e0e3e5] flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Background" />
      <div className="bg-[#e0e3e5] flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Background" />
      <div className="bg-[#e0e3e5] flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Background" />
      <div className="bg-[#e0e3e5] flex-[1_0_0] h-[32px] min-w-px relative rounded-[4px]" data-name="Background" />
    </div>
  );
}

function TableRowsSimulation() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table rows simulation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-start relative size-full">
        <HorizontalBorder1 />
        <HorizontalBorder2 />
      </div>
    </div>
  );
}

function BackgroundBorderShadow() {
  return (
    <div className="bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex-[1_0_0] min-h-px relative rounded-[12px] w-full" data-name="Background+Border+Shadow">
      <div aria-hidden className="absolute border border-[#e0e3e5] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[25px] relative size-full">
        <TableHeaderSimulation />
        <TableRowsSimulation />
      </div>
    </div>
  );
}

function DummyContentToSimulateTable() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="Dummy Content to simulate table">
      <div className="flex flex-col justify-center size-full">
        <div className="content-stretch flex flex-col items-start justify-center p-[32px] relative size-full">
          <BackgroundBorderShadow />
        </div>
      </div>
    </div>
  );
}

function MainContentAreaBlurredInBackground() {
  return (
    <div className="blur-[1px] content-stretch flex flex-col h-full items-start opacity-70 relative shrink-0 w-[310.09px]" data-name="Main Content Area (Blurred in background)">
      <HeaderTopAppBar />
      <DummyContentToSimulateTable />
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[18px]">THỜI GIAN</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[4px] relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] w-full">
        <p className="leading-[24px]">09:40:12</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[16px] w-full">
        <p className="leading-[24px]">15/10/2023</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col items-start pr-[24px] relative shrink-0 w-[234.66px]" data-name="Container">
      <Container14 />
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[18px]">VỊ TRÍ</p>
        </div>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] w-full">
          <p className="leading-[24px]">Phân xưởng Khai thác 5</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[24px] pl-[25px] pr-[24px] relative shrink-0 w-[234.67px]" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[#e0e3e5] border-l border-solid inset-0 pointer-events-none" />
      <Container17 />
      <Container18 />
    </div>
  );
}

function Container19() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] uppercase w-full">
          <p className="leading-[18px]">NGƯỜI XỬ LÝ</p>
        </div>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <div className="[word-break:break-word] flex flex-col font-['Inter:Italic',sans-serif] font-normal italic justify-center leading-[0] relative shrink-0 text-[#434655] text-[16px] w-full">
          <p className="leading-[24px]">Chưa phân công</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start pb-[24px] pl-[25px] relative shrink-0 w-[234.67px]" data-name="VerticalBorder">
      <div aria-hidden className="absolute border-[#e0e3e5] border-l border-solid inset-0 pointer-events-none" />
      <Container19 />
      <Container20 />
    </div>
  );
}

function InfoGrid() {
  return (
    <div className="relative shrink-0 w-full" data-name="Info Grid">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Container13 />
        <VerticalBorder />
        <VerticalBorder1 />
      </div>
    </div>
  );
}

function ModalBody() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col items-start left-0 pb-[25px] pt-[24px] px-[32px] right-0 top-[112.5px]" data-name="Modal Body">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <InfoGrid />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[12px] tracking-[0.6px] uppercase w-full">
        <p className="leading-[18px]">MÔ TẢ CHI TIẾT</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#191c1e] text-[16px] w-full">
        <p className="leading-[26px] mb-0">Hệ thống đo áp lực tại gương lò Phân xưởng Khai thác 5 ghi nhận giá trị 18 Pa, thấp hơn</p>
        <p className="leading-[26px] mb-0">mức tối thiểu quy định 25 Pa. Nguyên nhân nghi do quạt thông gió phụ số 2 bị sự cố.</p>
        <p className="leading-[26px] mb-0">Cần kiểm tra và khởi động lại quạt. Tạm thời dừng tất cả hoạt động nổ mìn cho đến khi</p>
        <p className="leading-[26px]">áp lực được phục hồi.</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#f2f4f6] relative rounded-[8px] shrink-0 w-full" data-name="Background">
      <div className="content-stretch flex flex-col items-start p-[20px] relative size-full">
        <Container21 />
      </div>
    </div>
  );
}

function Description() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start left-0 px-[32px] py-[24px] right-0 top-[231.5px]" data-name="Description">
      <Heading2 />
      <Background2 />
    </div>
  );
}

function Container23() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Container">
          <path d={svgPaths.p345aeec0} fill="var(--fill-0, #BA1A1A)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Overlay() {
  return (
    <div className="bg-[rgba(255,218,214,0.2)] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[48px]" data-name="Overlay">
      <Container23 />
    </div>
  );
}

function Overlay1() {
  return (
    <div className="bg-[rgba(255,218,214,0.2)] h-[27.5px] relative rounded-[9999px] shrink-0 w-[117.8px]" data-name="Overlay">
      <div className="-translate-y-1/2 absolute bg-[#ba1a1a] left-[10px] rounded-[9999px] size-[6px] top-1/2" data-name="Background" />
      <div className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] left-[22px] not-italic text-[#ba1a1a] text-[13px] top-[calc(50%-0.75px)] whitespace-nowrap">
        <p className="leading-[19.5px]">Nghiêm trọng</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#e0e3e5] content-stretch flex items-center px-[10px] py-[4px] relative rounded-[9999px] shrink-0" data-name="Background">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#434655] text-[13px] whitespace-nowrap">
        <p className="leading-[19.5px]">Chờ tiếp nhận</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 w-full" data-name="Container">
      <Overlay1 />
      <Background3 />
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Plus_Jakarta_Sans:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#191c1e] text-[20px] w-full">
        <p className="leading-[28px]">Áp lực thông gió giảm dưới mức tối thiểu tại gương lò</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-w-px relative" data-name="Container">
      <Container25 />
      <Heading3 />
    </div>
  );
}

function Container22() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-start relative size-full">
        <Overlay />
        <Container24 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Container">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Container">
          <path d={svgPaths.p15494480} fill="var(--fill-0, #434655)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute right-[24px] top-[24px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-center justify-center pb-[6px] relative size-full">
        <Container26 />
      </div>
    </div>
  );
}

function ModalHeader() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 pb-[25px] pt-[24px] px-[32px] right-0 top-0" data-name="Modal Header">
      <div aria-hidden className="absolute border-[#e0e3e5] border-b border-solid inset-0 pointer-events-none" />
      <Container22 />
      <Button1 />
    </div>
  );
}

function ForegroundModal() {
  return (
    <div className="bg-white h-[453.5px] max-w-[768px] overflow-clip relative rounded-[12px] shadow-[0px_12px_24px_-4px_rgba(0,0,0,0.1)] shrink-0 w-[768px]" data-name="Foreground Modal">
      <ModalBody />
      <Description />
      <ModalHeader />
    </div>
  );
}

function OverlayBackdrop() {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[rgba(0,0,0,0.5)] content-stretch flex inset-0 items-center justify-center p-[16px]" data-name="Overlay Backdrop">
      <ForegroundModal />
    </div>
  );
}

export default function TrungTamCnhBaoChiTitSCApLcThongGio() {
  return (
    <div className="content-stretch flex items-start relative size-full" style={{ backgroundImage: "linear-gradient(90deg, rgb(247, 249, 251) 0%, rgb(247, 249, 251) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Trung tâm cảnh báo - Chi tiết sự cố (Áp lực thông gió)">
      <NavSidebarBlurredInBackground />
      <MainContentAreaBlurredInBackground />
      <OverlayBackdrop />
    </div>
  );
}