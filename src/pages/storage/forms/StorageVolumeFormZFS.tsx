import React, { FC } from "react";
import { Select } from "@canonical/react-components";
import { StorageVolumeFormValues } from "pages/storage/forms/StorageVolumeForm";
import { FormikProps } from "formik/dist/types";
import ConfigurationTable from "components/ConfigurationTable";
import { getStorageConfigurationRow } from "pages/storage/forms/StorageConfigurationRow";
import { optionTrueFalse } from "util/instanceOptions";

interface Props {
  formik: FormikProps<StorageVolumeFormValues>;
}

const StorageVolumeFormZFS: FC<Props> = ({ formik }) => {
  return (
    <ConfigurationTable
      rows={[
        getStorageConfigurationRow({
          formik: formik,
          label: "ZFS blocksize",
          name: "zfs_blocksize",
          defaultValue: "",
          help: "Size of the ZFS blocks",
          children: (
            <Select
              options={[
                {
                  label: "default",
                  value: "",
                },
                {
                  label: "512",
                  value: "512",
                },
                {
                  label: "1024",
                  value: "1024",
                },
                {
                  label: "2048",
                  value: "2048",
                },
                {
                  label: "4096",
                  value: "4096",
                },
                {
                  label: "8192",
                  value: "8192",
                },
                {
                  label: "16384",
                  value: "16384",
                },
              ]}
            />
          ),
        }),

        getStorageConfigurationRow({
          formik: formik,
          label: "ZFS block mode",
          name: "zfs_block_mode",
          defaultValue: "",
          help: "Whether to use a formatted zvol rather than a dataset (zfs.block_mode can be set only for custom storage volumes; use volume.zfs.block_mode to enable ZFS block mode for all storage volumes in the pool, including instance volumes)",
          children: <Select options={optionTrueFalse} />,
        }),

        getStorageConfigurationRow({
          formik: formik,
          label: "ZFS delegate",
          name: "zfs_delegate",
          defaultValue: "",
          help: "Controls whether to delegate the ZFS dataset and anything underneath it to the container(s) using it. Allows the use of the zfs command in the container.",
          children: <Select options={optionTrueFalse} />,
        }),

        getStorageConfigurationRow({
          formik: formik,
          label: "ZFS remove snapshots",
          name: "zfs_remove_snapshots",
          defaultValue: "",
          help: "Remove snapshots as needed",
          children: <Select options={optionTrueFalse} />,
        }),

        getStorageConfigurationRow({
          formik: formik,
          label: "ZFS use refquota",
          name: "zfs_use_refquota",
          defaultValue: "",
          help: "Use refquota instead of quota for space",
          children: <Select options={optionTrueFalse} />,
        }),

        getStorageConfigurationRow({
          formik: formik,
          label: "ZFS reserve space",
          name: "zfs_reserve_space",
          defaultValue: "",
          help: "Use reservation/refreservation along with quota/refquota",
          children: <Select options={optionTrueFalse} />,
        }),
      ]}
    />
  );
};

export default StorageVolumeFormZFS;
