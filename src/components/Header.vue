<template>
    <header class="header">
        <nav class="navbar">
            <!-- Logo/Brand -->
            <div class="navbar-brand">
                <router-link to="/" class="brand-link">
                    <div class="brand-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 2L2 7L12 12L22 7L12 2Z"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M2 17L12 22L22 17"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M2 12L12 17L22 12"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </div>
                    <span class="brand-text">MyBlog</span>
                </router-link>
            </div>

            <!-- Mobile Menu Toggle -->
            <button
                class="mobile-toggle"
                @click="toggleMobileMenu"
                :class="{ active: isMobileMenuOpen }"
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Navigation Menu -->
            <div class="navbar-menu" :class="{ active: isMobileMenuOpen }">
                <!-- Navigation Links -->
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/add-post" class="nav-link" @click="closeMobileMenu">
                            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" />
                                <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" stroke-width="2" />
                                <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" stroke-width="2" />
                                <polyline points="10,9 9,9 8,9" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <span>Thêm bài viết</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="`/update-user/${userId}`" class="nav-link" @click="closeMobileMenu">
                            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <span>Cập nhật thông tin tài khoản</span>
                        </router-link>
                    </li>
                </ul>

                <!-- User Menu -->
                <div class="user-menu">
                    <div class="user-info" @click="toggleUserDropdown" ref="userDropdown">
                        <div class="user-avatar">
                            <span>{{ userInitials }}</span>
                        </div>
                        <div class="user-details">
                            <span class="user-greeting">Chào mừng</span>
                            <span class="username">{{ username }}</span>
                        </div>
                        <svg
                            class="dropdown-arrow"
                            :class="{ rotate: isUserDropdownOpen }"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" />
                        </svg>
                    </div>

                    <!-- Dropdown Menu -->
                    <div class="dropdown-menu" :class="{ active: isUserDropdownOpen }">
                        <router-link to="/profile" class="dropdown-item" @click="closeDropdowns">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <span>Hồ sơ cá nhân</span>
                        </router-link>

                        <router-link to="/settings" class="dropdown-item" @click="closeDropdowns">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
                                <path
                                    d="M12 1v6m0 6v6m11-7h-6m-6 0H1m21-7a2 2 0 01-2 2H4a2 2 0 01-2-2m20 0a2 2 0 00-2-2H4a2 2 0 00-2 2"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                            </svg>
                            <span>Cài đặt</span>
                        </router-link>

                        <div class="dropdown-divider"></div>

                        <button class="dropdown-item logout-btn" @click="handleLogout">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                                    stroke="currentColor"
                                    stroke-width="2"
                                />
                                <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" />
                                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" />
                            </svg>
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Logout Confirmation Modal -->
        <div v-if="showLogoutModal" class="modal-overlay" @click="closeLogoutModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>Xác nhận đăng xuất</h3>
                </div>
                <div class="modal-body">
                    <p>Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-cancel" @click="closeLogoutModal">Hủy bỏ</button>
                    <button class="btn btn-logout" @click="confirmLogout">Đăng xuất</button>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderNavigation',
    data() {
        return {
            username: '',
            userEmail: '',
            userId: '',
            isMobileMenuOpen: false,
            isUserDropdownOpen: false,
            showLogoutModal: false,
        };
    },
    computed: {
        userInitials() {
            if (!this.username) return 'U';
            return this.username
                .split(' ')
                .map((name) => name.charAt(0).toUpperCase())
                .slice(0, 2)
                .join('');
        },
    },
    created() {
        this.loadUserData();
    },
    mounted() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', this.handleClickOutside);

        // Close mobile menu when window resizes
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        loadUserData() {
            try {
                const userLogin = localStorage.getItem('userLogin');
                if (userLogin) {
                    const userData = JSON.parse(userLogin);
                    this.username = userData.name || userData.username || 'Người dùng';
                    this.userEmail = userData.email || '';
                    this.userId = userData.id || '';
                } else {
                    // Redirect to login if no user data
                    this.$router.push('/login');
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                this.$router.push('/login');
            }
        },

        toggleMobileMenu() {
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
            // Prevent body scroll when mobile menu is open
            document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
        },

        closeMobileMenu() {
            this.isMobileMenuOpen = false;
            document.body.style.overflow = '';
        },

        toggleUserDropdown() {
            this.isUserDropdownOpen = !this.isUserDropdownOpen;
            this.isMobileMenuOpen = false;
        },

        closeDropdowns() {
            this.isUserDropdownOpen = false;
            this.isMobileMenuOpen = false;
            document.body.style.overflow = '';
        },

        handleClickOutside(event) {
            // Close user dropdown if clicked outside
            if (this.$refs.userDropdown && !this.$refs.userDropdown.contains(event.target)) {
                this.isUserDropdownOpen = false;
            }
        },

        handleResize() {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        },

        handleLogout() {
            this.showLogoutModal = true;
            this.closeDropdowns();
            localStorage.removeItem('userLogin');
            this.$router.push('/Login');
        },

        closeLogoutModal() {
            this.showLogoutModal = false;
        },

        confirmLogout() {
            try {
                // Clear user data
                localStorage.removeItem('userLogin');

                // Emit logout event
                this.$emit('user-logout');

                // Show success message (optional)
                this.$toast?.success('Đăng xuất thành công!');

                // Redirect to login
                this.$router.push('/login');
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.closeLogoutModal();
            }
        },
    },
};
</script>

<style scoped>
.header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.navbar {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
}

/* Brand */
.navbar-brand {
    flex-shrink: 0;
}

.brand-link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: #2d3748;
    font-weight: 700;
    font-size: 20px;
    transition: color 0.3s ease;
}

.brand-link:hover {
    color: #667eea;
}

.brand-icon {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.brand-icon svg {
    width: 18px;
    height: 18px;
}

/* Mobile Toggle */
.mobile-toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    gap: 4px;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.mobile-toggle:hover {
    background-color: #f7fafc;
}

.mobile-toggle span {
    width: 24px;
    height: 3px;
    background-color: #4a5568;
    border-radius: 2px;
    transition: all 0.3s ease;
}

.mobile-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(6px, 6px);
}

.mobile-toggle.active span:nth-child(2) {
    opacity: 0;
}

.mobile-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(6px, -6px);
}

/* Navigation Menu */
.navbar-menu {
    display: flex;
    align-items: center;
    gap: 20px;
}

.navbar-nav {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 8px;
}

.nav-item {
    margin: 0;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    text-decoration: none;
    color: #4a5568;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
}

.nav-link:hover {
    background-color: #f7fafc;
    color: #667eea;
    transform: translateY(-1px);
}

.nav-link.router-link-active {
    background-color: #667eea;
    color: white;
}

.nav-icon {
    width: 18px;
    height: 18px;
}

/* User Menu */
.user-menu {
    position: relative;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s ease;
    background: #f7fafc;
}

.user-info:hover {
    background: #edf2f7;
    transform: translateY(-1px);
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 14px;
}

.user-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.user-greeting {
    font-size: 12px;
    color: #718096;
    line-height: 1;
}

.username {
    font-weight: 600;
    color: #2d3748;
    font-size: 14px;
    line-height: 1.2;
}

.dropdown-arrow {
    width: 16px;
    height: 16px;
    color: #a0aec0;
    transition: transform 0.3s ease;
}

.dropdown-arrow.rotate {
    transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
    min-width: 200px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
}

.dropdown-menu.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    text-decoration: none;
    color: #4a5568;
    font-weight: 500;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.dropdown-item:hover {
    background-color: #f7fafc;
    color: #667eea;
}

.dropdown-item:first-child {
    border-radius: 12px 12px 0 0;
}

.dropdown-item:last-child {
    border-radius: 0 0 12px 12px;
}

.dropdown-item svg {
    width: 16px;
    height: 16px;
}

.logout-btn:hover {
    background-color: #fed7d7;
    color: #c53030;
}

.dropdown-divider {
    height: 1px;
    background-color: #e2e8f0;
    margin: 4px 0;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.modal-header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
}

.modal-body {
    padding: 20px 24px;
}

.modal-body p {
    margin: 0;
    color: #4a5568;
    line-height: 1.6;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 16px 24px 24px;
    justify-content: flex-end;
}

.btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-size: 14px;
}

.btn-cancel {
    background: #edf2f7;
    color: #4a5568;
}

.btn-cancel:hover {
    background: #e2e8f0;
}

.btn-logout {
    background: #e53e3e;
    color: white;
}

.btn-logout:hover {
    background: #c53030;
    transform: translateY(-1px);
}

/* Mobile Styles */
@media (max-width: 768px) {
    .mobile-toggle {
        display: flex;
    }

    .navbar-menu {
        position: fixed;
        top: 70px;
        left: 0;
        right: 0;
        background: white;
        flex-direction: column;
        padding: 20px;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        height: calc(100vh - 70px);
        overflow-y: auto;
        border-top: 1px solid #e2e8f0;
    }

    .navbar-menu.active {
        transform: translateX(0);
    }

    .navbar-nav {
        flex-direction: column;
        width: 100%;
        gap: 0;
        margin-bottom: 20px;
    }

    .nav-link {
        width: 100%;
        padding: 16px;
        justify-content: flex-start;
        border-radius: 12px;
    }

    .user-menu {
        width: 100%;
    }

    .user-info {
        width: 100%;
        justify-content: space-between;
        padding: 16px;
    }

    .dropdown-menu {
        position: static;
        opacity: 1;
        visibility: visible;
        transform: none;
        box-shadow: none;
        border: 1px solid #e2e8f0;
        margin-top: 12px;
    }

    .user-details {
        align-items: flex-start;
    }
}

@media (max-width: 480px) {
    .navbar {
        padding: 0 16px;
    }

    .brand-text {
        display: none;
    }

    .modal-content {
        margin: 20px;
        width: calc(100% - 40px);
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

/* Focus styles for better accessibility */
.nav-link:focus-visible,
.dropdown-item:focus-visible,
.user-info:focus-visible,
.btn:focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
}
</style>
