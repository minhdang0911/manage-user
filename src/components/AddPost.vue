<template>
    <div class="add-post-container">
        <!-- Header Section -->
        <div class="header-section">
            <div class="header-content">
                <div class="icon-wrapper">
                    <svg class="create-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </div>
                <div class="header-text">
                    <h1 class="main-title">Tạo Bài Viết Mới</h1>
                    <p class="subtitle">Chia sẻ ý tưởng và câu chuyện của bạn</p>
                </div>
            </div>
        </div>

        <!-- Form Section -->
        <div class="form-container">
            <form @submit.prevent="AddPost" class="post-form">
                <!-- Title Input -->
                <div class="input-group">
                    <label for="title" class="input-label">
                        <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                        Tiêu đề bài viết
                    </label>
                    <input
                        id="title"
                        v-model="form.title"
                        type="text"
                        placeholder="Nhập tiêu đề hấp dẫn..."
                        class="form-input title-input"
                        :class="{ error: errors.title }"
                        @input="clearError('title')"
                    />
                    <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
                </div>

                <!-- Content Textarea -->
                <div class="input-group">
                    <label for="content" class="input-label">
                        <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14,2 14,8 20,8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10,9 9,9 8,9"></polyline>
                        </svg>
                        Nội dung bài viết
                    </label>
                    <textarea
                        id="content"
                        v-model="form.content"
                        placeholder="Viết nội dung bài viết của bạn ở đây..."
                        rows="8"
                        class="form-input content-input"
                        :class="{ error: errors.content }"
                        @input="clearError('content')"
                    ></textarea>
                    <div v-if="errors.content" class="error-message">{{ errors.content }}</div>
                    <div class="char-counter">{{ form.content.length }} ký tự</div>
                </div>

                <!-- Action Buttons -->
                <div class="button-group">
                    <button type="button" @click="goBack" class="btn btn-secondary" :disabled="loading">
                        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 12H5M12 19l-7-7 7-7"></path>
                        </svg>
                        Quay lại
                    </button>

                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="loading || !isFormValid"
                        :class="{ loading: loading }"
                    >
                        <svg v-if="!loading" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M19 13l-7 7-7-7m14-8l-7 7-7-7"></path>
                        </svg>
                        <div v-else class="spinner"></div>
                        {{ loading ? 'Đang đăng...' : 'Đăng bài viết' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Preview Section (Optional) -->
        <div v-if="form.title || form.content" class="preview-section">
            <h3 class="preview-title">Xem trước</h3>
            <div class="preview-card">
                <h4 class="preview-post-title">{{ form.title || 'Tiêu đề bài viết' }}</h4>
                <p class="preview-post-content">{{ form.content || 'Nội dung bài viết sẽ hiển thị ở đây...' }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            form: {
                title: '',
                content: '',
            },
            errors: {
                title: '',
                content: '',
            },
            loading: false,
        };
    },
    computed: {
        isFormValid() {
            return this.form.title.trim().length > 0 && this.form.content.trim().length > 0;
        },
    },
    methods: {
        async AddPost() {
            // Validate form
            if (!this.validateForm()) {
                return;
            }

            this.loading = true;

            try {
                const items = {
                    title: this.form.title.trim(),
                    content: this.form.content.trim(),
                    userId: JSON.parse(localStorage.getItem('userLogin')).id,
                };

                const result = await axios.post('http://localhost:3000/post', items);

                if (result) {
                    // Success notification with SweetAlert
                    await Swal.fire({
                        title: 'Thành công!',
                        text: 'Bài viết đã được tạo thành công!',
                        icon: 'success',
                        confirmButtonText: 'Tuyệt vời!',
                        confirmButtonColor: '#4f46e5',
                        timer: 2000,
                        timerProgressBar: true,
                    });

                    // Redirect to home page
                    this.$router.push('/');
                }
            } catch (error) {
                console.error('Error creating post:', error);

                // Error notification
                await Swal.fire({
                    title: 'Lỗi!',
                    text: 'Có lỗi xảy ra khi tạo bài viết. Vui lòng thử lại!',
                    icon: 'error',
                    confirmButtonText: 'Thử lại',
                    confirmButtonColor: '#ef4444',
                });
            } finally {
                this.loading = false;
            }
        },

        validateForm() {
            this.errors = { title: '', content: '' };
            let isValid = true;

            if (!this.form.title.trim()) {
                this.errors.title = 'Vui lòng nhập tiêu đề bài viết';
                isValid = false;
            } else if (this.form.title.trim().length < 5) {
                this.errors.title = 'Tiêu đề phải có ít nhất 5 ký tự';
                isValid = false;
            }

            if (!this.form.content.trim()) {
                this.errors.content = 'Vui lòng nhập nội dung bài viết';
                isValid = false;
            } else if (this.form.content.trim().length < 10) {
                this.errors.content = 'Nội dung phải có ít nhất 10 ký tự';
                isValid = false;
            }

            return isValid;
        },

        clearError(field) {
            this.errors[field] = '';
        },

        goBack() {
            if (this.form.title || this.form.content) {
                Swal.fire({
                    title: 'Bạn có chắc chắn?',
                    text: 'Dữ liệu đã nhập sẽ bị mất nếu bạn rời khỏi trang này.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#ef4444',
                    cancelButtonColor: '#6b7280',
                    confirmButtonText: 'Rời khỏi',
                    cancelButtonText: 'Ở lại',
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.$router.push('/');
                    }
                });
            } else {
                this.$router.push('/');
            }
        },
    },
};
</script>

<style scoped>
.add-post-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 1rem;
}

.header-section {
    text-align: center;
    margin-bottom: 3rem;
}

.header-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.icon-wrapper {
    width: 4rem;
    height: 4rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.create-icon {
    width: 2rem;
    height: 2rem;
    color: white;
}

.main-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
    font-size: 1.1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
}

.form-container {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.post-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.input-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 1rem;
}

.label-icon {
    width: 1.2rem;
    height: 1.2rem;
    color: #6366f1;
}

.form-input {
    padding: 1rem 1.25rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
    background: white;
}

.form-input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-input.error {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.title-input {
    font-weight: 600;
    font-size: 1.1rem;
}

.content-input {
    resize: vertical;
    min-height: 200px;
    line-height: 1.6;
}

.error-message {
    color: #ef4444;
    font-size: 0.875rem;
    font-weight: 500;
}

.char-counter {
    text-align: right;
    color: #6b7280;
    font-size: 0.875rem;
}

.button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
}

.btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    min-width: 140px;
    justify-content: center;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
    background: #e5e7eb;
    transform: translateY(-1px);
}

.btn-icon {
    width: 1.25rem;
    height: 1.25rem;
}

.spinner {
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.preview-section {
    max-width: 800px;
    margin: 2rem auto 0;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(10px);
}

.preview-title {
    color: #374151;
    margin-bottom: 1rem;
    font-size: 1.25rem;
    font-weight: 600;
}

.preview-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
}

.preview-post-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
}

.preview-post-content {
    color: #4b5563;
    line-height: 1.6;
    white-space: pre-wrap;
}

@media (max-width: 768px) {
    .add-post-container {
        padding: 1rem;
    }

    .main-title {
        font-size: 2rem;
    }

    .form-container {
        padding: 1.5rem;
    }

    .button-group {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}
</style>
