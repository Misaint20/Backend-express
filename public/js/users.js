// Fetch para obtener los usuarios desde la API
fetch('/api/v1/users')
.then(response => response.json())
.then(users => {
  const userList = document.getElementById('user-list');
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Usuario:</strong> ${user.name} - <strong>Email:</strong> ${user.email}`;
    userList.appendChild(li);
  });
})
.catch(error => {
  console.error('Error al obtener usuarios:', error);
});