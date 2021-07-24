import React, { useEffect } from "react";
import { connect } from "react-redux";
import { userConfirm } from "../../appRedux/actions/Auth";

const Confirm = (props) => {
  useEffect(() => {
    verify()
  }, [])

  const verify = async () => {
    await props.userConfirm(props.match.params.token)
    props.history.push('/signin')
  }

  return (
    <></>
  );
};

const mapStateToProps = ({ commonData }) => {
  const { message } = commonData;
  return { message }
};

export default connect(mapStateToProps, { userConfirm })(Confirm);
