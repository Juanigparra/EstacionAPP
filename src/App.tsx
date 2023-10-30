import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import MainScreen from './components/MainScreen';
import ConfigurationForm from './components/ConfigurationForm';
import ListaCocheras from './components/ListaCocheras';
import Tarifas from './components/Tarifas';

import Home from './pages/Home';
import React from 'react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';



setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route path="/register" component={RegisterForm} exact={true} />
        <Route path="/forgot-password" component={ForgotPasswordForm} exact={true} />
        <Route path="/principal" component={MainScreen} exact={true} />
        <Route path="/configuracion" component={ConfigurationForm} exact={true} />
        <Route path="/cochera" component={ListaCocheras} exact={true} />
        <Route path="/tarifa" component={Tarifas} exact={true} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
