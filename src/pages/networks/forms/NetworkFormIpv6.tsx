import React, { FC } from "react";
import { Input, Select, Textarea } from "@canonical/react-components";
import { FormikProps } from "formik/dist/types";
import ConfigurationTable from "components/ConfigurationTable";
import { getNetworkConfigurationRow } from "pages/networks/forms/NetworkConfigurationRow";
import { NetworkFormValues } from "pages/networks/forms/NetworkForm";
import { optionTrueFalse } from "util/instanceOptions";

interface Props {
  formik: FormikProps<NetworkFormValues>;
}

const NetworkFormIpv6: FC<Props> = ({ formik }) => {
  const hasDhcp = formik.values.ipv6_dhcp !== "false";

  return (
    <ConfigurationTable
      rows={[
        getNetworkConfigurationRow({
          formik: formik,
          name: "ipv6_dhcp",
          label: "IPv6 DHCP",
          defaultValue: "",
          children: <Select options={optionTrueFalse} />,
        }),

        ...(hasDhcp && formik.values.type !== "ovn"
          ? [
              getNetworkConfigurationRow({
                formik: formik,
                name: "ipv6_dhcp_expiry",
                label: "IPv6 DHCP expiry",
                help: "When to expire DHCP leases",
                defaultValue: "",
                children: <Input type="text" />,
              }),

              getNetworkConfigurationRow({
                formik: formik,
                name: "ipv6_dhcp_ranges",
                label: "IPv6 DHCP ranges",
                help: "Comma-separated list of IPv6 ranges to use for DHCP (FIRST-LAST format)",
                defaultValue: "",
                children: <Textarea />,
              }),
            ]
          : []),

        ...(hasDhcp
          ? [
              getNetworkConfigurationRow({
                formik: formik,
                name: "ipv6_dhcp_stateful",
                label: "IPv6 DHCP stateful",
                defaultValue: "",
                children: <Select options={optionTrueFalse} />,
              }),
            ]
          : []),

        ...(formik.values.type === "ovn"
          ? [
              getNetworkConfigurationRow({
                formik: formik,
                name: "ipv6_l3only",
                label: "IPv6 L3 only",
                defaultValue: "",
                children: <Select options={optionTrueFalse} />,
              }),
            ]
          : []),

        ...(formik.values.type !== "ovn"
          ? [
              getNetworkConfigurationRow({
                formik: formik,
                name: "ipv6_ovn_ranges",
                label: "IPv6 OVN ranges",
                help: "Comma-separated list of IPv6 ranges to use for child OVN network routers (FIRST-LAST format)",
                defaultValue: "",
                children: <Textarea />,
              }),
            ]
          : []),
      ]}
    />
  );
};

export default NetworkFormIpv6;
