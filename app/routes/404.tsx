import type { MetaFunction } from 'remix';

export const meta: MetaFunction = () => {
  return {
    title: '404 | Andre Landgraf',
    description: 'Page not Found!',
  };
};

const NotFoundPage = () => {
  return (
    <div>
      <div>
        <h1>Wupsi, this page does not exist!</h1>
      </div>
    </div>
  );
};

export default NotFoundPage;
