import React, { ReactElement, ReactNode } from "react";
import { Button, Icon, Label, Tooltip } from "@canonical/react-components";
import { CpuLimit, MemoryLimit } from "types/limits";
import { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import classnames from "classnames";
import { FormikProps } from "formik/dist/types";

interface Props {
  formik: FormikProps<unknown>;
  name: string;
  label: string | ReactNode;
  children: ReactElement;
  defaultValue?: string | CpuLimit | MemoryLimit | boolean;
  disabled?: boolean;
  disabledReason?: string;
  help?: string;
  isOverridden: boolean;
  inheritedValue: string | ReactNode;
  inheritSource: string;
  isReadOnly: boolean;
  value?: string;
  overrideValue: string | ReactNode;
}

export const getConfigurationRow = ({
  formik,
  name,
  label,
  children,
  defaultValue,
  disabled = false,
  disabledReason,
  help,
  isOverridden,
  inheritedValue,
  inheritSource,
  isReadOnly,
  value,
  overrideValue,
}: Props): MainTableRow => {
  const toggleDefault = () => {
    if (isOverridden) {
      void formik.setFieldValue(name, undefined);
    } else {
      void formik.setFieldValue(name, defaultValue);
      setTimeout(() => document.getElementById(name)?.focus(), 100);
    }
  };

  const getForm = (): ReactNode => {
    return (
      <div className="override-form">
        {wrapDisabledTooltip(
          <div>
            {React.cloneElement(children, {
              id: name,
              name,
              onBlur: formik.handleBlur,
              onChange: formik.handleChange,
              value,
              disabled,
            })}
          </div>,
        )}
        <div>
          <Button
            onClick={toggleDefault}
            type="button"
            appearance="base"
            title="Clear override"
            hasIcon
          >
            <Icon name="close" className="clear-configuration-icon" />
          </Button>
        </div>
      </div>
    );
  };

  const displayLabel = isOverridden ? (
    <Label forId={name}>
      <b>{label}</b>
    </Label>
  ) : (
    <b>{label}</b>
  );

  const helpText = help ? (
    <div className="configuration-help">{help}</div>
  ) : null;

  const wrapDisabledTooltip = (children: ReactNode): ReactNode => {
    if (disabled && disabledReason) {
      return (
        <Tooltip message={disabledReason} position="right">
          {children}
        </Tooltip>
      );
    }
    return children;
  };

  return getConfigurationRowBase({
    configuration: (
      <>
        {displayLabel}
        {helpText}
      </>
    ),
    inherited: (
      <div
        className={classnames({
          "u-text--muted": isOverridden,
          "u-text--line-through": isOverridden,
        })}
      >
        <div className="mono-font">
          <b>{inheritedValue}</b>
        </div>
        {inheritedValue && (
          <div className="p-text--small u-text--muted">
            From: {inheritSource}
          </div>
        )}
      </div>
    ),
    override: isReadOnly
      ? overrideValue
      : isOverridden
      ? getForm()
      : wrapDisabledTooltip(
          <Button
            onClick={toggleDefault}
            className="u-no-margin--bottom"
            type="button"
            disabled={disabled}
            appearance="base"
            title="Create override"
            hasIcon
          >
            <Icon name="edit" />
          </Button>,
        ),
  });
};

interface BaseProps {
  configuration: ReactNode;
  inherited: ReactNode;
  override: ReactNode;
  className?: string;
}

export const getConfigurationRowBase = ({
  configuration,
  inherited,
  override,
  className,
}: BaseProps): MainTableRow => {
  return {
    className,
    columns: [
      {
        content: configuration,
        className: "configuration",
      },
      {
        content: inherited,
        className: "inherited",
      },
      {
        content: override,
        className: "override",
      },
    ],
  };
};
