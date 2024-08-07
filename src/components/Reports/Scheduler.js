// import { ThemeProvider } from "styled-components";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Calendar } from "@/components";
import CalendarProvider from "@/context/CalendarProvider";
import LocaleProvider from "@/context/LocaleProvider";
// import { GlobalStyle, theme } from "@/styles";
// import { outsideWrapperId } from "@/constants";
// import { StyledInnerWrapper, StyledOutsideWrapper } from "./styles";

const Scheduler = () => {
  const data = [
    // Your data here, for example:
    { id: 1, title: "Meeting", start: "2024-08-04T10:00:00", end: "2024-08-04T11:00:00" },
    { id: 2, title: "Lunch", start: "2024-08-04T12:00:00", end: "2024-08-04T13:00:00" }
  ];

  const config = {
    lang: "en",
    zoom: 0,
    filterButtonState: 1,
    includeTakenHoursOnWeekendsInDayView: false,
    // Other config properties here
  };

  const startDate = "2024-08-04T00:00:00";
  const defaultStartDate = useMemo(() => dayjs(startDate), [startDate]);

  const onRangeChange = (range) => {
    console.log("Range changed:", range);
  };

  const onTileClick = (tile) => {
    console.log("Tile clicked:", tile);
  };

  const onFilterData = () => {
    console.log("Data filtered");
  };

  const onClearFilterData = () => {
    console.log("Filter cleared");
  };

  const onItemClick = (item) => {
    console.log("Item clicked:", item);
  };

  const isLoading = false;

  const appConfig = useMemo(
    () => ({
      zoom: 0,
      filterButtonState: 1,
      includeTakenHoursOnWeekendsInDayView: false,
      ...config
    }),
    [config]
  );

  const outsideWrapperRef = useRef(null);
  const [topBarWidth, setTopBarWidth] = useState(outsideWrapperRef.current?.clientWidth);

  useEffect(() => {
    const handleResize = () => {
      if (outsideWrapperRef.current) {
        setTopBarWidth(outsideWrapperRef.current.clientWidth);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!outsideWrapperRef.current) return null;
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <LocaleProvider lang={appConfig.lang}>
          <CalendarProvider
            data={data}
            isLoading={!!isLoading}
            config={appConfig}
            onRangeChange={onRangeChange}
            defaultStartDate={defaultStartDate}
            onFilterData={onFilterData}
            onClearFilterData={onClearFilterData}>
            <StyledOutsideWrapper
              showScroll={!!data.length}
              id={outsideWrapperId}
              ref={outsideWrapperRef}>
              <StyledInnerWrapper>
                <Calendar
                  data={data}
                  onTileClick={onTileClick}
                  topBarWidth={topBarWidth ?? 0}
                  onItemClick={onItemClick}
                />
              </StyledInnerWrapper>
            </StyledOutsideWrapper>
          </CalendarProvider>
        </LocaleProvider>
      </ThemeProvider>
    </>
  );
};

export default Scheduler;
