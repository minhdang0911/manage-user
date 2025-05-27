<template>
    <div class="user-update-container">
        <!-- Custom Notification -->
        <transition name="notification" appear>
            <div v-if="notification.show" :class="['notification', `notification--${notification.type}`]">
                <div class="notification__icon">
                    <svg v-if="notification.type === 'success'" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <svg v-else-if="notification.type === 'error'" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                    </svg>
                </div>
                <div class="notification__content">
                    <div class="notification__title">{{ notification.title }}</div>
                    <div class="notification__message">{{ notification.message }}</div>
                </div>
                <button class="notification__close" @click="closeNotification">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                        />
                    </svg>
                </button>
            </div>
        </transition>

        <!-- Header -->
        <div class="page-header">
            <h1 class="page-title">Cập nhật thông tin người dùng</h1>
            <p class="page-subtitle">Chỉnh sửa thông tin cá nhân của bạn</p>
        </div>

        <!-- Update Form -->
        <div class="form-container">
            <form @submit.prevent="UpdateUser" class="user-form">
                <div class="form-group">
                    <label for="name" class="form-label">
                        <svg class="form-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                            />
                        </svg>
                        Họ và tên
                    </label>
                    <input
                        id="name"
                        type="text"
                        v-model="form.name"
                        @blur="validateField('name')"
                        @input="clearFieldError('name')"
                        placeholder="Nhập họ và tên"
                        class="form-input"
                        :class="{ 'form-input--error': errors.name }"
                        maxlength="50"
                        required
                    />
                    <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">
                        <svg class="form-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                            />
                        </svg>
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        v-model="form.email"
                        @blur="validateField('email')"
                        @input="clearFieldError('email')"
                        placeholder="Nhập địa chỉ email"
                        class="form-input"
                        :class="{ 'form-input--error': errors.email }"
                        maxlength="100"
                        required
                    />
                    <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>

                <div class="form-group">
                    <label for="password" class="form-label">
                        <svg class="form-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                            />
                        </svg>
                        Mật khẩu
                    </label>
                    <div class="password-input-container">
                        <input
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            v-model="form.password"
                            @blur="validateField('password')"
                            @input="clearFieldError('password')"
                            placeholder="Nhập mật khẩu"
                            class="form-input password-input"
                            :class="{ 'form-input--error': errors.password }"
                            maxlength="128"
                            required
                        />
                        <button type="button" class="password-toggle" @click="showPassword = !showPassword">
                            <svg v-if="showPassword" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                                />
                            </svg>
                            <svg v-else viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                                />
                            </svg>
                        </button>
                    </div>
                    <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
                    <div v-if="form.password && !errors.password" class="password-strength">
                        <div class="password-strength__label">Độ mạnh mật khẩu:</div>
                        <div class="password-strength__bar">
                            <div
                                class="password-strength__fill"
                                :class="`password-strength__fill--${getPasswordStrength()}`"
                                :style="{ width: getPasswordStrengthWidth() }"
                            ></div>
                        </div>
                        <div
                            class="password-strength__text"
                            :class="`password-strength__text--${getPasswordStrength()}`"
                        >
                            {{ getPasswordStrengthText() }}
                        </div>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn--primary" :disabled="loading">
                        <svg v-if="loading" class="btn-icon btn-icon--loading" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"
                            />
                        </svg>
                        <span v-if="!loading">Cập nhật thông tin</span>
                        <span v-else>Đang cập nhật...</span>
                    </button>

                    <router-link to="/posts" class="btn btn--secondary">
                        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                        </svg>
                        Danh sách bài viết
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            form: {
                name: '',
                email: '',
                password: '',
            },
            errors: {},
            loading: false,
            showPassword: false,
            notification: {
                show: false,
                type: 'success', // success, error, warning, info
                title: '',
                message: '',
                duration: 4000,
            },
        };
    },
    mounted() {
        this.loadUserData();
    },
    methods: {
        loadUserData() {
            try {
                let userLogin = JSON.parse(localStorage.getItem('userLogin'));
                if (userLogin) {
                    this.form.name = userLogin.name || '';
                    this.form.email = userLogin.email || '';
                    this.form.password = userLogin.password || '';
                }
            } catch (error) {
                this.showNotification('error', 'Lỗi', 'Không thể tải thông tin người dùng');
            }
        },

        validateForm() {
            this.errors = {};

            // Validate name
            if (!this.form.name.trim()) {
                this.errors.name = 'Vui lòng nhập họ và tên';
            } else if (this.form.name.trim().length < 2) {
                this.errors.name = 'Họ và tên phải có ít nhất 2 ký tự';
            } else if (this.form.name.trim().length > 50) {
                this.errors.name = 'Họ và tên không được quá 50 ký tự';
            } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(this.form.name.trim())) {
                this.errors.name = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
            }

            // Validate email
            if (!this.form.email.trim()) {
                this.errors.email = 'Vui lòng nhập email';
            } else if (!this.isValidEmail(this.form.email.trim())) {
                this.errors.email = 'Email không hợp lệ (ví dụ: user@example.com)';
            } else if (this.form.email.trim().length > 100) {
                this.errors.email = 'Email không được quá 100 ký tự';
            }

            // Validate password
            if (!this.form.password.trim()) {
                this.errors.password = 'Vui lòng nhập mật khẩu';
            } else if (this.form.password.length < 8) {
                this.errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
            } else if (this.form.password.length > 128) {
                this.errors.password = 'Mật khẩu không được quá 128 ký tự';
            } else if (!this.isStrongPassword(this.form.password)) {
                this.errors.password = 'Mật khẩu phải chứa ít nhất: 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
            }

            return Object.keys(this.errors).length === 0;
        },

        isValidEmail(email) {
            const emailRegex =
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return emailRegex.test(email);
        },

        isStrongPassword(password) {
            // Ít nhất 8 ký tự, có chữ thường, chữ hoa, số và ký tự đặc biệt
            const minLength = password.length >= 8;
            const hasLower = /[a-z]/.test(password);
            const hasUpper = /[A-Z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            return minLength && hasLower && hasUpper && hasNumber && hasSpecial;
        },

        // Validate realtime khi user typing
        validateField(fieldName) {
            const tempErrors = { ...this.errors };
            delete tempErrors[fieldName];

            switch (fieldName) {
                case 'name':
                    if (!this.form.name.trim()) {
                        tempErrors.name = 'Vui lòng nhập họ và tên';
                    } else if (this.form.name.trim().length < 2) {
                        tempErrors.name = 'Họ và tên phải có ít nhất 2 ký tự';
                    } else if (this.form.name.trim().length > 50) {
                        tempErrors.name = 'Họ và tên không được quá 50 ký tự';
                    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(this.form.name.trim())) {
                        tempErrors.name = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
                    }
                    break;

                case 'email':
                    if (!this.form.email.trim()) {
                        tempErrors.email = 'Vui lòng nhập email';
                    } else if (!this.isValidEmail(this.form.email.trim())) {
                        tempErrors.email = 'Email không hợp lệ (ví dụ: user@example.com)';
                    } else if (this.form.email.trim().length > 100) {
                        tempErrors.email = 'Email không được quá 100 ký tự';
                    }
                    break;

                case 'password':
                    if (!this.form.password.trim()) {
                        tempErrors.password = 'Vui lòng nhập mật khẩu';
                    } else if (this.form.password.length < 8) {
                        tempErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
                    } else if (this.form.password.length > 128) {
                        tempErrors.password = 'Mật khẩu không được quá 128 ký tự';
                    } else if (!this.isStrongPassword(this.form.password)) {
                        tempErrors.password =
                            'Mật khẩu phải chứa ít nhất: 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
                    }
                    break;
            }

            this.errors = tempErrors;
        },

        async UpdateUser() {
            if (!this.validateForm()) {
                this.showNotification('error', 'Lỗi xác thực', 'Vui lòng kiểm tra lại thông tin đã nhập');
                return;
            }

            this.loading = true;

            try {
                let items = {
                    name: this.form.name.trim(),
                    email: this.form.email.trim(),
                    password: this.form.password,
                };

                let result = await axios.put(`http://localhost:3000/user/${this.$route.params.id}`, items);

                if (result.status === 200) {
                    localStorage.setItem('userLogin', JSON.stringify(items));
                    this.showNotification('success', 'Thành công!', 'Thông tin người dùng đã được cập nhật thành công');
                } else {
                    throw new Error('Cập nhật thất bại');
                }
            } catch (error) {
                console.error('Update error:', error);
                this.showNotification(
                    'error',
                    'Cập nhật thất bại',
                    error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin',
                );
            } finally {
                this.loading = false;
            }
        },

        showNotification(type, title, message) {
            this.notification = {
                show: true,
                type,
                title,
                message,
                duration: 4000,
            };

            // Auto hide notification
            setTimeout(() => {
                this.closeNotification();
            }, this.notification.duration);
        },

        closeNotification() {
            this.notification.show = false;
        },

        clearFieldError(fieldName) {
            if (this.errors[fieldName]) {
                const tempErrors = { ...this.errors };
                delete tempErrors[fieldName];
                this.errors = tempErrors;
            }
        },

        getPasswordStrength() {
            const password = this.form.password;
            if (!password) return 'weak';

            let score = 0;

            // Length check
            if (password.length >= 8) score++;
            if (password.length >= 12) score++;

            // Character variety
            if (/[a-z]/.test(password)) score++;
            if (/[A-Z]/.test(password)) score++;
            if (/\d/.test(password)) score++;
            if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

            if (score <= 2) return 'weak';
            if (score <= 4) return 'medium';
            return 'strong';
        },

        getPasswordStrengthWidth() {
            const strength = this.getPasswordStrength();
            switch (strength) {
                case 'weak':
                    return '25%';
                case 'medium':
                    return '60%';
                case 'strong':
                    return '100%';
                default:
                    return '0%';
            }
        },

        getPasswordStrengthText() {
            const strength = this.getPasswordStrength();
            switch (strength) {
                case 'weak':
                    return 'Yếu';
                case 'medium':
                    return 'Trung bình';
                case 'strong':
                    return 'Mạnh';
                default:
                    return '';
            }
        },
    },
};
</script>

<style scoped>
.user-update-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Notification Styles */
.notification {
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: flex-start;
    padding: 1rem;
    max-width: 400px;
    z-index: 1000;
    border-left: 4px solid;
}

.notification--success {
    border-left-color: #52c41a;
}

.notification--error {
    border-left-color: #ff4d4f;
}

.notification__icon {
    width: 24px;
    height: 24px;
    margin-right: 12px;
    flex-shrink: 0;
    margin-top: 2px;
}

.notification--success .notification__icon {
    color: #52c41a;
}

.notification--error .notification__icon {
    color: #ff4d4f;
}

.notification__content {
    flex: 1;
}

.notification__title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 4px;
    color: #262626;
}

.notification__message {
    font-size: 14px;
    color: #595959;
    line-height: 1.4;
}

.notification__close {
    background: none;
    border: none;
    width: 20px;
    height: 20px;
    color: #8c8c8c;
    cursor: pointer;
    padding: 0;
    margin-left: 8px;
    flex-shrink: 0;
}

.notification__close:hover {
    color: #595959;
}

/* Notification Animation */
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(100%);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

/* Header Styles */
.page-header {
    text-align: center;
    margin-bottom: 3rem;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

/* Form Container */
.form-container {
    max-width: 480px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}

.user-form {
    width: 100%;
}

/* Form Group */
.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #262626;
    margin-bottom: 0.5rem;
    font-size: 14px;
}

.form-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
    color: #8c8c8c;
}

/* Form Input */
.form-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #d9d9d9;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: #fafafa;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #1890ff;
    background: white;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input--error {
    border-color: #ff4d4f;
    background: #fff2f0;
}

.form-input--error:focus {
    box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

/* Password Input */
.password-input-container {
    position: relative;
}

.password-input {
    padding-right: 48px;
}

.password-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    width: 24px;
    height: 24px;
    color: #8c8c8c;
    cursor: pointer;
    padding: 0;
}

.password-toggle:hover {
    color: #595959;
}

/* Error Message */
.error-message {
    display: block;
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 4px;
}

/* Form Actions */
.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

/* Button Styles */
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    flex: 1;
}

.btn-icon {
    width: 18px;
    height: 18px;
    margin-right: 8px;
}

.btn-icon--loading {
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

.btn--primary {
    background: #1890ff;
    color: white;
}

.btn--primary:hover:not(:disabled) {
    background: #40a9ff;
    transform: translateY(-1px);
}

.btn--primary:disabled {
    background: #d9d9d9;
    color: #8c8c8c;
    cursor: not-allowed;
    transform: none;
}

.btn--secondary {
    background: #f5f5f5;
    color: #595959;
    border: 1px solid #d9d9d9;
}

.btn--secondary:hover {
    background: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
    transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
    .user-update-container {
        padding: 1rem;
    }

    .page-title {
        font-size: 2rem;
    }

    .form-container {
        padding: 1.5rem;
    }

    .form-actions {
        flex-direction: column;
    }

    .notification {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        max-width: none;
    }
}
</style>
