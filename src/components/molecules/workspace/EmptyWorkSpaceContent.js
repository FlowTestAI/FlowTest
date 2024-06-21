import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { RectangleStackIcon, Square3Stack3DIcon } from '@heroicons/react/24/solid';
import useCollectionStore from 'stores/CollectionStore';
import HorizontalDivider from 'components/atoms/common/HorizontalDivider';
import Button from 'components/atoms/common/Button';
import { BUTTON_TYPES } from 'constants/Common';
import ImportCollectionModal from '../modals/ImportCollectionModal';
import GenerateFlowTestModal from '../modals/GenerateFlowTestModal';
import NewFlowTestModal from '../modals/flow/NewFlowTestModal';
import NewEnvironmentFileModal from '../modals/sidebar/NewEnvironmentFileModal';
import OpenCollectionModal from '../modals/OpenCollectionModal';
import GenAIUsageDisclaimer from '../modals/GenAIUsageDisclaimer';
import useSettingsStore from 'stores/SettingsStore';

const EmptyWorkSpaceContent = () => {
  const collections = useCollectionStore((state) => state.collections);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [importCollectionModal, setImportCollectionModal] = useState(false);
  const [newFlowTestModal, setNewFlowTestModal] = useState(false);
  const [generateFlowTestModalOpen, setGenerateFlowTestModalOpen] = useState(false);
  const [genAiUsageDisclaimerModalOpen, setGenAiUsageDisclaimerModalOpen] = useState(false);
  const [newEnvironmentFileModal, setNewEnvironmentFileModal] = useState(false);

  return (
    <div className='flex h-full items-center justify-center text-cyan-900'>
      <div className='flex max-w-xl flex-col gap-8 2xl:gap-10'>
        <div className='text-center'>
          <div className='flex items-center justify-center'>
            <RectangleStackIcon className='h-24 w-24' />
          </div>
          <p className='text-2xl'>
            A <span className='font-montserrat font-semibold italic'>Collection</span> is a ...
          </p>
          <p className='mt-2 text-sm italic 2xl:mt-4'>
            A Collection is a set of flows where each flow is a set of API requests chained together, along with each
            endpoint&lsquo;s authorization type, parameters, headers, request bodies, and settings. A collection enables
            you to organize your flows into folders or subfolders directly on your local file system. You can then
            collaborate on these collections with team members using git or any version control system.
          </p>
          <div className='flex items-center justify-between gap-6 pt-4 2xl:pt-6'>
            {collections.length ? (
              <>
                <Button
                  btnType={BUTTON_TYPES.primary}
                  isDisabled={false}
                  onClickHandle={() => setNewFlowTestModal(true)}
                  fullWidth={true}
                >
                  Create a Flow
                </Button>
                <Button
                  btnType={BUTTON_TYPES.primary}
                  isDisabled={false}
                  onClickHandle={() => {
                    if (useSettingsStore.getState().genAIUsageDisclaimer === true) {
                      setGenerateFlowTestModalOpen(true);
                    } else {
                      setGenAiUsageDisclaimerModalOpen(true);
                    }
                  }}
                  fullWidth={true}
                >
                  Generate a Flow
                </Button>
              </>
            ) : (
              <>
                <Button
                  btnType={BUTTON_TYPES.primary}
                  isDisabled={false}
                  onClickHandle={() => setOpenCollectionModal(true)}
                  fullWidth={true}
                >
                  Open a Collection
                </Button>
                <Button
                  btnType={BUTTON_TYPES.primary}
                  isDisabled={false}
                  onClickHandle={() => setImportCollectionModal(true)}
                  fullWidth={true}
                >
                  Create a Collection
                </Button>
              </>
            )}
          </div>
        </div>
        {collections.length ? (
          <>
            <HorizontalDivider themeColor={'bg-cyan-900'} themeStyles={'opacity-75'} />
            <div className='text-center'>
              <div className='flex items-center justify-center'>
                <Square3Stack3DIcon className='h-24 w-24' />
              </div>
              <p className='text-2xl'>
                An <span className='font-montserrat font-semibold italic'>Environment</span> is a ...
              </p>
              <p className='mt-2 text-sm italic 2xl:mt-4'>
                An environment is a set of one or more variables that you can reference when sending API requests using
                &#123;&#123; variable &#125;&#125;. When you switch between environments, all of the variables in your
                requests will use the values from the current environment. This is helpful if you need to use different
                values in your requests depending on the context, for example, if you are sending a request to a test
                server or a production server.
              </p>
              <div className='flex items-center justify-between gap-6 pt-4 2xl:pt-6'>
                <Button
                  btnType={BUTTON_TYPES.primary}
                  isDisabled={false}
                  onClickHandle={() => setNewEnvironmentFileModal(true)}
                  fullWidth={true}
                >
                  Create Environment
                </Button>
              </div>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
      <OpenCollectionModal closeFn={() => setOpenCollectionModal(false)} open={openCollectionModal} />
      <ImportCollectionModal closeFn={() => setImportCollectionModal(false)} open={importCollectionModal} />
      <NewFlowTestModal closeFn={() => setNewFlowTestModal(false)} open={newFlowTestModal} />
      <GenerateFlowTestModal closeFn={() => setGenerateFlowTestModalOpen(false)} open={generateFlowTestModalOpen} />
      <GenAIUsageDisclaimer
        closeFn={() => setGenAiUsageDisclaimerModalOpen(false)}
        open={genAiUsageDisclaimerModalOpen}
        openGenerateFlowTestModal={() => setGenerateFlowTestModalOpen(true)}
      />
      <NewEnvironmentFileModal closeFn={() => setNewEnvironmentFileModal(false)} open={newEnvironmentFileModal} />
    </div>
  );
};

export default EmptyWorkSpaceContent;
