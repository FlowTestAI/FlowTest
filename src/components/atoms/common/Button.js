import React from 'react';

// ToDo: can be more generalized
const Button = ({ children, btnType, isDisabled, onClickHandle, fullWidth }) => {
  const primaryStyles = 'bg-cyan-950 text-white border-cyan-950 border hover:bg-slate-50 hover:text-cyan-950';
  const secondaryStyles = ''; // ToDo
  const tertiaryStyles = 'border border-cyan-950 text-cyan-950 hover:bg-cyan-950 bg-slate-50 hover:text-white';
  const infoStyles = 'bg-sky-600 text-white border border-sky-600 hover:bg-slate-50 hover:text-sky-600';
  const successStyles = 'bg-green-600 text-white border border-green-600 hover:bg-slate-50 hover:text-green-600';
  const warningStyles = 'bg-amber-600 text-white border border-amber-600 hover:bg-slate-50 hover:text-amber-600';
  const errorStyles = 'bg-red-600 text-white border border-red-600 hover:bg-slate-50 hover:text-red-600';
  const btnStyles = {
    primary: primaryStyles,
    secondary: secondaryStyles,
    tertiary: tertiaryStyles,
    info: infoStyles,
    success: successStyles,
    warning: warningStyles,
    error: errorStyles,
  };
  /**
   * ToDo: as of now button on hover becomes outline buttons but
   * button type should be primary, secondary, tertiary, disable, accent, link
   * button secondary type can be outline, may be
   * button state should be info, success, error (will be same as cancel or close), warning
   */
  const commonStyles = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded px-4 py-2 transition ${fullWidth ? 'w-full' : ''}`;
  return (
    <button className={`${btnStyles[btnType]} ${commonStyles}`} disabled={isDisabled} onClick={onClickHandle}>
      {children}
    </button>
  );
};

export default Button;
