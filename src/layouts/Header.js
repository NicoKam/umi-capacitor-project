import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import HeaderContext from './HeaderContext';

const Header = (props) => {
  const { title, left, right, onLeftClick, onRightClick } = props;
  const { pushHeader } = useContext(HeaderContext);
  useEffect(() => {
    if (pushHeader) {
      const pop = pushHeader({ title, left, right, onLeftClick, onRightClick });
      return pop;
    }
    return undefined;
  }, [title, left, right, onLeftClick, onRightClick]);
  return null;
};

Header.propTypes = {
  left: PropTypes.any,
  title: PropTypes.any,
  right: PropTypes.any,
  onLeftClick: PropTypes.func,
  onRightClick: PropTypes.func,
};

export default Header;
