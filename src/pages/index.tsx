import { HeadContent } from '@/components/Head';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { metaElementsForHomePage } from '@/config/meta/metaHomePage';

const Chat = () => {
  return (
    <>
      <HeadContent title="Title" metaElements={metaElementsForHomePage} />
      <Sidebar />
    </>
  );
};

export default Chat;
