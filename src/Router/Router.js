import { HashRouter, Route, Switch } from "react-router-dom";

import DetailedStockView from "../DetailedStock";
import React from "react";

const Router = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/:symbol/">
          <DetailedStockView />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default Router;
