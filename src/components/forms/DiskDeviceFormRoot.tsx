import React, { FC } from "react";
import { Button, Icon } from "@canonical/react-components";
import { LxdDiskDevice } from "types/device";
import { SharedFormikTypes } from "./sharedFormTypes";
import ConfigurationTable from "components/ConfigurationTable";
import { EditInstanceFormValues } from "pages/instances/EditInstanceForm";
import { getConfigurationRowBase } from "components/ConfigurationRow";
import { figureInheritedRootStorage } from "util/instanceConfigInheritance";
import StoragePoolSelector from "pages/storage/StoragePoolSelector";
import { getDiskDeviceRow } from "./DiskDeviceRow";
import DiskSizeSelector from "components/forms/DiskSizeSelector";
import { LxdStoragePool } from "types/storage";
import { LxdProfile } from "types/profile";
import { removeDevice } from "util/formDevices";

interface Props {
  formik: SharedFormikTypes;
  project: string;
  storagePools: LxdStoragePool[];
  profiles: LxdProfile[];
}

const DiskDeviceFormRoot: FC<Props> = ({
  formik,
  project,
  storagePools,
  profiles,
}) => {
  const isReadOnly = (formik.values as EditInstanceFormValues).readOnly;
  const rootIndex = formik.values.devices.findIndex(
    (item) => item.type === "disk" && item.name === "root",
  );
  const hasRootStorage = rootIndex !== -1;
  const formRootDevice = formik.values.devices[
    rootIndex
  ] as LxdDiskDevice | null;

  const [inheritValue, inheritSource] = figureInheritedRootStorage(
    formik.values,
    profiles,
  );

  const addRootStorage = () => {
    const copy = [...formik.values.devices];
    copy.push({
      type: "disk",
      name: "root",
      path: "/",
      pool: inheritValue
        ? inheritValue.pool
        : storagePools[0]?.name ?? undefined,
    });
    void formik.setFieldValue("devices", copy);

    const newDeviceIndex = copy.length - 1;
    void formik.setFieldValue(`devices.${newDeviceIndex}.size`, "GiB");
  };

  return (
    <>
      <h2 className="p-heading--4">Root storage</h2>
      <ConfigurationTable
        rows={[
          getConfigurationRowBase({
            className: "override-with-form",
            configuration: <b className="device-name">Root storage</b>,
            inherited: "",
            override:
              !isReadOnly &&
              (hasRootStorage ? (
                <div>
                  <Button
                    onClick={() => removeDevice(rootIndex, formik)}
                    type="button"
                    appearance="base"
                    title="Clear override"
                    hasIcon
                    className="u-no-margin--bottom"
                  >
                    <Icon name="close" className="clear-configuration-icon" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={addRootStorage}
                  type="button"
                  appearance="base"
                  title="Create override"
                  className="u-no-margin--bottom"
                  hasIcon
                >
                  <Icon name="edit" />
                </Button>
              )),
          }),

          getDiskDeviceRow({
            label: "Pool",
            id: "storage-pool-selector",
            className: "override-with-form",
            inheritValue: inheritValue?.pool ?? "",
            inheritSource,
            isReadOnly,
            overrideValue: formRootDevice?.pool,
            overrideForm: (
              <StoragePoolSelector
                project={project}
                value={formRootDevice?.pool ?? ""}
                setValue={(value) =>
                  void formik.setFieldValue(`devices.${rootIndex}.pool`, value)
                }
                selectProps={{
                  className: "u-no-margin--bottom",
                }}
              />
            ),
          }),

          getDiskDeviceRow({
            label: "Size",
            id: "limits_disk",
            className: "override-with-form",
            inheritValue:
              inheritValue?.size ?? (inheritValue ? "unlimited" : ""),
            inheritSource,
            isReadOnly,
            overrideValue:
              formRootDevice?.size ?? (hasRootStorage ? "unlimited" : ""),
            overrideForm: (
              <>
                <DiskSizeSelector
                  value={formRootDevice?.size ?? "GiB"}
                  setMemoryLimit={(val?: string) =>
                    void formik.setFieldValue(`devices.${rootIndex}.size`, val)
                  }
                />
                <p className="p-form-help-text u-sv-2">
                  Size of root storage. If empty, root storage will not have a
                  size limit.
                </p>
              </>
            ),
          }),
        ]}
      />
    </>
  );
};

export default DiskDeviceFormRoot;
