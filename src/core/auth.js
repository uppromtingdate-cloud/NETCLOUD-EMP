// core/auth.js
// Manejador de Login local (sin Firebase Auth)

(function() {
  // Credenciales válidas
  const VALID_EMAIL = 'netcloud@tecnología.com';
  const VALID_PASSWORD = '100%NETCLOUD';

  function showAlert(containerId, type, message, timeout = 5000) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    container.innerHTML = `<div class="alert ${alertClass} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    
    if (timeout > 0) {
      setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) alert.remove();
      }, timeout);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    if (!emailInput || !passwordInput) {
      console.error('Inputs no encontrados');
      return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email ingresado:', email);
    console.log('Email válido:', VALID_EMAIL);
    console.log('Password ingresado:', password);
    console.log('Password válido:', VALID_PASSWORD);
    console.log('Email match:', email === VALID_EMAIL);
    console.log('Password match:', password === VALID_PASSWORD);
    
    if (!email || !password) {
      showAlert('auth-alert', 'danger', 'Email y contraseña son obligatorios');
      return;
    }
    
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      console.log('✓ Credenciales válidas');
      localStorage.setItem('netcloud_auth', JSON.stringify({
        email: email,
        token: 'token-' + Date.now()
      }));
      showAlert('auth-alert', 'success', '¡Bienvenido! Redirigiendo...');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      console.log('✗ Credenciales inválidas');
      showAlert('auth-alert', 'danger', 'Email o contraseña incorrectos');
    }
  }

  // Esperar a que el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('✓ Login form listener attached');
      } else {
        console.error('loginForm no encontrado');
      }
    });
  } else {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
      console.log('✓ Login form listener attached (DOM already loaded)');
    } else {
      console.error('loginForm no encontrado');
    }
  }
})();
