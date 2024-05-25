export const AppNavBarItems = {
  // default value
  collections: {
    displayValue: 'Collections',
    value: 'COLLECTIONS',
    active: true, // by default active state
    disable: false,
  },
  environments: {
    displayValue: 'Environments',
    value: 'ENVIRONMENTS',
    active: false,
    disable: false,
  },
  history: {
    displayValue: 'History',
    value: 'HISTORY',
    active: false,
    disable: true,
  },
};

export const AppNavBarStyles = {
  collapsedNavBarWidth: {
    absolute: 56,
    pixelInString: '56px',
    tailwindValue: {
      default: 'w-14',
      min: 'min-w-14',
    },
  },
  expandedNavBarWidth: {
    absolute: 12,
    pixelInString: '12px',
    tailwindValue: {
      default: 'w-28',
      min: 'min-w-28',
    },
  },
};
