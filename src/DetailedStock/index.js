import React, { useEffect } from "react";
import TradingViewWidget, { Themes } from "react-tradingview-widget";
import { useParams } from "react-router-dom";

export default (props) => {
  const { symbol } = useParams();

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
        withdateranges={true}
        hide_side_toolbar={false}
        autosize
      />
    </div>
  );
};
