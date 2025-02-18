import { ReactElement, ReactNode } from "react";
import { CpuLimit, MemoryLimit } from "types/limits";
import { MainTableRow } from "@canonical/react-components/dist/components/MainTable/MainTable";
import { FormikProps } from "formik/dist/types";
import { getLxdDefault } from "util/storageVolume";
import { StorageVolumeFormValues } from "pages/storage/forms/StorageVolumeForm";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { fetchStoragePool } from "api/storage-pools";
import { getConfigurationRow } from "components/ConfigurationRow";

interface Props {
  formik: FormikProps<StorageVolumeFormValues>;
  name: string;
  label: string | ReactNode;
  children: ReactElement;
  defaultValue?: string | CpuLimit | MemoryLimit | boolean;
  disabled?: boolean;
  disabledReason?: string;
  help?: string;
}

export const getStorageConfigurationRow = ({
  formik,
  name,
  label,
  children,
  defaultValue,
  disabled = false,
  disabledReason,
  help,
}: Props): MainTableRow => {
  const values = formik.values as unknown as Record<string, string | undefined>;
  const value = values[name];
  const isOverridden = value !== undefined;

  // when creating the defaults can be set on the storage pool
  const { data: storagePool } = useQuery({
    queryKey: [queryKeys.storage, formik.values.pool, formik.values.project],
    queryFn: () => fetchStoragePool(formik.values.pool, formik.values.project),
    enabled: formik.values.isCreating,
  });

  const [inheritedValue, inheritSource] = getLxdDefault(name, storagePool);
  const isReadOnly = formik.values.isReadOnly;
  const overrideValue = value === "" ? "-" : value;

  return getConfigurationRow({
    formik: formik as FormikProps<unknown>,
    name,
    label,
    children,
    defaultValue,
    disabled,
    disabledReason,
    help,
    isOverridden,
    inheritedValue,
    inheritSource,
    isReadOnly,
    value,
    overrideValue,
  });
};
