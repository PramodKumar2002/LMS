import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Users({ user }) {
  const [users, setUsers] = useState([]);

  useEffect(()=> { if(user?.isAdmin) load(); }, [user]);

  const load = async () => {
    const { data } = await api.get('/users');
    setUsers(data);
  };

  if(!user?.isAdmin) return <div className="card">Admin only</div>;
  return (
    <div className="card">
      <h3>Users</h3>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th><th>Membership</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.membership ? `${u.membership.durationMonths} months` : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
