import React from 'react';
import PropTypes from 'prop-types';
import { Route as ReactRoute } from 'react-router-dom';

const Route = ({ ...props }) =>
  props.if ? <ReactRoute {...props} /> : <ReactRoute {...props} component={null} render={props.elseRender} />;

Route.propTypes = {
  if: PropTypes.bool,
  elseRender: PropTypes.func,
};

Route.defaultProps = {
  if: true,
  elseRender: () => null,
};

export default Route;
