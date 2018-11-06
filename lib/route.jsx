import React from 'react';
import PropTypes from 'prop-types';
import { Route as ReactRoute } from 'react-router-dom';

export const Route = ({ when, otherwiseRender, ...props }) =>
  when ? <ReactRoute {...props} /> : <ReactRoute {...props} component={null} render={otherwiseRender} />;

Route.propTypes = {
  when: PropTypes.bool,
  otherwiseRender: PropTypes.func,
};

Route.defaultProps = {
  when: true,
  otherwiseRender: () => null,
};
