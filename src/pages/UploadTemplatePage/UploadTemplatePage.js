import React, { useLayoutEffect } from "react";
import { connect } from "react-redux";
import ContentForm from "../../components/ContentForm";
import UploadTemplateForm from "components/UploadTemplate/UploadTemplateForm";
import { useForm } from "antd/lib/form/Form";
import {
  createOfferTemplate,
  createEmailTemplate,
} from "appRedux/actions/UploadTemplate";
import { Layout } from "antd";

function UploadTemplatePage(props) {
  const {
    loadingCreateTemplate,
    createOfferTemplate,
    createEmailTemplate,
  } = props;
  const [form] = useForm();

  function createTemplate(values) {
    switch (values.templateType) {
      case "offer":
        return createOfferTemplate(values);
      case "email":
        return createEmailTemplate(values);
      default:
        return;
    }
  }

  async function handleSubmit(values) {
    try {
      await createTemplate(values);
      form.resetFields();
    } catch (error) {}
  }

  return (
    <Layout className="cb-app-layout">
      <Layout.Content
        className="cb-layout-content gx-main-content-wrapper"
        style={{ marginTop: "65px" }}
      >
        <ContentForm title="Upload Template">
          <UploadTemplateForm
            onSubmit={handleSubmit}
            isLoading={loadingCreateTemplate}
            form={form}
          />
        </ContentForm>
      </Layout.Content>
    </Layout>
  );
}

const mapStateToProps = (state) => ({
  loadingCreateTemplate:
    state.uploadTemplate.createTemplate.loadingCreateTemplate,
});

const mapDispatchToProps = {
  createOfferTemplate,
  createEmailTemplate,
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadTemplatePage);
