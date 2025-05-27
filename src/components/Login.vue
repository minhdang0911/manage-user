<template>
    <div class="login-container">
        <div class="login-card">
            <!-- Header -->
            <div class="login-header">
                <div class="login-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                            fill="currentColor"
                        />
                        <path d="M12 14C7.582 14 4 17.582 4 22H20C20 17.582 16.418 14 12 14Z" fill="currentColor" />
                    </svg>
                </div>
                <h1 class="login-title">Đăng Nhập</h1>
                <p class="login-subtitle">Chào mừng bạn trở lại!</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="Login" class="login-form">
                <!-- Email Field -->
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <polyline
                                    points="22,6 12,13 2,6"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                            </svg>
                        </div>
                        <input
                            id="email"
                            type="email"
                            v-model="form.email"
                            placeholder="Nhập địa chỉ email của bạn"
                            class="form-input"
                            :class="{ error: errors.email }"
                            @blur="validateEmail"
                            @input="clearError('email')"
                        />
                    </div>
                    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>

                <!-- Password Field -->
                <div class="form-group">
                    <label for="password" class="form-label">Mật khẩu</label>
                    <div class="input-wrapper">
                        <div class="input-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <circle cx="12" cy="16" r="1" fill="currentColor" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" />
                            </svg>
                        </div>
                        <input
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            v-model="form.password"
                            placeholder="Nhập mật khẩu của bạn"
                            class="form-input"
                            :class="{ error: errors.password }"
                            @blur="validatePassword"
                            @input="clearError('password')"
                        />
                        <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                            <svg
                                v-if="!showPassword"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" />
                            </svg>
                        </button>
                    </div>
                    <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
                </div>

                <!-- Remember & Forgot -->
                <div class="form-options">
                    <label class="checkbox-wrapper">
                        <input type="checkbox" v-model="rememberMe" />
                        <span class="checkmark"></span>
                        Ghi nhớ đăng nhập
                    </label>
                    <a href="#" class="forgot-link">Quên mật khẩu?</a>
                </div>

                <!-- Global Error -->
                <div v-if="msgError" class="global-error">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                        <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2" />
                        <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2" />
                    </svg>
                    {{ msgError }}
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="login-button"
                    :class="{ loading: isLoading }"
                    :disabled="isLoading || !isFormValid"
                >
                    <svg v-if="isLoading" class="loading-spinner" viewBox="0 0 24 24">
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                            fill="none"
                            opacity="0.25"
                        />
                        <path
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span v-if="!isLoading">Đăng Nhập</span>
                    <span v-else>Đang xử lý...</span>
                </button>

                <!-- Signup Link -->
                <div class="signup-link">
                    <span>Chưa có tài khoản? </span>
                    <router-link to="/signup" class="signup-btn">Đăng ký ngay</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'LoginComponent',
    data() {
        return {
            form: {
                email: '',
                password: '',
            },
            errors: {
                email: '',
                password: '',
            },
            msgError: '',
            showPassword: false,
            rememberMe: false,
            isLoading: false,
        };
    },
    computed: {
        isFormValid() {
            return (
                this.form.email &&
                this.form.password &&
                !this.errors.email &&
                !this.errors.password &&
                this.isValidEmail(this.form.email)
            );
        },
    },
    methods: {
        // Email validation
        validateEmail() {
            if (!this.form.email) {
                this.errors.email = 'Email không được để trống';
            } else if (!this.isValidEmail(this.form.email)) {
                this.errors.email = 'Email không hợp lệ';
            } else {
                this.errors.email = '';
            }
        },

        // Password validation
        validatePassword() {
            if (!this.form.password) {
                this.errors.password = 'Mật khẩu không được để trống';
            } else if (this.form.password.length < 6) {
                this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            } else {
                this.errors.password = '';
            }
        },

        // Email format validation
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        // Clear specific error
        clearError(field) {
            this.errors[field] = '';
            this.msgError = '';
        },

        // Validate entire form
        validateForm() {
            this.validateEmail();
            this.validatePassword();
            return this.isFormValid;
        },

        // Login method
        async Login() {
            // Validate form first
            if (!this.validateForm()) {
                return;
            }

            this.isLoading = true;
            this.msgError = '';

            try {
                const result = await axios.get('http://localhost:3000/user');

                if (result.status === 200 && result.data.length > 0) {
                    const userData = result.data.filter(
                        (user) => user.email === this.form.email && user.password === this.form.password,
                    );

                    if (userData.length > 0) {
                        // Store user data
                        const userInfo = {
                            ...userData[0],
                            loginTime: new Date().toISOString(),
                            rememberMe: this.rememberMe,
                        };

                        localStorage.setItem('userLogin', JSON.stringify(userInfo));

                        // Success feedback
                        this.$emit('login-success', userInfo);

                        // Navigate to home
                        setTimeout(() => {
                            this.$router.push('/');
                        }, 500);
                    } else {
                        this.msgError = 'Email hoặc mật khẩu không đúng';
                    }
                } else {
                    this.msgError = 'Không thể kết nối đến server';
                }
            } catch (error) {
                console.error('Login error:', error);
                this.msgError = 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.';
            } finally {
                this.isLoading = false;
            }
        },
    },

    // Auto-focus email field when component mounts
    mounted() {
        this.$nextTick(() => {
            const emailInput = document.getElementById('email');
            if (emailInput) {
                emailInput.focus();
            }
        });
    },
};
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease;
}

.login-card:hover {
    transform: translateY(-5px);
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-icon {
    width: 60px;
    height: 60px;
    margin: 0 auto 20px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.login-icon svg {
    width: 30px;
    height: 30px;
}

.login-title {
    font-size: 28px;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 8px 0;
}

.login-subtitle {
    color: #718096;
    font-size: 16px;
    margin: 0;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    font-weight: 600;
    color: #2d3748;
    font-size: 14px;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 12px;
    color: #a0aec0;
    width: 20px;
    height: 20px;
    z-index: 1;
}

.form-input {
    width: 100%;
    padding: 12px 12px 12px 44px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.3s ease;
    background: #fff;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
    border-color: #e53e3e;
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

.password-toggle {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: #a0aec0;
    cursor: pointer;
    padding: 4px;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    transition: color 0.2s ease;
}

.password-toggle:hover {
    color: #667eea;
}

.password-toggle svg {
    width: 16px;
    height: 16px;
}

.error-message {
    color: #e53e3e;
    font-size: 14px;
    margin-top: 4px;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
}

.checkbox-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 14px;
    color: #4a5568;
}

.checkbox-wrapper input[type='checkbox'] {
    margin-right: 8px;
    transform: scale(1.1);
}

.forgot-link {
    color: #667eea;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s ease;
}

.forgot-link:hover {
    color: #5a67d8;
    text-decoration: underline;
}

.global-error {
    background: #fed7d7;
    color: #c53030;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    border: 1px solid #feb2b2;
}

.global-error svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
}

.login-button {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 8px;
}

.login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.login-button.loading {
    pointer-events: none;
}

.loading-spinner {
    width: 20px;
    height: 20px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.signup-link {
    text-align: center;
    color: #718096;
    font-size: 14px;
    margin-top: 20px;
}

.signup-btn {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
}

.signup-btn:hover {
    color: #5a67d8;
    text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 480px) {
    .login-container {
        padding: 16px;
    }

    .login-card {
        padding: 24px;
    }

    .login-title {
        font-size: 24px;
    }

    .form-input {
        font-size: 16px; /* Prevent zoom on iOS */
    }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Focus visible for better accessibility */
.login-button:focus-visible,
.form-input:focus-visible,
.forgot-link:focus-visible,
.signup-btn:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}
</style>
