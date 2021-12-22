import React, { Suspense } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './i18n';
import GroupScreen from './screens/GroupScreen';
import GroupSettingsScreen from './screens/GroupSettingsScreen';
import LegalScreen from './screens/LegalScreen';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/SettingsScreen';
import SpeedDataOwnScreen from './screens/SpeedDataOwnScreen';
import SpeedDataScreen from './screens/SpeedDataScreen';
import TermsScreen from './screens/TermsScreen';
import './styles.scss';

ReactDOM.render(
  <Suspense fallback={null}>
    <BrowserRouter>
      <Routes>
        {'Main Pages'}
        <Route path="/" element={<MainScreen />} />

        <Route path="/terms" element={<TermsScreen />} />
        <Route path="/legal" element={<LegalScreen />} />

        {'Entry Pages'}
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        {'Profile Pages'}
        <Route path="/u/:username" element={<ProfileScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />

        {'Group Pages'}
        <Route path="/group" element={<GroupScreen />} />
        <Route path="/group/:id" element={<GroupScreen />} />
        <Route path="/group/:id/settings" element={<GroupSettingsScreen />} />

        {'Speeddata'}
        <Route path="/speeddata">
          <Route path="own/" element={<SpeedDataOwnScreen />} />
          <Route path="group/:id" element={<SpeedDataScreen />} />
        </Route>

        {'Freestyle'}
        {'<Route path="/freestyle" element={<FreestyleScreen />} />'}
      </Routes>
    </BrowserRouter>
  </Suspense>,
  document.getElementById('root')
);
