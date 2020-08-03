import React, { useEffect, useRef, useState } from "react";

import ApiClient from "./ApiClient";
import { createChart } from "lightweight-charts";

const LightWeightChart = (props) => {
  const { symbol, interval, range, height, width, name } = props;
  const [data, setData] = useState();
  const [chart, setChart] = useState();
  const [series, setSeries] = useState({ candlestick: null, volume: null });
  const containerRef = useRef();
  const intervalMap = {
    d: "1d",
    D: "1d",
    W: "1wk",
    M: "1mo",
  };

  useEffect(() => {
    if (chart !== undefined) {
      chart.resize(containerRef.current.clientWidth, height - 2);
    }
  }, [containerRef.current, width, height, chart]);

  useEffect(() => {
    let start, end, months;
    start = end = months = null;
    months = parseInt(/(\d+)m/.exec(range)[1]);

    const _dateToIsoDate = (date) => date.toISOString().split("T")[0];

    end = new Date();
    start = new Date(end - months * 30 * 24 * 60 * 60 * 1000);
    end = new Date(end.getTime() + 3 * 24 * 60 * 60 * 1000);

    ApiClient.get(
      `/quotes?symbol=${symbol}&interval=${
        intervalMap[interval]
      }&start=${_dateToIsoDate(start)}&end=${_dateToIsoDate(end)}&latest=1`
    )
      .then((res) => res.data)
      .then((data) => {
        setData(
          data.values.map((val) => {
            const [time, open, high, low, close, volume] = val;
            return {
              open,
              high,
              low,
              close,
              volume,
              time: time / 10 ** 9,
            };
          })
        );
      });
  }, [interval, symbol, range]);

  useEffect(() => {
    if (containerRef.current !== null) {
      const gridLineColor = "rgba(54,60,78,0.7)";
      const ch = createChart(containerRef.current, {
        // width: width,
        height: height,
        localization: {
          dateFormat: "dd/MM/yyyy",
        },
        layout: {
          textColor: "#d1d4dc",
          backgroundColor: "#131722",
        },
        grid: {
          vertLines: {
            color: gridLineColor,
          },
          horzLines: {
            color: gridLineColor,
          },
        },
        timeScale: {
          rightOffset: 3,
        },
        priceScale: {
          mode: interval.toLowerCase() === "d" ? 0 : 1,
        },
        handleScale: false,
        handleScroll: false,
      });
      setChart(ch);
    }
  }, [containerRef]);

  useEffect(() => {
    if (chart !== undefined)
      chart.applyOptions({
        watermark: {
          color: "rgba(255, 255, 255, 0.5)",
          visible: true,
          text: name,
          fontSize: 20,
          horzAlign: "left",
          vertAlign: "top",
        },
      });
  }, [name, chart]);

  useEffect(() => {
    if (data !== undefined) {
      if (series.candlestick !== null && chart.volume !== null) {
        chart.removeSeries(series.candlestick);
        chart.removeSeries(series.volume);
      }
      const volumeSeries = chart.addHistogramSeries({
        priceFormat: {
          type: "volume",
        },
        overlay: true,
        scaleMargins: {
          top: 0.7,
          bottom: 0,
        },
      });
      volumeSeries.setData(
        data.map(({ time, volume, open, close }) => ({
          time,
          value: volume,
          color: close >= open ? "rgba(38,166,154,0.4)" : "rgba(239,83,80,0.4)",
        }))
      );
      const candlestickSeries = chart.addCandlestickSeries();
      candlestickSeries.setData(data);
      setSeries({ candlestick: candlestickSeries, volume: volumeSeries });
      chart.timeScale().fitContent();
    }
  }, [data, chart]);

  return (
    <div
      ref={containerRef}
      style={{ border: "1px solid #262a33" }}
      // onMouseEnter={() => {
      //   // console.log("enter");
      //   chart.applyOptions({
      //     layout: { backgroundColor: "rgba(19,23,34,0.5)" },
      //   });
      // }}
      // onMouseLeave={() => {
      //   // console.log("leave");
      //   chart.applyOptions({ layout: { backgroundColor: "#131722" } });
      // }}
    ></div>
  );
};

export default LightWeightChart;
