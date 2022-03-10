import { ButtonLink } from '../UI/buttons';
import { DownloadSvg } from '../UI/icons';

const DownloadButton = () => (
  <ButtonLink to="/Andre_Landgraf_CV.pdf" download="Andre_Landgraf_CV.pdf" external primary>
    {DownloadSvg}
    <span>Download CV</span>
  </ButtonLink>
);

export default DownloadButton;
