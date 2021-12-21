import { useTranslation } from 'react-i18next';
import { FaInstagram } from 'react-icons/fa';
import FooterNav from '../components/FooterNav';

export default function Footer() {
  const { t } = useTranslation();

  const social = [
    { link: 'https://instagram.com/myJumpData', icon: <FaInstagram /> },
  ];
  const links = [
    {
      heading: t('footermain:trust_legal'),
      links: [
        {
          name: t('footermain:terms'),
          to: '/terms',
        },
        {
          name: t('footermain:legal'),
          to: '/legal',
        },
      ],
    },
  ];

  return <FooterNav social={social} links={links} />;
}
