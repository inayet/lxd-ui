import React, { FC } from "react";
import { Button } from "@canonical/react-components";

interface Props {
  totalCount: number;
  filteredNames: string[];
  itemName: string;
  parentName: string;
  selectedNames: string[];
  setSelectedNames: (val: string[]) => void;
}

const SelectedTableNotification: FC<Props> = ({
  totalCount,
  filteredNames,
  itemName,
  parentName,
  selectedNames,
  setSelectedNames,
}: Props) => {
  const isAllSelected = selectedNames.length === filteredNames.length;

  const selectAll = () => {
    setSelectedNames(filteredNames);
  };

  const selectNone = () => {
    setSelectedNames([]);
  };

  return (
    <div>
      {isAllSelected ? (
        <>
          {filteredNames.length === 1 ? (
            <>
              <b>1</b> {itemName} is selected.{" "}
            </>
          ) : (
            <>
              All <b>{filteredNames.length}</b> {itemName}s selected.{" "}
            </>
          )}
          <Button
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={selectNone}
          >
            Clear selection
          </Button>
        </>
      ) : (
        <>
          <b>{selectedNames.length}</b> {itemName}
          {selectedNames.length > 1 && "s"} selected.{" "}
          <Button
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={selectAll}
          >
            Select all <b>{filteredNames.length}</b>{" "}
            {filteredNames.length === totalCount ? parentName : "filtered"}{" "}
            {itemName}s
          </Button>
        </>
      )}
    </div>
  );
};

export default SelectedTableNotification;
