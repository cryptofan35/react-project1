import React from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { userSignOut } from "../../appRedux/actions/Auth";

const Home = props => {
  const handleBtnClick = () => {
    props.userSignOut()
  }

  return (
    <>
      <Button type="primary" style={{ lineHeight: 0, float: 'right' }} onClick={handleBtnClick}>Sign Out</Button>
      <p>Coming soon</p>
    </>
  )
};

const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token }
};

export default connect(mapStateToProps, { userSignOut })(Home);
