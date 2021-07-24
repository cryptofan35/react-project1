import React from 'react';
import { useFormatMessage } from 'react-intl-hooks';
import CKEditor from '@ckeditor/ckeditor5-react';
import { connect } from "react-redux";
import ClassicEditor from '@sosedisverhu/ckeditor5-build-classic';
import '@sosedisverhu/ckeditor5-build-classic/build/translations/en.js';
import '@sosedisverhu/ckeditor5-build-classic/build/translations/de.js';

import './Editor.less';

const Editor = ({ 
  onChange = () => {}, 
  onBlur = () => {}, 
  value = '', 
  toolbar,
  locale,
 }) => {

  const t = useFormatMessage();

  return <CKEditor
      editor={ ClassicEditor }
      config={{
        ...(toolbar ? { toolbar } : {}),
        allowedContent: true,
        extraPlugins: [],
        image: {
          toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
          styles: ['full', 'alignLeft', 'alignRight']
        },
        link: {
          decorators: {
            isExternal: {
              mode: 'manual',
              label: t({id: 'app.common.open_in_a_new_tab'}),
              attributes: {
                target: '_blank'
              }
            },
            toggleDownloadable: {
              mode: 'manual',
              label: t({id: 'app.common.downloadable'}),
              attributes: {
                download: true
              }
            }
          }
        },
        mediaEmbed: {
          previewsInData: true
        },
        heading: {
          options: [
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
            { model: 'paragraph', title: 'Text', class: 'ck-heading_paragraph' }
          ]
        },
        language: locale,
        placeholder: t({id: 'app.common.type_your_text'})
      }}
      onInit={editor => {
        if(value && !editor.getData()) {
          editor.setData(value)
        }
      }}
      data={value}
      onChange={ (event, editor) => {
        const data = editor.getData();

        onChange({
          target: {
            value: data
          }
        });
      }}
      onBlur={onBlur}
    />;

}

const mapStateToProps = ({ settings }) => {
  const { locale } = settings;

  return { locale: locale.locale || 'en' };
}

export default connect(mapStateToProps)(Editor);
