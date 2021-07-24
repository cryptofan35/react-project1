import React from "react";

import ContentForm from "components/ContentForm";
import NewPackageForm from "components/Packages/NewPackageForm"
import { useFormatMessage } from 'react-intl-hooks';

import './index.less'

const EditPackagePage = ({ history }) => {
  const t = useFormatMessage();
  return (
    <ContentForm 
      title={t({id: 'app.packages.list.edit_package'})}
      withNotification
      className="packages-edit__content-form"
    >
      <NewPackageForm edit history={history} />
    </ContentForm>
  );
};


export default EditPackagePage;
