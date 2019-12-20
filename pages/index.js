import md5Hex from 'md5-hex';
import { useEffect } from 'react';
import { loadPageChunk } from '../data/notion';
import NotionComponent from '../components/notion';
import useFocus from '../hooks/useFocus';

function renderContent(content, depth) {
  return content.map((c, i) => (
    <div key={i}>
      <NotionComponent content={c} depth={depth} />
      {renderContent(c.subcontent, depth + 1)}
    </div>
  ));
}

function Page({ page, etag }) {
  const focused = useFocus();

  useEffect(() => {
    if (focused) {
      fetch(window.location, {
        headers: {
          pragma: 'no-cache',
        },
      }).then(res => {
        if (res.ok && res.headers.get('x-version') !== etag) {
          window.location.reload();
        }
      });
    }
  }, [focused]);

  return (
    <>
      <h1>{page.prop[0]}</h1>
      {renderContent(page.subcontent, 0)}
    </>
  );
}

Page.getInitialProps = async ({ res }) => {
  const page = await loadPageChunk('bc607894-081d-4905-9abf-fae6f9533a44');
  const etag = md5Hex(JSON.stringify(page));

  if (res) {
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    res.setHeader('X-version', etag);
  }

  return {
    page,
    etag,
  };
};

export default Page;
