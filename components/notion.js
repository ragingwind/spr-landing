import React from 'react';
import { parse } from 'url';

const NotionHeader = ({ content }) => <h1>{content.prop.title[0]}</h1>;
const NotionSubHeader = ({ content }) => <h2>{content.prop.title[0]}</h2>;
const NotionSubSubHeader = ({ content }) => <h3>{content.prop.title[0]}</h3>;
const NotionText = ({ content }) => (
  <div>
    {content.prop.title.map((t, i) => (
      <span key={i}>{t}</span>
    ))}
  </div>
);
const NotionBulletedList = ({ content, depth }) => (
  <ul data-depth={depth}>
    {content.prop.title.map((t, i) => (
      <li key={i}>{t}</li>
    ))}
  </ul>
);
const NotionQuote = ({ content }) => <p>{content.prop.title[0]}</p>;
const NotionDivider = ({ content }) => <hr />;
const NotionCode = ({ content }) => <code>{content.prop.title[0]}</code>;
const NotionImg = ({ content }) => <img src={`/api/images?url=${content.prop.source[0]}`} />;
const NotionVideo = ({ content }) => {
  const {
    query: { v },
  } = parse(content.prop.source[0], true);
  const url = `https://www.youtube.com/embed/${v}?feature=oembed`;
  return (
    <iframe
      src={url}
      frameBorder="0"
      sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-presentation"
      allowFullScreen=""
    ></iframe>
  );
};
const NotionEmpty = () => <div></div>;

const NotionComponentsMap = {
  header: <NotionHeader />,
  sub_header: <NotionSubHeader />,
  sub_sub_header: <NotionSubSubHeader />,
  text: <NotionText />,
  bulleted_list: <NotionBulletedList />,
  quote: <NotionQuote />,
  divider: <NotionDivider />,
  code: <NotionCode />,
  image: <NotionImg />,
  video: <NotionVideo />,
};

export default function Notion({ content, depth }) {
  const el = NotionComponentsMap[content.type] || <NotionEmpty />;
  return React.cloneElement(el, { content, depth });
}
