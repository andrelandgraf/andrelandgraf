import { DownloadSvg } from '../icons';

const DownloadButton = () => (
  <div className="flex items-center justify-center md:items-start">
    <div className="m-0 lg:mr-auto flex-grow lg:flex-grow-0">
      <a
        className="w-full flex gap-1 items-center justify-center flex-row bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        href="/Andre_Landgraf_CV.pdf"
        download="Andre_Landgraf_CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        {DownloadSvg}
        <span>Download CV</span>
      </a>
    </div>
  </div>
);

export default DownloadButton;
