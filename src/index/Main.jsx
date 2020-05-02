import React from 'react';
import Header from './Header';
import { Route, Switch } from 'react-router-dom';
import Menu from './Menu';
import './Main.less';

export default function Main() {
  return (
    <div className="ns-main">
      <Header />
      <div className="section">
        <div className="left">
          <Menu />
        </div>
        <div className="main">
          <Switch>
            <Route path="/aa" component={Menu} />
            <Route path="/test" component={Header} />
          </Switch>
        </div>
      </div>
    </div>
  );
}
