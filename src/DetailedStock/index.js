import React, { useEffect } from "react";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { useParams, useLocation } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const queryOrDefault = (query, attr, def) => {
  return query.get(attr) !== null ? query.get(attr) : def;
};

const intervalRangeMap = {
  A: "6m",
  D: "12m",
  W: "60m",
  M: "120m",
};

export default (props) => {
  const { symbol } = useParams();
  const query = useQuery();
  const interval = queryOrDefault(query, "interval", "D");

  useEffect(() => {
    var height =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    document.getElementById("detchartcont").style.height = `${height}px`;
  }, []);

  return (
    <div id="detchartcont">
      <TradingViewWidget
        symbol={`NASDAQ:${symbol}`}
        theme={Themes.DARK}
        interval={interval}
        range={intervalRangeMap[interval]}
        hide_side_toolbar={true}
        autosize
      />
    </div>
  );
};
