// import React, { useState } from 'react';
// import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
// import { PlusIcon } from '@heroicons/react/20/solid';
// import { BUTTON_TYPES } from 'constants/Common';
// import NewCollection from 'components/molecules/modals/create/NewCollectionModal';
// import ImportCollectionModal from 'components/molecules/modals/ImportCollectionModal';
// import Button from 'components/atoms/common/Button';

// const EmptyDirectory = () => {
//   const [newCollectionModalOpen, setNewCollectionModalOpen] = useState(false);
//   const [importCollectionModal, setImportCollectionModal] = useState(false);
//   return (
//     <>
//       <div className='flex flex-col items-center justify-center p-4'>
//         <div className='text-xs font-medium'>Create or Import a collection</div>
//         <div className='flex flex-col items-stretch gap-4 mt-4'>
//           <Button
//             btnType={BUTTON_TYPES.primary}
//             isDisabled={false}
//             onClickHandle={() => setNewCollectionModalOpen(true)}
//           >
//             <FolderArrowDownIcon className='w-4 h-4' />
//             <span className='font-semibold'>New</span>
//           </Button>
//           <Button
//             btnType={BUTTON_TYPES.primary}
//             isDisabled={false}
//             onClickHandle={() => setImportCollectionModal(true)}
//           >
//             <PlusIcon className='w-4 h-4' />
//             <span className='font-semibold'>Import</span>
//           </Button>
//         </div>
//       </div>
//       <div>
//         <NewCollection closeFn={() => setNewCollectionModalOpen(false)} open={newCollectionModalOpen} />
//         <ImportCollectionModal closeFn={() => setImportCollectionModal(false)} open={importCollectionModal} />
//       </div>
//     </>
//   );
// };

// export default EmptyDirectory;
