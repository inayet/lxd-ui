import React, { FC, ReactNode } from "react";
import { useNotify } from "@canonical/react-components";
import { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import ScrollableTable from "components/ScrollableTable";
import ConfigurationTable from "components/ConfigurationTable";

interface Props {
  rows: MainTableRow[];
  configurationExtra?: ReactNode;
  emptyStateMsg?: string;
}

const InstanceConfigurationTable: FC<Props> = ({
  rows,
  configurationExtra,
  emptyStateMsg,
}) => {
  const notify = useNotify();

  return (
    <ScrollableTable dependencies={[notify.notification]} belowId="form-footer">
      <ConfigurationTable
        rows={rows}
        configurationExtra={configurationExtra}
        emptyStateMsg={emptyStateMsg}
      />
    </ScrollableTable>
  );
};

export default InstanceConfigurationTable;
