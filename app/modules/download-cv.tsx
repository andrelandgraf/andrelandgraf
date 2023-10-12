import { useCallback } from 'react';

import { ButtonLink } from '../components/buttons';
import { DownloadSvg } from '../components/icons';

const href = '/Andre_Landgraf_CV.pdf';

export function DownloadButton() {
  const handleClick = useCallback(async () => {
    if (typeof navigator.canShare === 'function' && navigator.canShare({ url: href })) {
      navigator.share({ url: href });
    }
  }, []);

  return (
    <ButtonLink onClick={handleClick} to="" download={href} primary>
      <DownloadSvg />
      <span>Download CV</span>
    </ButtonLink>
  );
}
