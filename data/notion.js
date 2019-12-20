import fetch from 'isomorphic-unfetch';

const defaultBody = {
  pageId: '',
  limit: 100,
  cursor: { stack: [] },
  chunkNumber: 0,
  verticalColumns: false,
};

async function request(resource, body) {
  try {
    const res = await fetch(`https://www.notion.so/api/v3/${resource}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ...defaultBody,
        ...body,
      }),
    });

    if (!res.ok) {
      throw new Error(res);
    }

    return res.json();
  } catch (e) {
    throw e;
  }
}

const props = props =>
  Object.keys(props).reduce((p, name) => {
    p[name] = props[name][0];
    return p;
  }, {});

function parseContent(blocks, parent, parentContent) {
  for (const id of parentContent) {
    const block = blocks[id];
    const content = {
      type: block.value.type,
      prop: block.value.properties ? props(block.value.properties) : {},
      subcontent: [],
    };

    if (block.value.content) {
      parseContent(blocks, content, block.value.content);
    }

    parent.subcontent.push(content);
  }
}

function parsePageChunk(blocks) {
  const block = blocks[Object.keys(blocks)[0]];
  const page = { type: 'page', prop: props(block.value.properties), subcontent: [] };

  parseContent(blocks, page, block.value.content);

  return page;
}

async function loadPageChunk(pageId) {
  const data = await request('loadPageChunk', {
    pageId: pageId,
  });

  return parsePageChunk(data.recordMap.block);
}

export { loadPageChunk };
