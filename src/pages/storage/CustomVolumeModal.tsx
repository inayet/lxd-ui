import React, { FC, useState } from "react";
import { LxdStorageVolumeWithPool } from "context/loadCustomVolumes";
import CustomVolumeSelectModal from "pages/storage/CustomVolumeSelectModal";
import CustomVolumeCreateModal from "pages/storage/CustomVolumeCreateModal";
import { Modal } from "@canonical/react-components";

interface Props {
  project: string;
  onFinish: (volume: LxdStorageVolumeWithPool) => void;
  onCancel: () => void;
}

const SELECT_VOLUME = "selectVolume";
const CREATE_VOLUME = "createVolume";

const CustomVolumeModal: FC<Props> = ({ project, onFinish, onCancel }) => {
  const [content, setContent] = useState(SELECT_VOLUME);
  const [primaryVolume, setPrimaryVolume] = useState<
    LxdStorageVolumeWithPool | undefined
  >(undefined);

  const handleCreateVolume = (volume: LxdStorageVolumeWithPool) => {
    setContent(SELECT_VOLUME);
    setPrimaryVolume(volume);
  };

  return (
    <Modal
      className="custom-volume-modal"
      close={onCancel}
      title={
        content === SELECT_VOLUME ? "Choose custom volume" : "Create volume"
      }
    >
      {content === SELECT_VOLUME && (
        <CustomVolumeSelectModal
          project={project}
          primaryVolume={primaryVolume}
          onFinish={onFinish}
          onCancel={onCancel}
          onCreate={() => setContent(CREATE_VOLUME)}
        />
      )}
      {content === CREATE_VOLUME && (
        <CustomVolumeCreateModal
          project={project}
          onCancel={() => setContent(SELECT_VOLUME)}
          onFinish={handleCreateVolume}
        />
      )}
    </Modal>
  );
};

export default CustomVolumeModal;
