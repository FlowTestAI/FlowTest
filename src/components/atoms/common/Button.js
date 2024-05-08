import React from 'react';
import { PropTypes } from 'prop-types';

// ToDo: can be more generalized
const Button = ({
  children,
  classes,
  btnType,
  intentType,
  isDisabled,
  onClickHandle,
  fullWidth,
  onlyIcon,
  padding,
}) => {
  // const btnColorStyles = {
  //   primary: {
  //     default: 'border-denim-600 bg-denim-600 text-white hover:bg-denim-700', // with bg color
  //     intent: {
  //       info: 'border-sky-600 bg-sky-600 text-white hover:bg-sky-700',
  //       success: 'border-green-600 bg-green-600 text-white hover:bg-green-700',
  //       warning: 'border-amber-600 bg-amber-600 text-white hover:bg-amber-700',
  //       error: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
  //     },
  //   },
  //   secondary: {
  //     default: 'border border-denim-600 bg-denim-50 text-denim-600 hover:bg-denim-100', // outline
  //     intent: {
  //       info: 'border border-sky-600 bg-sky-50 text-sky-600 hover:bg-sky-100',
  //       success: 'border border-green-600 bg-green-50 text-green-600 hover:bg-green-100',
  //       warning: 'border border-amber-600 bg-amber-50 text-amber-600 hover:bg-amber-100',
  //       error: 'border border-red-600 bg-red-50 text-red-600 hover:bg-red-100',
  //     },
  //   },
  //   tertiary: {
  //     default: 'text-denim-600 hover:bg-denim-100', // without border
  //     intent: {
  //       info: 'text-sky-600 hover:bg-sky-100',
  //       success: 'text-green-600 hover:bg-green-100',
  //       warning: 'text-amber-600 hover:bg-amber-100',
  //       error: 'text-red-600 hover:bg-red-100',
  //     },
  //   },
  //   minimal: {
  //     default: 'text-fog-600 hover:text-fog-900 hover:font-semibold hover:bg-fog-50',
  //     intent: {
  //       info: 'text-sky-600 hover:text-sky-900 hover:font-semibold',
  //       success: 'text-green-600 hover:text-green-900 hover:font-semibold',
  //       warning: 'text-amber-600 hover:text-amber-900 hover:font-semibold',
  //       error: 'text-red-600 hover:text-red-900 hover:font-semibold',
  //     },
  //   },
  //   disabled: {
  //     default: 'text-fog-600 hover:text-fog-900 hover:font-semibold hover:bg-fog-50 cursor-not-allowed',
  //   },
  // };

  const btnColorStyles = {
    primary: {
      default: 'border-cyan-900 text-white bg-cyan-900 hover:border-cyan-950 hover:bg-cyan-950', // with bg color
      intent: {
        info: 'border-sky-600 bg-sky-600 text-white hover:bg-sky-700',
        success: 'border-green-600 bg-green-600 text-white hover:bg-green-700',
        warning: 'border-amber-600 bg-amber-600 text-white hover:bg-amber-700',
        error: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
      },
    },
    secondary: {
      default: 'border-cyan-900 text-cyan-900 bg-background-light hover:bg-background border', // outline
      intent: {
        info: 'border border-sky-600 bg-sky-50 text-sky-600 hover:bg-sky-100',
        success: 'border border-green-600 bg-green-50 text-green-600 hover:bg-green-100',
        warning: 'border border-amber-600 bg-amber-50 text-amber-600 hover:bg-amber-100',
        error: 'border border-red-600 bg-red-50 text-red-600 hover:bg-red-100',
      },
    },
    tertiary: {
      default: 'text-cyan-900 hover:bg-background-light', // without border but with primary color scheme
      intent: {
        info: 'text-sky-600 hover:bg-sky-100',
        success: 'text-green-600 hover:bg-green-100',
        warning: 'text-amber-600 hover:bg-amber-100',
        error: 'text-red-600 hover:bg-red-100',
      },
    },
    minimal: {
      default: 'text-cyan-950 hover:bg-background-light', // without border and a neutral button
      intent: {
        info: 'text-sky-600 hover:text-sky-900 hover:font-semibold',
        success: 'text-green-600 hover:text-green-900 hover:font-semibold',
        warning: 'text-amber-600 hover:text-amber-900 hover:font-semibold',
        error: 'text-red-600 hover:text-red-900 hover:font-semibold',
      },
    },
    disabled: {
      default: 'text-gray-300 hover:font-semibold cursor-not-allowed',
    },
  };

  const getButtonStyles = () => {
    const buttonColorStyles = btnColorStyles[btnType];
    let styles = '';
    if (onlyIcon) {
      if (padding && padding !== '') {
        styles = `${commonStyles} ${padding}`;
      } else {
        styles = `${commonStyles} p-0.5`;
      }
    } else {
      styles = `${commonStyles} px-4 py-2`;
    }
    if (intentType) {
      return `${buttonColorStyles.intent[intentType]} ${styles}`;
    }
    return `${buttonColorStyles.default} ${styles}`;
  };

  const commonStyles = `inline-flex items-center justify-center gap-2 whitespace-nowrap outline-none rounded transition ${fullWidth ? 'w-full' : ''} ${classes ? classes : ''}`;
  return (
    <button className={getButtonStyles()} disabled={isDisabled} onClick={onClickHandle}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  btnType: PropTypes.string.isRequired,
  isDisabled: PropTypes.boolean.isRequired,
  onClickHandle: PropTypes.func,
  fullWidth: PropTypes.boolean,
};
export default Button;
