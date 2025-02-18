import React, { FC, ReactNode } from "react";
import { Row, Input, Select, Col, Textarea } from "@canonical/react-components";
import { FormikProps } from "formik";
import {
  zfsDriver,
  storageDrivers,
  dirDriver,
  btrfsDriver,
  getSourceHelpForDriver,
} from "util/storageOptions";
import { StoragePoolFormValues } from "./StoragePoolForm";
import { getTextareaRows } from "util/formFields";
import DiskSizeSelector from "components/forms/DiskSizeSelector";

interface Props {
  formik: FormikProps<StoragePoolFormValues>;
}

const StoragePoolFormMain: FC<Props> = ({ formik }) => {
  const getFormProps = (id: "name" | "description" | "size" | "source") => {
    return {
      id: id,
      name: id,
      onBlur: formik.handleBlur,
      onChange: formik.handleChange,
      value: formik.values[id],
      error: formik.touched[id] ? (formik.errors[id] as ReactNode) : null,
      placeholder: `Enter ${id.replaceAll("_", " ")}`,
    };
  };

  return (
    <Row>
      <Col size={8}>
        <Input {...getFormProps("name")} type="text" label="Name" required />
        <Textarea
          {...getFormProps("description")}
          label="Description"
          rows={getTextareaRows(formik.values.description?.length)}
        />
        <Select
          id="driver"
          name="driver"
          help={
            formik.values.driver === zfsDriver
              ? "ZFS gives best performance and reliability"
              : undefined
          }
          label="Driver"
          options={storageDrivers}
          onChange={(target) => {
            const val = target.target.value;
            if (val === dirDriver) {
              void formik.setFieldValue("size", "");
            }
            if (val === btrfsDriver) {
              void formik.setFieldValue("source", "");
            }
            void formik.setFieldValue("driver", val);
          }}
          value={formik.values.driver}
          required
        />
        <DiskSizeSelector
          label="Size"
          value={formik.values.size}
          help={
            formik.values.driver === dirDriver
              ? "Not available"
              : "When left blank, defaults to 20% of free disk space. Default will be between 5GiB and 30GiB"
          }
          setMemoryLimit={(val?: string) =>
            void formik.setFieldValue("size", val)
          }
          disabled={formik.values.driver === dirDriver}
        />
        <Input
          {...getFormProps("source")}
          type="text"
          disabled={formik.values.driver === btrfsDriver}
          help={getSourceHelpForDriver(formik.values.driver)}
          label="Source"
        />
      </Col>
    </Row>
  );
};

export default StoragePoolFormMain;
