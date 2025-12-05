const API = "http://localhost:8000";

// 🆕 Store authentication token
let authToken = null;
let currentUser = null;

// 🆕 Helper function to get headers with token
function getHeaders() {
  const headers = {'Content-Type': 'application/json'};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

// 🆕 NEW: Login function
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    document.getElementById('msg').innerText = 'Please enter email and password';
    return;
  }
  
  try {
    const res = await fetch(API + '/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password})
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      document.getElementById('msg').innerText = data.detail || 'Login failed';
      return;
    }
    
    authToken = data.access_token;  // 🆕 Store JWT token
    currentUser = {
      id: data.user_id,
      email: data.email,
      role: data.role
    };
    
    // Store token in localStorage for persistence
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    document.getElementById('msg').innerText = `✓ Logged in as ${data.email} (${data.role})`;
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
    document.getElementById('userRole').innerText = `Role: ${data.role}`;
    
    loadUsers();  // Auto-load users after login
  } catch (err) {
    document.getElementById('msg').innerText = 'Error: ' + err.message;
  }
}

// 🆕 NEW: Logout function
function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('mainSection').style.display = 'none';
  document.getElementById('msg').innerText = 'Logged out';
  document.getElementById('users').innerHTML = '';
}

// 🆕 NEW: Check if user is already logged in (on page load)
function checkAuth() {
  const savedToken = localStorage.getItem('authToken');
  const savedUser = localStorage.getItem('currentUser');
  
  if (savedToken && savedUser) {
    authToken = savedToken;
    currentUser = JSON.parse(savedUser);
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('mainSection').style.display = 'block';
    document.getElementById('userRole').innerText = `Role: ${currentUser.role}`;
    loadUsers();
  }
}

// 🆕 UPDATED: Register (role is determined by email pattern)
async function register() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  if (!name || !email || !password) {
    document.getElementById('msg').innerText = 'Please fill all fields';
    return;
  }
  
  try {
    const res = await fetch(API + '/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, email, password})
    });
    
    const data = await res.json();
    
    if (res.ok) {
      document.getElementById('msg').innerText = 
        `✓ ${data.message}. Please login with your credentials.`;
      // Clear form
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
    } else {
      document.getElementById('msg').innerText = data.detail || 'Registration failed';
    }
  } catch (err) {
    document.getElementById('msg').innerText = 'Error: ' + err.message;
  }
}

// 🆕 UPDATED: Load users with authentication
async function loadUsers() {
  if (!authToken) {
    document.getElementById('msg').innerText = 'Please login first';
    return;
  }
  
  try {
    const res = await fetch(API + '/users', {
      headers: getHeaders()  // 🆕 Include token
    });
    
    if (!res.ok) {
      const error = await res.json();
      document.getElementById('msg').innerText = error.detail || 'Failed to load users';
      return;
    }
    
    const data = await res.json();
    const usersDiv = document.getElementById('users');
    
    // Get current user role
    const userRole = currentUser ? currentUser.role : 'user';
    const canWrite = userRole === 'admin' || userRole === 'moderator';
    const canDelete = userRole === 'admin';
    
    usersDiv.innerHTML = data.map(u => {
      // Determine role based on email pattern (matching backend logic)
      let role = 'user';
      const emailLower = u.email.toLowerCase();
      if (emailLower.includes('admin')) role = 'admin';
      else if (emailLower.includes('mod') || emailLower.includes('moderator')) role = 'moderator';
      
      // Build buttons based on permissions
      let buttons = '';
      if (canDelete) {
        buttons += `<button onclick="deleteUser(${u.id})" class="delete-btn">Delete</button>`;
      }
      if (canWrite) {
        buttons += `<button onclick="editPrompt(${u.id}, '${u.name}', '${u.email}')">Edit</button>`;
      }
      if (!canWrite && !canDelete) {
        buttons += `<span style="color: #666; font-size: 12px;">Read only</span>`;
      }
      
      return `
      <div class="user-card">
        <b>${u.name}</b>
        <div>${u.email}</div>
        <div style="color: #666; font-size: 12px;">Role: ${role}</div>
        <div style="margin-top:8px;">
          ${buttons}
        </div>
      </div>
    `;
    }).join('');
  } catch (err) {
    document.getElementById('msg').innerText = 'Error: ' + err.message;
  }
}

// 🆕 UPDATED: Edit with authentication
function editPrompt(id, name, email) {
  const newName = prompt('Name', name);
  const newEmail = prompt('Email', email);
  const newPass = prompt('New password (required)', '');
  
  if (!newName || !newEmail || !newPass) {
    return alert('Name, email, and password are required');
  }
  
  updateUser(id, newName, newEmail, newPass);
}

// 🆕 UPDATED: Update user with authentication
async function updateUser(id, name, email, password) {
  if (!authToken) {
    document.getElementById('msg').innerText = 'Please login first';
    return;
  }
  
  // Check if user has write permission
  const userRole = currentUser ? currentUser.role : 'user';
  if (userRole !== 'admin' && userRole !== 'moderator') {
    document.getElementById('msg').innerText = '❌ You do not have permission to edit users';
    return;
  }
  
  try {
    const res = await fetch(API + '/users/' + id, {
      method: 'PUT',
      headers: getHeaders(),  // 🆕 Include token
      body: JSON.stringify({name, email, password})
    });
    
    const data = await res.json();
    
    if (res.ok) {
      document.getElementById('msg').innerText = '✓ ' + data.message;
      loadUsers();
    } else {
      document.getElementById('msg').innerText = data.detail || 'Update failed';
    }
  } catch (err) {
    document.getElementById('msg').innerText = 'Error: ' + err.message;
  }
}

// 🆕 UPDATED: Delete with authentication
async function deleteUser(id) {
  if (!authToken) {
    document.getElementById('msg').innerText = 'Please login first';
    return;
  }
  
  // Check if user has delete permission (admin only)
  const userRole = currentUser ? currentUser.role : 'user';
  if (userRole !== 'admin') {
    document.getElementById('msg').innerText = '❌ Only admins can delete users';
    return;
  }
  
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }
  
  try {
    const res = await fetch(API + '/users/' + id, {
      method: 'DELETE',
      headers: getHeaders()  // 🆕 Include token
    });
    
    const data = await res.json();
    
    if (res.ok) {
      document.getElementById('msg').innerText = '✓ ' + data.message;
      loadUsers();
    } else {
      document.getElementById('msg').innerText = data.detail || 'Delete failed';
    }
  } catch (err) {
    document.getElementById('msg').innerText = 'Error: ' + err.message;
  }
}