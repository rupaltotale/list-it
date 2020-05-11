import React from "react";
import PropTypes from "prop-types";
import { Container, Button, Image } from "react-bootstrap";
import { getUser } from "../API";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
    };
  }

  componentDidMount() {
    getUser(
      (response) => {
        console.log(response.data);
        this.setState({
          username: response.data.username,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
        });
      },
      (error) => {
        console.log(error.response);
      }
    );
  }

  renderProfileOptions = () => {
    return (
      <Container
        style={{
          width: "30%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>OPTIONS</h1>
      </Container>
    );
  };

  renderProfileInformation = () => {
    return (
      <Container
        style={{
          width: "30%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>INFOOOO</h1>
      </Container>
    );
  };

  renderProfilePicture = () => {
    return (
      <Container
        style={{
          width: "30%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="https://d24cgw3uvb9a9h.cloudfront.net/static/93947/image/user.png"
          rounded
        />
      </Container>
    );
  };

  renderProfilePage = () => {
    return (
      <Container
        style={{
          height: "200px",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          alignContent: "flex-start",
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: "100%",
        }}
      >
        {this.renderProfilePicture()}
        {this.renderProfileInformation()}
        {this.renderProfileOptions()}
      </Container>
    );
  };

  render() {
    return this.renderProfilePage();
  }
}

export default Profile;

Profile.propTypes = {};
