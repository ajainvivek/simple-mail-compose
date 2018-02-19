import React from "react";
import { IndexRoute, Route } from "react-router";
import App from "./components/App";
import Compose from "./components/Compose";
import NotFound from "./components/NotFound";

export default function getRoutes(store) {
  const clearMessages = () => {
    store.dispatch({
      type: "CLEAR_MESSAGES"
    });
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Compose} onLeave={clearMessages} />
      <Route path="*" component={NotFound} onLeave={clearMessages} />
    </Route>
  );
}
