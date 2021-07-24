import React from "react";

import ContentForm from "components/ContentForm";
import NewPackageForm from "components/Packages/NewPackageForm"
import { useFormatMessage } from 'react-intl-hooks';

import './newPackage.less'

const NewPackagePage = ({ history }) => {
  const t = useFormatMessage();
  return (
    <ContentForm 
      title={t({id: 'app.packages.list.new_package'})}
      withNotification
      className="packages-new__content-form"
    >
      <NewPackageForm history={history} />
    </ContentForm>
  );
};

export default NewPackagePage;
