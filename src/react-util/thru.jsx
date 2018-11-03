import PropTypes from 'prop-types';

const Thru = ({ children }) => children;

Thru.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Thru;
