import React, { useEffect, useState } from "react";
// import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { useParams, useLocation } from "react-router-dom";
import LightweightChart from "./LightweightChart";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const queryOrDefault = (query, attr, def) => {
  return query.get(attr) !== null ? query.get(attr) : def;
};

const intervalRangeMap = {
  d: "6m",
  D: "12m",
  W: "60m",
  M: "120m",
};

export default (props) => {
  const { symbol: ticker } = useParams();
  const [height, setHeight] = useState(600);
  const [exchangeCode, symbol] = ticker.split(":");
  const query = useQuery();
  const interval = queryOrDefault(query, "interval", "D");
  const favorite = queryOrDefault(query, "favorite", "false");
  const name = queryOrDefault(query, "name", "");

  useEffect(() => {
    var hh =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    document.getElementById("detchartcont").style.height = `${hh}px`;
    setHeight(hh);
  }, []);

  return (
    <div id="detchartcont">
      {favorite === "true" ? (
        // <TradingViewWidget
        //   symbol={ticker}
        //   theme={Themes.DARK}
        //   withdateranges={true}
        //   hide_side_toolbar={true}
        //   autosize
        // />
        <LightweightChart
          symbol={symbol}
          name={name}
          interval={interval}
          range={intervalRangeMap[interval]}
          // width={800}
          height={height}
        />
      ) : (
        <LightweightChart
          symbol={symbol}
          name={name}
          interval={interval}
          range={intervalRangeMap[interval]}
          // width={800}
          height={height}
        />
      )}
    </div>
  );
};
