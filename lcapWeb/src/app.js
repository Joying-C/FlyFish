/*
 * @Descripttion:
 * @Author: zhangzhiyong
 * @Date: 2022-02-08 10:34:37
 * @LastEditors: heaven.wu heaven.wu@cloudwise.com
 * @LastEditTime: 2022-11-04 10:50:23
 */
import React from 'react';
import { ConfigProvider, ThemeProvider } from '@chaoswise/ui';
import Router from '@/config/router.config';
// 国际化
import zh_antd from 'antd/es/locale/zh_CN';
import en_antd from 'antd/es/locale/en_US';
import zh from './locales/zh-ch';
import en from './locales/en-us';
import darkTheme from '../config/themes/dark';
// import lightTheme from '../config/themes/light';

// 鉴权
import authWrapper from '@/components/authWrapper';

// 开启多主题使用
// const themes = {
//   light: 'index-light.css',
//   dark: 'index-dark.css',
// };

// 国际化配置
const locales = {
  zh: {
    antdLocale: zh_antd,
    momentLocale: 'zh-ch',
    intlLocale: 'zh-Hans-CN',
    messages: zh,
  },
  en: {
    antdLocale: en_antd,
    momentLocale: 'en',
    intlLocale: 'en',
    messages: en,
  },
};

const defaultTheme = 'dark';
const defaultLocale = localStorage.getItem('language') || 'zh';

const App = ({ getAuth }) => {
  console.log('appSign=======', window.appSign);
  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      useMultipleTheme={false}
      // themeMap={themes}
      themeVars={{
        // light: lightTheme,
        // dark: darkTheme
        ...darkTheme,
      }}
    >
      <ConfigProvider
        locales={locales}
        autoInsertSpaceInButton={false}
        defaultLocale={defaultLocale}
      >
        <Router
          basename={
            (window.appSign ? window.appSign + '/' : '') +
            window.FLYFISH_CONFIG.basename
          }
          getAuth={getAuth}
        />
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default authWrapper(App);
