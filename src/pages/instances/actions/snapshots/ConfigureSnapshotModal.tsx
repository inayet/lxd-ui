import React, { FC, KeyboardEvent, ReactNode } from "react";
import { Button, Modal } from "@canonical/react-components";
import { LxdInstance } from "types/instance";
import { useFormik } from "formik";
import { updateInstance } from "api/instances";
import { queryKeys } from "util/queryKeys";
import { EditInstanceFormValues } from "pages/instances/EditInstanceForm";
import { useQueryClient } from "@tanstack/react-query";
import SnapshotsForm from "components/forms/SnapshotsForm";
import { useParams } from "react-router-dom";
import {
  getInstanceEditValues,
  getInstancePayload,
  InstanceEditSchema,
} from "util/instanceEdit";
import SubmitButton from "components/SubmitButton";
import { useEventQueue } from "context/eventQueue";

interface Props {
  instance: LxdInstance;
  close: () => void;
  onSuccess: (message: ReactNode) => void;
  onFailure: (title: string, e: unknown) => void;
}

const ConfigureSnapshotModal: FC<Props> = ({
  instance,
  close,
  onSuccess,
  onFailure,
}) => {
  const eventQueue = useEventQueue();
  const { project } = useParams<{ project: string }>();
  const queryClient = useQueryClient();

  const formik = useFormik<EditInstanceFormValues>({
    initialValues: getInstanceEditValues(instance),
    validationSchema: InstanceEditSchema,
    onSubmit: (values) => {
      const instancePayload = getInstancePayload(
        instance,
        values,
      ) as LxdInstance;

      void updateInstance(instancePayload, project ?? "").then((operation) => {
        eventQueue.set(
          operation.metadata.id,
          () => onSuccess("Configuration updated."),
          (msg) => onFailure("Configuration update failed", new Error(msg)),
          () => {
            close();
            void queryClient.invalidateQueries({
              queryKey: [queryKeys.instances],
            });
          },
        );
      });
    },
  });

  const handleEscKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Escape") {
      close();
    }
  };

  return (
    <Modal
      close={close}
      className="edit-snapshot-config"
      title="Snapshot configuration"
      buttonRow={
        formik.values.readOnly ? (
          <div className="u-space-between u-flex-row-reverse">
            <Button
              className="u-no-margin--bottom u-no-margin--right"
              onClick={close}
            >
              Close
            </Button>
            <Button
              className="u-no-margin--bottom"
              type="button"
              onClick={() => void formik.setFieldValue("readOnly", false)}
            >
              Edit configuration
            </Button>
          </div>
        ) : (
          <>
            <Button
              className="u-no-margin--bottom"
              type="button"
              onClick={close}
            >
              Cancel
            </Button>
            <SubmitButton
              buttonLabel="Save"
              className="u-no-margin--bottom"
              isSubmitting={formik.isSubmitting}
              isDisabled={formik.isSubmitting}
              onClick={() => void formik.submitForm()}
            />
          </>
        )
      }
      onKeyDown={handleEscKey}
    >
      <SnapshotsForm formik={formik} />
    </Modal>
  );
};

export default ConfigureSnapshotModal;
