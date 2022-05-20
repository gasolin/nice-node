import { useState } from 'react';

import electron from '../electronGlobal';
import MenuDrawer from './MenuDrawer';
import { useGetExecutionNodeInfoQuery } from '../state/services';
import DynamicNodeConfig from './DynamicNodeConfig';
import { useAppSelector } from '../state/hooks';
import { selectSelectedNode } from '../state/node';
// import NiceNodeSettings from './NiceNodeSettings';

type Props = {
  isOpen: boolean | undefined;
  onClickCloseButton: () => void;
};

const DynamicSettings = ({ isOpen, onClickCloseButton }: Props) => {
  const selectedNode = useAppSelector(selectSelectedNode);
  const qNodeInfo = useGetExecutionNodeInfoQuery(null, {
    pollingInterval: 60000,
  });
  const [sGethDeleteResult, setGethDeleteResult] = useState<boolean>();

  let title = 'Settings';
  if (selectedNode) {
    title = `${selectedNode.spec.displayName} settings`;
  }
  return (
    <MenuDrawer
      title={title}
      isSelected={!!isOpen}
      onClickCloseButton={onClickCloseButton}
    >
      <DynamicNodeConfig />
      {/* <NiceNodeSettings /> */}
      {qNodeInfo?.currentData && !qNodeInfo?.isError && (
        <h4>Running: {qNodeInfo.currentData}</h4>
      )}
      <h2>Storage</h2>
      <div>
        <h3>Delete node data</h3>
        <p>
          Your node requires this data to run and will require time and internet
          data to recover if deleted. Only delete node data if you do not intend
          to run a node.
        </p>
        {/* todo */}
        <button
          type="button"
          onClick={async () => {
            console.log('Deleting Geth Data');
            // clear result while waiting for delete to return
            setGethDeleteResult(undefined);
            setGethDeleteResult(await electron.deleteGethDisk());
          }}
          style={{ marginLeft: 10, backgroundColor: 'red', color: 'white' }}
        >
          <span>Delete</span>
        </button>
        {sGethDeleteResult !== undefined && (
          <>
            {sGethDeleteResult ? (
              <span>Delete successful</span>
            ) : (
              <span>Delete failed</span>
            )}
          </>
        )}
      </div>
    </MenuDrawer>
  );
};
export default DynamicSettings;
