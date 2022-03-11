import { useCallback } from 'react';
import { ButtonLink } from '../UI/buttons';
import { DownloadSvg } from '../UI/icons';

const href = '/Andre_Landgraf_CV.pdf';

const DownloadButton = () => {
  const handleClick = useCallback(async () => {
    if (typeof navigator.canShare === 'function' && navigator.canShare({ url: href })) {
      navigator.share({ url: href });
    }
  }, []);

  return (
    <ButtonLink onClick={handleClick} to="" download={href} external primary>
      <DownloadSvg />
      <span>Download CV</span>
    </ButtonLink>
  );
};

export default DownloadButton;
