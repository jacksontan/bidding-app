export default function authHeader() {
  const storedUser = localStorage.getItem('user');
  let user;
  if (storedUser) {
    try {
      user = JSON.parse(storedUser ? storedUser : "");
    } catch (e) {
      console.log("Invalid stored user info");
    }
  }

  if (user && user.token) {
    return { 'token': user.token };
  } else {
    return {};
  }
}
