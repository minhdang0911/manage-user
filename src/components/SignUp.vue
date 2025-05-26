<template>
  <div class="form-container">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <div class="register">
      <div class="form-header">
        <div class="icon-wrapper">
          <svg class="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <h1>Tạo tài khoản</h1>
        <p class="subtitle">Điền thông tin để bắt đầu</p>
      </div>

      <form class="form-content" @submit.prevent="SignUp">
        <div class="input-group">
          <div class="input-wrapper" :class="{ 'error': errors.name, 'focused': focusedInput === 'name' }">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input 
              type="text" 
              placeholder="Họ và tên" 
              v-model="form.name"
              @focus="focusedInput = 'name'"
              @blur="focusedInput = ''"
              :class="{ 'has-value': form.name }"
            />
          </div>
          <transition name="error-slide">
            <p class="error-message" v-if="errors.name">{{ errors.name }}</p>
          </transition>
        </div>

        <div class="input-group">
          <div class="input-wrapper" :class="{ 'error': errors.email, 'focused': focusedInput === 'email' }">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <input 
              type="email" 
              placeholder="Email của bạn" 
              v-model="form.email"
              @focus="focusedInput = 'email'"
              @blur="focusedInput = ''"
              :class="{ 'has-value': form.email }"
            />
          </div>
          <transition name="error-slide">
            <p class="error-message" v-if="errors.email">{{ errors.email }}</p>
          </transition>
        </div>

        <div class="input-group">
          <div class="input-wrapper" :class="{ 'error': errors.password, 'focused': focusedInput === 'password' }">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <circle cx="12" cy="16" r="1"></circle>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="Mật khẩu" 
              v-model="form.password"
              @focus="focusedInput = 'password'"
              @blur="focusedInput = ''"
              :class="{ 'has-value': form.password }"
            />
            <button 
              type="button" 
              class="password-toggle"
              @click="showPassword = !showPassword"
              v-if="form.password"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
          <transition name="error-slide">
            <p class="error-message" v-if="errors.password">{{ errors.password }}</p>
          </transition>
        </div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="!isLoading" class="btn-content">
            <span>Đăng ký</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12,5 19,12 12,19"></polyline>
            </svg>
          </span>
          <div v-else class="loading-spinner">
            <div class="spinner"></div>
            <span>Đang xử lý...</span>
          </div>
        </button>

        <div class="form-footer">
          <p>Đã có tài khoản? <a href="#" class="login-link">Đăng nhập ngay</a></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: ''
      },
      errors: {},
      focusedInput: '',
      showPassword: false,
      isLoading: false
    };
  },
  methods: {
    async SignUp() {
      if (!this.validateUser()) {
        Swal.fire({
          title: "Lỗi",
          text: "Vui lòng điền đầy đủ thông tin hợp lệ",
          icon: "error",
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
        return;
      }

      this.isLoading = true;

      try {
        let userItem = {
          name: this.form.name,
          email: this.form.email,
          password: this.form.password
        }

        let result = await axios.post('http://localhost:3000/user', userItem)

        if (result.status === 201) {
          Swal.fire({
            title: "Thành công!",
            text: "Tài khoản đã được tạo thành công",
            icon: "success",
            timer: 2500,
            toast: true,
            position: 'top-end',
            showConfirmButton: false
          });
          
          setTimeout(() => {
            this.$router.push('/')
          }, 2500);
        }
      } catch (error) {
        Swal.fire({
          title: "Lỗi",
          text: "Có lỗi xảy ra, vui lòng thử lại",
          icon: "error",
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false
        });
      } finally {
        this.isLoading = false;
      }
    },

    validateUser() {
      const errors = {};
      
      if (!this.form.name) {
        errors.name = "Vui lòng nhập họ tên";
      } else if (this.form.name.length < 2) {
        errors.name = "Họ tên phải có ít nhất 2 ký tự";
      }

      if (!this.form.email) {
        errors.email = "Vui lòng nhập email";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        errors.email = "Email không hợp lệ";
      }

      if (!this.form.password) {
        errors.password = "Vui lòng nhập mật khẩu";
      } else if (this.form.password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      }

      this.errors = errors;
      return Object.keys(errors).length === 0;
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 70%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 40%;
  left: 80%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.register {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 
    0 32px 64px rgba(0, 0, 0, 0.1),
    0 16px 32px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 2;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  text-align: center;
  margin-bottom: 32px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.user-icon {
  width: 32px;
  height: 32px;
  color: white;
  stroke-width: 2;
}

.form-header h1 {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 0 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transition: left 0.6s;
}

.input-wrapper:hover::before {
  left: 100%;
}

.input-wrapper.focused {
  border-color: #667eea;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.input-wrapper.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.input-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  margin-right: 12px;
  stroke-width: 2;
  transition: color 0.3s ease;
  flex-shrink: 0;
}

.input-wrapper.focused .input-icon {
  color: #667eea;
}

.input-wrapper input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 16px 0;
  font-size: 16px;
  color: #1f2937;
  outline: none;
  transition: all 0.3s ease;
}

.input-wrapper input::placeholder {
  color: #9ca3af;
  transition: all 0.3s ease;
}

.input-wrapper.focused input::placeholder {
  color: #d1d5db;
  transform: translateY(-2px);
}

.password-toggle {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.3s ease;
  border-radius: 8px;
}

.password-toggle:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.password-toggle svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin: 0;
  padding-left: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 18px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-icon {
  transform: translateX(4px);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.form-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.form-footer p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-container {
    padding: 16px;
  }
  
  .register {
    padding: 32px 24px;
    border-radius: 20px;
  }
  
  .form-header h1 {
    font-size: 28px;
  }
  
  .icon-wrapper {
    width: 64px;
    height: 64px;
  }
  
  .user-icon {
    width: 24px;
    height: 24px;
  }
}

@media (max-width: 480px) {
  .register {
    padding: 24px 20px;
  }
  
  .form-header h1 {
    font-size: 24px;
  }
  
  .input-wrapper {
    padding: 0 12px;
  }
  
  .input-wrapper input {
    padding: 14px 0;
    font-size: 15px;
  }
}
</style>