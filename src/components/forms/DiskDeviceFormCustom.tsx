import React, { FC } from "react";
import { Icon, Input, Label } from "@canonical/react-components";
import { SharedFormikTypes } from "./sharedFormTypes";
import { EditInstanceFormValues } from "pages/instances/EditInstanceForm";
import { InheritedVolume } from "util/instanceConfigInheritance";
import CustomVolumeSelectBtn from "pages/storage/CustomVolumeSelectBtn";
import { FormDiskDevice, removeDevice } from "util/formDevices";
import { LxdStorageVolumeWithPool } from "context/loadCustomVolumes";
import RenameDiskDeviceInput from "./RenameDiskDeviceInput";
import ConfigurationTable from "components/ConfigurationTable";
import { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { getConfigurationRowBase } from "components/ConfigurationRow";
import DetachDiskDeviceBtn from "pages/instances/actions/DetachDiskDeviceBtn";
import classnames from "classnames";

interface Props {
  formik: SharedFormikTypes;
  project: string;
  inheritedVolumes: InheritedVolume[];
}

const DiskDeviceFormCustom: FC<Props> = ({
  formik,
  project,
  inheritedVolumes,
}) => {
  const isReadOnly = (formik.values as EditInstanceFormValues).readOnly;
  const customVolumes = formik.values.devices
    .filter((device) => device.name !== "root" && device.type === "disk")
    .map((device) => device as FormDiskDevice);

  const addVolume = (volume: LxdStorageVolumeWithPool) => {
    const copy = [...formik.values.devices];
    copy.push({
      type: "disk",
      name: deduplicateName(1),
      path: volume.content_type === "filesystem" ? "" : undefined,
      pool: volume.pool,
      source: volume.name,
    });
    void formik.setFieldValue("devices", copy);
  };

  const changeVolume = (
    volume: LxdStorageVolumeWithPool,
    formVolume: FormDiskDevice,
    index: number,
  ) => {
    void formik.setFieldValue(`devices.${index}.pool`, volume.pool);
    void formik.setFieldValue(`devices.${index}.source`, volume.name);
    if (volume.content_type === "filesystem" && formVolume.path === undefined) {
      void formik.setFieldValue(`devices.${index}.path`, "");
    }
    if (volume.content_type === "block") {
      void formik.setFieldValue(`devices.${index}.path`, undefined);
    }
  };

  const deduplicateName = (index: number): string => {
    const candidate = `volume-${index}`;
    const hasConflict =
      formik.values.devices.some((item) => item.name === candidate) ||
      inheritedVolumes.some((item) => item.key === candidate);
    if (hasConflict) {
      return deduplicateName(index + 1);
    }
    return candidate;
  };

  const rows: MainTableRow[] = [];

  customVolumes.map((formVolume) => {
    const index = formik.values.devices.indexOf(formVolume);

    rows.push(
      getConfigurationRowBase({
        className: "no-border-top custom-disk-device-name",
        configuration: (
          <RenameDiskDeviceInput
            name={formVolume.name}
            index={index}
            isReadOnly={isReadOnly}
            setName={(name) =>
              void formik.setFieldValue(`devices.${index}.name`, name)
            }
          />
        ),
        inherited: "",
        override: !isReadOnly && (
          <DetachDiskDeviceBtn onDetach={() => removeDevice(index, formik)} />
        ),
      }),
    );

    rows.push(
      getConfigurationRowBase({
        className: "no-border-top inherited-with-form",
        configuration: (
          <Label forId={`pool-${index}-pool`}>Pool / volume</Label>
        ),
        inherited: (
          <div className="custom-disk-volume-source">
            <div
              className={classnames("mono-font", {
                "u-truncate": !formik.values.readOnly,
              })}
              title={
                formik.values.readOnly
                  ? undefined
                  : `${formVolume.pool} / ${formVolume.source ?? ""}`
              }
            >
              <b>
                {formVolume.pool} / {formVolume.source}
              </b>
            </div>
            {!isReadOnly && (
              <CustomVolumeSelectBtn
                project={project}
                setValue={(volume) => changeVolume(volume, formVolume, index)}
                buttonProps={{
                  id: `pool-${index}-pool`,
                  appearance: "base",
                  className: "u-no-margin--bottom",
                }}
              >
                <Icon name="edit" />
              </CustomVolumeSelectBtn>
            )}
          </div>
        ),
        override: "",
      }),
    );

    if (formVolume.path !== undefined) {
      rows.push(
        getConfigurationRowBase({
          className: "no-border-top inherited-with-form",
          configuration: (
            <Label forId={`pool-${index}-path`} required>
              Mount point
            </Label>
          ),
          inherited: isReadOnly ? (
            <div className="mono-font">
              <b>{formVolume.path}</b>
            </div>
          ) : (
            <Input
              id={`pool-${index}-path`}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                void formik.setFieldValue(
                  `devices.${index}.path`,
                  e.target.value,
                );
              }}
              value={formVolume.path}
              type="text"
              placeholder="Enter full path (e.g. /data)"
              className="u-no-margin--bottom"
            />
          ),
          override: "",
        }),
      );
    }

    rows.push(
      getConfigurationRowBase({
        className: "no-border-top inherited-with-form",
        configuration: (
          <Label forId={`pool-${index}-read-limit`}>Read limit</Label>
        ),
        inherited: isReadOnly ? (
          <div className="mono-font">
            <b>
              {formVolume.limits?.read
                ? `${formVolume.limits.read} IOPS`
                : "none"}
            </b>
          </div>
        ) : (
          <div className="custom-disk-device-limits">
            <Input
              id={`pool-${index}-read-limit`}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                void formik.setFieldValue(
                  `devices.${index}.limits.read`,
                  e.target.value,
                );
              }}
              value={formVolume.limits?.read}
              type="number"
              placeholder="Enter number"
              className="u-no-margin--bottom"
            />
            <div>IOPS</div>
          </div>
        ),
        override: "",
      }),
    );

    rows.push(
      getConfigurationRowBase({
        className: "no-border-top inherited-with-form",
        configuration: (
          <Label forId={`pool-${index}-write-limit`}>Write limit</Label>
        ),
        inherited: isReadOnly ? (
          <div className="mono-font">
            <b>
              {formVolume.limits?.write
                ? `${formVolume.limits.write} IOPS`
                : "none"}
            </b>
          </div>
        ) : (
          <div className="custom-disk-device-limits">
            <Input
              id={`pool-${index}-write-limit`}
              onBlur={formik.handleBlur}
              onChange={(e) => {
                void formik.setFieldValue(
                  `devices.${index}.limits.write`,
                  e.target.value,
                );
              }}
              value={formVolume.limits?.write}
              type="number"
              placeholder="Enter number"
              className="u-no-margin--bottom"
            />
            <div>IOPS</div>
          </div>
        ),
        override: "",
      }),
    );
  });

  return (
    <div className="custom-disk-devices">
      {customVolumes.length > 0 && (
        <>
          <h2 className="p-heading--4 custom-disk-devices-heading">
            Custom devices
          </h2>
          <ConfigurationTable rows={rows} />
        </>
      )}
      {!isReadOnly && (
        <CustomVolumeSelectBtn project={project} setValue={addVolume}>
          <Icon name="plus" />
          <span>Attach disk device</span>
        </CustomVolumeSelectBtn>
      )}
    </div>
  );
};

export default DiskDeviceFormCustom;
