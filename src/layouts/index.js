import React, { useEffect } from 'react';
import { Plugins } from '@capacitor/core';
import BaseLayout from './BaseLayout';

const { App } = Plugins;

export default (props) => {
  const { history } = props;
  useEffect(() => {
    const handler = App.addListener('backButton', () => {
      history.go(-1);
    });
    return handler.remove;
  }, []);
  return <BaseLayout {...props} />;
};
