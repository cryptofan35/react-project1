import React, {useEffect} from 'react';

const PreviewHTMLFrame = (props) => {
  const { htmlContent } = props;

  useEffect(() => {
    if (! htmlContent) {
      return;
    }
    let doc = document.getElementById('iframe').contentWindow.document;
    doc.open();
    doc.write(htmlContent);
    doc.close();
  }, [htmlContent])

  return (
    <div className="html-frame">
      <iframe width="100%" height="100%" frameBorder="0" id="iframe" title="frame" />
    </div>
  );
}

export default PreviewHTMLFrame;
