import {useTranslation} from "react-i18next";
import {GiSkippingRope} from "react-icons/gi";
import Footer from "../components/Footer";

export function MainFooter() {
  const {t} = useTranslation();

  return (
    <Footer
      brand="myJumpData"
      icon={<GiSkippingRope className="h-10 inline fill-current mr-2 pt-2"/>}
      other={[
        {
          heading: t("footermain:social"),
          links: [
            {
              name: "Instagram",
              to: "instagram.com/myjumpdata/",
            },
          ],
        },
        {
          heading: t("footermain:trust_legal"),
          links: [
            {
              name: t("footermain:terms"),
              to: "/terms",
            },
            {
              name: t("footermain:legal"),
              to: "/legal",
            },
          ],
        },
      ]}
    />
  );
}
