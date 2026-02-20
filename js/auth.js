// ===== AUTH (client-side demo) =====
function login(){
  const user = document.getElementById("username")?.value?.trim();
  const pass = document.getElementById("password")?.value?.trim();

  if(user && pass){
    localStorage.setItem("user", user);
    // simple session flag
    localStorage.setItem("isLoggedIn", "1");
    window.location.href = "./dashboard.html";
  } else {
    alert("Enter username and password");
  }
}

function requireLogin(){
  const ok = localStorage.getItem("isLoggedIn") === "1" && localStorage.getItem("user");
  if(!ok){
    window.location.href = "./index.html";
  }
}

function logout(){
  // Clear everything (results + attempts + session)
  localStorage.clear();
  try{ sessionStorage.clear(); }catch(e){}
  window.location.href = "./index.html";
}
