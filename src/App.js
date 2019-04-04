import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    // console.log(this);
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
}

// function component
const Public = () => <h3>Public</h3>

// function component
function Protected() {
  return <h3>Protected</h3>;
}

// class component
class Login extends React.Component {
  state = { redirectToReferrer: false };
  
  login = () => {
    fakeAuth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    });
  };
  
  render() {
    // console.log(this.props);
    let { from } = this.props.location.state || { from: { pathname: "/"} };
    let { redirectToReferrer } = this.state;
    
    console.log(from);

    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <div>
        <p>You must log in to view the page at {from.pathname} </p>
        <button onClick={this.login}>Log in</button>
      </div>
    );
  }
}

// function component
// with destucturing argument (component argument, and ...take in the rest of argument(s)
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest} 
      render={props => 
        fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
          // <Redirect to="/login" />
          <Redirect 
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <AuthButton />
          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>

          <Route path="/public" component={Public} />
          <Route path="/login" component={Login} />
          <PrivateRoute path="/protected" component={Protected} />
        </div>
      </Router>
    );
  }
}

const AuthButton = withRouter(
  ({ history }) => 
    fakeAuth.isAuthenticated === true 
    ? <p>
        Welcome!{" "}
        <button 
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sign Out
        </button>
      </p>
    : <p>
        You are not logged in.
      </p>
);

export default App;
