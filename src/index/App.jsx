import {hot} from 'react-hot-loader/root';
import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Login from './Login';
import Main from './Main';

const Routes = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" component={Main} />
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
    </HashRouter>
  );
};

export default hot(Routes);
