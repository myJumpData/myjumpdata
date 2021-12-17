import React from 'react';
import { Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import './styles.scss';
import './i18n';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SpeedDataScreen from './screens/SpeedDataScreen';
import SpeedDataOwnScreen from './screens/SpeedDataOwnScreen';
import GroupSettingsScreen from './screens/GroupSettingsScreen';
import GroupScreen from './screens/GroupScreen';
import GropsScreen from './screens/GroupsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import LegalScreen from './screens/LegalScreen';
import TermsScreen from './screens/TermsScreen';
import MainScreen from './screens/MainScreen';
import TrainScreen from './screens/TrainScreen';

ReactDOM.render(
  <Suspense fallback={null}>
    <BrowserRouter>
      <Routes>
        <Route path="/train" element={<TrainScreen />} />

        {'Main Pages'}
        <Route path="/" element={<MainScreen />} />

        <Route path="/terms" element={<TermsScreen />} />
        <Route path="/legal" element={<LegalScreen />} />

        {'Entry Pages'}
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        {'Home Pages'}
        <Route path="/home" element={<HomeScreen />} />

        {'Profile Pages'}
        <Route path="/u/:username" element={<ProfileScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />

        {'Group Pages'}
        <Route path="/group">
          <Route path="" element={<GropsScreen />} />
          <Route path=":id">
            <Route path="" element={<GroupScreen />} />
            <Route path="settings" element={<GroupSettingsScreen />} />
          </Route>
        </Route>

        {'Speeddata'}
        <Route path="/speeddata">
          <Route path="own/" element={<SpeedDataOwnScreen />} />
          <Route path="group/:id" element={<SpeedDataScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Suspense>,
  document.getElementById('root')
);
