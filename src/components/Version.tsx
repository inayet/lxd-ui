import React, { FC } from "react";
import { Icon, Tooltip } from "@canonical/react-components";
import { useSettings } from "context/useSettings";
import { RECENT_MAJOR_SERVER_VERSION, UI_VERSION } from "util/version";

const Version: FC = () => {
  const { data: settings } = useSettings();

  const serverVersion = settings?.environment?.server_version;
  if (!serverVersion) {
    return null;
  }

  const serverMajor = serverVersion.includes(".")
    ? serverVersion.split(".")[0]
    : undefined;
  const isOutdated = serverMajor
    ? parseInt(serverMajor) < RECENT_MAJOR_SERVER_VERSION
    : false;

  return (
    <>
      <hr className="p-side-navigation__list is-dark navigation-hr" />
      <li className="p-side-navigation__link server-version p-text--x-small">
        {isOutdated && (
          <Tooltip
            message="You are using an outdated server version.
Update your LXD server to benefit from the latest features."
            tooltipClassName="version-warning"
            zIndex={1000}
          >
            <Icon name="warning" className="p-side-navigation__icon" />
          </Tooltip>
        )}
        Version {serverVersion}-ui-{UI_VERSION}
      </li>
    </>
  );
};

export default Version;
