import { useTranslation } from "react-i18next";
import { FaInstagram } from "react-icons/fa";
import FooterNav from "../components/FooterNav";

export default function Footer() {
  const { t } = useTranslation();

  const social = [
    {
      link: "https://instagram.com/myJumpData",
      icon: <FaInstagram />,
      name: "Instagram",
    },
  ];
  const links = [
    {
      heading: t("common:nav_trust_legal"),
      links: [
        {
          name: t("common:nav_terms"),
          to: "/terms",
        },
        {
          name: t("common:nav_legal"),
          to: "/legal",
        },
      ],
    },
  ];

  return <FooterNav social={social} links={links} />;
}
