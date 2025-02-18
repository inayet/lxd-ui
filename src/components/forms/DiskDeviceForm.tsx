import React, { FC } from "react";
import { Input, useNotify } from "@canonical/react-components";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { fetchStoragePools } from "api/storage-pools";
import { SharedFormikTypes } from "./sharedFormTypes";
import { fetchProfiles } from "api/profiles";
import Loader from "components/Loader";
import { figureInheritedVolumes } from "util/instanceConfigInheritance";
import DiskDeviceFormRoot from "./DiskDeviceFormRoot";
import DiskDeviceFormInherited from "./DiskDeviceFormInherited";
import DiskDeviceFormCustom from "./DiskDeviceFormCustom";
import classnames from "classnames";

interface Props {
  formik: SharedFormikTypes;
  project: string;
}

const DiskDeviceForm: FC<Props> = ({ formik, project }) => {
  const notify = useNotify();

  const {
    data: profiles = [],
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: [queryKeys.profiles],
    queryFn: () => fetchProfiles(project),
  });

  if (profileError) {
    notify.failure("Loading profiles failed", profileError);
  }

  const {
    data: storagePools = [],
    isLoading: isStorageLoading,
    error: storageError,
  } = useQuery({
    queryKey: [queryKeys.storage],
    queryFn: () => fetchStoragePools(project),
  });

  if (storageError) {
    notify.failure("Loading storage pools failed", storageError);
  }

  if (isProfileLoading || isStorageLoading) {
    return <Loader />;
  }

  const inheritedVolumes = figureInheritedVolumes(formik.values, profiles);

  return (
    <div
      className={classnames("disk-device-form", {
        "disk-device-form--edit": !formik.values.readOnly,
      })}
    >
      {/* hidden submit to enable enter key in inputs */}
      <Input type="submit" hidden />
      <DiskDeviceFormRoot
        formik={formik}
        project={project}
        storagePools={storagePools}
        profiles={profiles}
      />
      <DiskDeviceFormInherited
        formik={formik}
        inheritedVolumes={inheritedVolumes}
      />
      <DiskDeviceFormCustom
        formik={formik}
        project={project}
        inheritedVolumes={inheritedVolumes}
      />
    </div>
  );
};

export default DiskDeviceForm;
