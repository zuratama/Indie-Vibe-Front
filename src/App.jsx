import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from 'react-router-dom';
import { RouteAuthorized } from './components/custom-routes';
import { ROUTES } from './config/RoleRouting';
import {
  AuthContextProvider,
  LibraryContextProvider,
  MeContextProvider,
  StreamContextProvider
} from './contexts';
import NotFound from './NotFound';
import { CMS, CMSLogin } from './routes/cms';
import {
  ActivationResult,
  Home,
  Login,
  Premium,
  Purchase,
  Register,
  ReportArtist
} from './routes/landing';
import Logout from './routes/Logout';
import { Player } from './routes/player';

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <AuthContextProvider>
            <MeContextProvider>
              <LibraryContextProvider>
                <StreamContextProvider>
                  <Switch>
                    <RouteAuthorized
                      exact
                      component={Home}
                      path={ROUTES.home[0]}
                      roleGroup={ROUTES.home[1]}
                    />
                    <RouteAuthorized
                      exact
                      component={Premium}
                      path={ROUTES.premium[0]}
                      roleGroup={ROUTES.premium[1]}
                    />
                    <RouteAuthorized
                      exact
                      component={Purchase}
                      path={ROUTES.purchase[0]}
                      roleGroup={ROUTES.purchase[1]}
                    />
                    <RouteAuthorized
                      component={Login}
                      path={ROUTES.login[0]}
                      roleGroup={ROUTES.login[1]}
                    />
                    <RouteAuthorized
                      component={Register}
                      path={ROUTES.register[0]}
                      roleGroup={ROUTES.register[1]}
                    />
                    <RouteAuthorized
                      component={Logout}
                      path={ROUTES.logout[0]}
                      roleGroup={ROUTES.logout[1]}
                    />
                    <RouteAuthorized
                      component={ReportArtist}
                      path={ROUTES.report[0]}
                      roleGroup={ROUTES.report[1]}
                    />
                    <RouteAuthorized
                      component={ActivationResult}
                      path={ROUTES.activation[0]}
                      roleGroup={ROUTES.activation[1]}
                    />
                    <RouteAuthorized
                      component={Player}
                      path={ROUTES.player.home[0]}
                      roleGroup={ROUTES.player.home[1]}
                    />
                    <RouteAuthorized
                      component={CMS}
                      path={ROUTES.cms.dashboard[0]}
                      roleGroup={ROUTES.cms.dashboard[1]}
                    />
                    <RouteAuthorized
                      component={CMSLogin}
                      path={ROUTES.cmsLogin[0]}
                      roleGroup={ROUTES.cmsLogin[1]}
                    />
                    <Route path='/404' component={NotFound} />
                    <Route path='*'>
                      <Redirect to='/404' />
                    </Route>
                  </Switch>
                </StreamContextProvider>
              </LibraryContextProvider>
            </MeContextProvider>
          </AuthContextProvider>
        </div>
      </Router>
    );
  }
}

export default App;
