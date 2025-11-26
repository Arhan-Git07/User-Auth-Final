
const API = "http://localhost:8000";

async function register(){
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch(API + '/register', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name, email, password})
  });
  const data = await res.json();
  document.getElementById('msg').innerText = data.message || data.detail || JSON.stringify(data);
  loadUsers();
}

async function loadUsers(){
  const res = await fetch(API + '/users');
  const data = await res.json();
  const usersDiv = document.getElementById('users');
  usersDiv.innerHTML = data.map(u => `
    <div class="user-card">
      <b>${u.name}</b>
      <div>${u.email}</div>
      <div style="margin-top:8px;">
        <button onclick="del(${u.id})">Delete</button>
        <button onclick="editPrompt(${u.id}, '${u.name}', '${u.email}')">Edit</button>
      </div>
    </div>
  `).join('');
}

function editPrompt(id, name, email){
  const newName = prompt('Name', name);
  const newEmail = prompt('Email', email);
  const newPass = prompt('New password (required)');
  if(!newName || !newEmail || !newPass) return alert('All fields required');
  fetch(API + '/users/' + id, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({name:newName,email:newEmail,password:newPass})
  }).then(()=>loadUsers());
}

function del(id){
  fetch(API + '/users/' + id, {method:'DELETE'}).then(()=>loadUsers());
}
