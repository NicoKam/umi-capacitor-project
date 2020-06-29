import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import HeaderContext from './HeaderContext';

const Header = (props) => {
  const { title, left, right, onLeftClick, onRightClick } = props;
  const ref = useRef();
  useEffect(() => {
    if (ref.current.pushHeader) {
      const pop = ref.current.pushHeader({ title, left, right, onLeftClick, onRightClick });
      return pop;
    }
    return undefined;
  }, [title, left, right, onLeftClick, onRightClick]);
  return (
    <HeaderContext.Consumer>
      {({ pushHeader }) => {
        ref.current = { pushHeader };
        return null;
      }}
    </HeaderContext.Consumer>
  );
};

Header.propTypes = {
  left: PropTypes.any,
  title: PropTypes.any,
  right: PropTypes.any,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
};

export default Header;
