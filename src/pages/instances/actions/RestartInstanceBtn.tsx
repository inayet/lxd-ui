import React, { FC, useState } from "react";
import { LxdInstance } from "types/instance";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "util/queryKeys";
import { restartInstance } from "api/instances";
import { useInstanceLoading } from "context/instanceLoading";
import InstanceLink from "pages/instances/InstanceLink";
import ConfirmationForce from "components/ConfirmationForce";
import ItemName from "components/ItemName";
import {
  ConfirmationButton,
  Icon,
  useNotify,
} from "@canonical/react-components";
import { useEventQueue } from "context/eventQueue";

interface Props {
  instance: LxdInstance;
}

const RestartInstanceBtn: FC<Props> = ({ instance }) => {
  const eventQueue = useEventQueue();
  const instanceLoading = useInstanceLoading();
  const notify = useNotify();
  const [isForce, setForce] = useState(false);
  const queryClient = useQueryClient();
  const isLoading =
    instanceLoading.getType(instance) === "Restarting" ||
    instance.status === "Restarting";

  const handleRestart = () => {
    instanceLoading.setLoading(instance, "Restarting");
    void restartInstance(instance, isForce).then((operation) => {
      eventQueue.set(
        operation.metadata.id,
        () =>
          notify.success(
            <>
              Instance <InstanceLink instance={instance} /> restarted.
            </>,
          ),
        (msg) =>
          notify.failure(
            "Instance restart failed",
            new Error(msg),
            <>
              Instance <ItemName item={instance} bold />:
            </>,
          ),
        () => {
          instanceLoading.setFinish(instance);
          void queryClient.invalidateQueries({
            queryKey: [queryKeys.instances],
          });
        },
      );
    });
  };

  const disabledStatuses = ["Stopped", "Frozen", "Error"];
  const isDisabled = isLoading || disabledStatuses.includes(instance.status);

  return (
    <ConfirmationButton
      appearance="base"
      loading={isLoading}
      className="has-icon is-dense"
      confirmationModalProps={{
        title: "Confirm restart",
        children: (
          <p>
            This will restart instance <ItemName item={instance} bold />.
          </p>
        ),
        onConfirm: handleRestart,
        close: () => setForce(false),
        confirmButtonLabel: "Restart",
        confirmExtra: (
          <ConfirmationForce
            label="Force restart"
            force={[isForce, setForce]}
          />
        ),
      }}
      disabled={isDisabled}
      shiftClickEnabled
      showShiftClickHint
    >
      <Icon name="restart" />
    </ConfirmationButton>
  );
};

export default RestartInstanceBtn;
