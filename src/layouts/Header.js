import React from 'react';
import PropTypes from 'prop-types';
import HeaderContext from './HeaderContext';

class Header extends React.Component {
  componentDidMount() {
    this.updateHeader();
  }

  componentDidUpdate(prevProps) {
    const { left, title, right } = this.props;
    if (prevProps.left !== left || prevProps.title !== title || prevProps.right !== right) {
      this.updateHeader();
    }
  }

  updateHeader = () => {
    const { left, title, right } = this.props;
    this.setHeader({ left, title, right });
  };

  render() {
    return (
      <HeaderContext.Consumer>
        {({ setHeader }) => {
          this.setHeader = setHeader;
          return null;
        }}
      </HeaderContext.Consumer>
    );
  }
}

Header.propTypes = {
  left: PropTypes.any,
  title: PropTypes.any,
  right: PropTypes.any,
};

export default Header;
