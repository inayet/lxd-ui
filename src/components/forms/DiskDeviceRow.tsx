import React, { ReactNode } from "react";
import { Button, Icon, Label } from "@canonical/react-components";
import { getConfigurationRowBase } from "components/ConfigurationRow";
import classnames from "classnames";
import { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";

interface Props {
  id?: string;
  label: string;
  inheritValue: ReactNode;
  inheritSource: string;
  isReadOnly: boolean;
  overrideValue?: string;
  overrideForm?: ReactNode;
  addOverride?: () => void;
  clearOverride?: () => void;
  isDeactivated?: boolean;
  className?: string;
}

export const getDiskDeviceRow = ({
  id,
  label,
  inheritValue,
  inheritSource,
  isReadOnly,
  overrideValue,
  overrideForm,
  addOverride,
  clearOverride,
  isDeactivated,
  className,
}: Props): MainTableRow => {
  return getConfigurationRowBase({
    className: classnames("no-border-top", className),
    configuration: id ? (
      <Label
        forId={id}
        className={classnames({
          "u-text--muted": isDeactivated,
        })}
      >
        {label}
      </Label>
    ) : (
      <div
        className={classnames({
          "u-text--muted": isDeactivated,
        })}
      >
        {label}
      </div>
    ),
    inherited: inheritValue && inheritSource && (
      <div
        className={classnames({
          "u-text--muted": overrideValue || isDeactivated,
          "u-text--line-through": overrideValue || isDeactivated,
        })}
      >
        <div className="mono-font">
          <b>{inheritValue}</b>
        </div>
        <div className="p-text--small u-text--muted u-no-margin--bottom">
          From: {inheritSource}
        </div>
      </div>
    ),
    override: isReadOnly ? (
      overrideValue ? (
        <div className="mono-font">
          <b>{overrideValue}</b>
        </div>
      ) : (
        ""
      )
    ) : overrideValue ? (
      <div className="override-form">
        <div>{overrideForm}</div>
        {clearOverride && (
          <div>
            <Button
              onClick={clearOverride}
              type="button"
              appearance="base"
              title="Clear override"
              hasIcon
              className="u-no-margin--bottom"
            >
              <Icon name="close" className="clear-configuration-icon" />
            </Button>
          </div>
        )}
      </div>
    ) : (
      addOverride && (
        <Button
          onClick={addOverride}
          type="button"
          appearance="base"
          title="Create override"
          className="u-no-margin--bottom"
          hasIcon
        >
          <Icon name="edit" />
        </Button>
      )
    ),
  });
};
