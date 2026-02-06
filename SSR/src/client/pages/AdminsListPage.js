import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAdmins } from '../actions';
import requireAuth from '../components/hocs/RequireAuth';

class AdminsListPage extends Component {
  componentDidMount() {
    this.props.fetchAdmins();
  }

  renderAdmins() {
    return this.props.admins.map((admin) => {
      return <li key={admin.id}>{admin.name}</li>;
    });
  }

  render() {
    return (
      <div>
        Protected list of admins:
        <ul>{this.renderAdmins()}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { admins: state.admins };
}

function loadData(store) {
  return store.dispatch(fetchAdmins());
}

export default {
  loadData,
  component: connect(mapStateToProps, { fetchAdmins })(requireAuth(AdminsListPage)),
};
