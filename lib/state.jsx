/* eslint react/no-multi-comp: 0 */

import React, { Component, PureComponent, createContext } from 'react';
import PropTypes from 'prop-types';
import { newLogger } from './log';

const log = newLogger('phnq-lib.state');
log('STATE');

const names = new Set();
const providers = {};

if (!window.getCombinedState) {
  window.getCombinedState = () =>
    Object.keys(providers).reduce((states, k) => ({ ...states, [k]: providers[k].state }), {});
}

export const createState = (name, defaultState = {}, getActions = () => ({})) => {
  if (names.has(name)) {
    throw new Error(`State names must be unique - '${name}' already exists`);
  }

  log('created state %s', name);
  names.add(name);

  const { Provider, Consumer } = createContext();

  class StateProvider extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
    };

    constructor(props) {
      super(props);
      providers[name] = this;
      this.consumerCount = 0;
      this.state = defaultState;
      this.actions = getActions(
        () => ({ ...this.state }),
        state => {
          log('%s(%d) - %o', name.toUpperCase(), this.consumerCount, state);
          this.setState(state);
        }
      );

      Object.keys(this.actions).forEach(k => {
        this.actions[k] = this.actions[k].bind(this.actions);
      });

      this.actions._incrementConsumerCount = () => {
        this.consumerCount += 1;
      };

      this.actions._decrementConsumerCount = () => {
        this.consumerCount -= 1;
      };

      this.actions = Object.freeze(this.actions);
    }

    render() {
      const { children } = this.props;
      const value = { ...this.state, ...this.actions, consumerCount: this.consumerCount };
      return <Provider value={value}>{children}</Provider>;
    }
  }

  class StateConsumer extends PureComponent {
    static propTypes = {
      children: PropTypes.node.isRequired,
      _incrementConsumerCount: PropTypes.func.isRequired,
      _decrementConsumerCount: PropTypes.func.isRequired,
    };

    componentDidMount() {
      const { _incrementConsumerCount } = this.props;

      _incrementConsumerCount();
    }

    componentWillUnmount() {
      const { _decrementConsumerCount } = this.props;

      _decrementConsumerCount();
    }

    render() {
      const { children } = this.props;
      return children;
    }
  }

  const provider = (() => Wrapped => props => (
    <StateProvider>
      <Wrapped {...props} />
    </StateProvider>
  ))();

  /* eslint-disable react/prop-types */
  const map = (mapFn = s => s) =>
    (() => Wrapped => props => (
      <Consumer>
        {state => (
          <StateConsumer {...props} {...state}>
            <Wrapped {...props} {...mapFn(state)} ref={props.innerRef} />
          </StateConsumer>
        )}
      </Consumer>
    ))();
  /* eslint-enable */

  return { provider, map };
};
