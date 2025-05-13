import React, { useState, useEffect } from 'react';
import { getUsers } from '../services/userService';

const UserList = () => {
 const [users, setUsers] = useState([]);

 useEffect(() => {
 getUsers().then((users) => setUsers(users));
 }, []);

 return (
 <ul>
 {users.map((user) => (
 <li key={user.id}>{user.name} ({user.email})</li>
 ))}
 </ul>
 );
};

export default UserList;
