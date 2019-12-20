import fetch from 'isomorphic-unfetch';
import { parse } from 'url';

export default async function (req, res) {
  const { query: { url } } = parse(req.url, true);
  const r = await fetch(`https://www.notion.so/image/${encodeURIComponent(url)}`);

  res.setHeader("content-type", r.headers.get("content-type"));
  res.setHeader("cache-control", "s-maxage=1, stale-while-revalidate");
  r.body.pipe(res);
}