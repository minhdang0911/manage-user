<template>
    <div class="container">
        <Header></Header>

        <!-- Search and Filter Section -->
        <div class="controls-section">
            <div class="search-box">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
                    class="search-input"
                />
                <i class="search-icon">🔍</i>
            </div>

            <div class="actions">
                <!-- <button class="btn btn-primary" @click="showAddModal = true">
                    <i class="icon">➕</i>
                    Thêm mới
                </button> -->
                <button class="btn btn-secondary" @click="refreshData">
                    <i class="icon">🔄</i>
                    Làm mới
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredItems.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <h3>Không có dữ liệu</h3>
            <p>Chưa có bài viết nào được tạo</p>
        </div>

        <!-- Table Section -->
        <div v-else class="table-container">
            <div class="table-wrapper">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th class="sortable" @click="sortBy('id')">
                                ID
                                <span class="sort-icon" :class="getSortClass('id')">↕️</span>
                            </th>
                            <th class="sortable" @click="sortBy('title')">
                                Tiêu đề
                                <span class="sort-icon" :class="getSortClass('title')">↕️</span>
                            </th>
                            <th>Nội dung</th>
                            <th class="text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in paginatedItems" :key="item.id" class="table-row">
                            <td class="id-cell">
                                <span class="id-badge">#{{ item.id }}</span>
                            </td>
                            <td class="title-cell">
                                <div class="title-content">
                                    <h4>{{ item.title }}</h4>
                                    <span class="created-date">{{ formatDate(item.createdAt) }}</span>
                                </div>
                            </td>
                            <td class="content-cell">
                                <div class="content-preview" v-html="formatContent(item.content)"></div>
                            </td>
                            <td class="action-cell">
                                <div class="action-buttons">
                                    <button class="btn-action btn-view" title="Xem chi tiết" @click="viewItem(item)">
                                        <i class="icon">👁️</i>
                                    </button>
                                    <button class="btn-action btn-edit" title="Chỉnh sửa" @click="editItem(item)">
                                        <i class="icon">✏️</i>
                                    </button>
                                    <button class="btn-action btn-delete" title="Xóa" @click="confirmDelete(item)">
                                        <i class="icon">🗑️</i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="pagination-container">
                <div class="pagination-info">
                    Hiển thị {{ startIndex + 1 }}-{{ Math.min(endIndex, filteredItems.length) }} của
                    {{ filteredItems.length }} kết quả
                </div>
                <div class="pagination">
                    <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">‹ Trước</button>

                    <button
                        v-for="page in visiblePages"
                        :key="page"
                        class="pagination-btn"
                        :class="{ active: page === currentPage }"
                        @click="currentPage = page"
                    >
                        {{ page }}
                    </button>

                    <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                        Sau ›
                    </button>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
            <div class="modal-content modal-form" @click.stop>
                <h3>{{ showAddModal ? 'Thêm bài viết mới' : 'Chỉnh sửa bài viết' }}</h3>

                <form @submit.prevent="showAddModal ? addItem() : updateItem()">
                    <div class="form-group">
                        <label for="title">Tiêu đề *</label>
                        <input
                            v-model="formData.title"
                            type="text"
                            id="title"
                            class="form-input"
                            placeholder="Nhập tiêu đề bài viết"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="content">Nội dung *</label>
                        <textarea
                            v-model="formData.content"
                            id="content"
                            class="form-textarea"
                            placeholder="Nhập nội dung bài viết"
                            rows="6"
                            required
                        ></textarea>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" @click="closeModals">Hủy</button>
                        <button type="submit" class="btn btn-primary" :disabled="saving">
                            {{ saving ? 'Đang lưu...' : showAddModal ? 'Thêm mới' : 'Cập nhật' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- View Modal -->
        <div v-if="showViewModal" class="modal-overlay" @click="closeModals">
            <div class="modal-content modal-view" @click.stop>
                <h3>{{ viewingItem?.title }}</h3>
                <div class="view-content">
                    <div class="view-meta">
                        <span class="view-id">ID: #{{ viewingItem?.id }}</span>
                        <span class="view-date">{{ formatDate(viewingItem?.createdAt) }}</span>
                    </div>
                    <div class="view-body" v-html="formatContent(viewingItem?.content)"></div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-secondary" @click="closeModals">Đóng</button>
                    <button class="btn btn-primary" @click="editItem(viewingItem)">Chỉnh sửa</button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
            <div class="modal-content" @click.stop>
                <h3>Xác nhận xóa</h3>
                <p>
                    Bạn có chắc chắn muốn xóa bài viết "<strong>{{ itemToDelete?.title }}</strong
                    >"?
                </p>
                <div class="modal-actions">
                    <button class="btn btn-secondary" @click="closeDeleteModal">Hủy</button>
                    <button class="btn btn-danger" @click="deleteItem" :disabled="deleting">
                        {{ deleting ? 'Đang xóa...' : 'Xóa' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Toast Notifications -->
        <div v-if="toast.show" class="toast" :class="toast.type">
            <div class="toast-content">
                <span class="toast-icon">{{ toast.icon }}</span>
                <span class="toast-message">{{ toast.message }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from './Header.vue';

export default {
    name: 'PostTable',
    components: {
        Header,
    },
    data() {
        return {
            items: [],
            loading: true,
            searchQuery: '',
            currentPage: 1,
            itemsPerPage: 10,
            sortField: 'id',
            sortDirection: 'asc',

            // Modals
            showDeleteModal: false,
            showAddModal: false,
            showEditModal: false,
            showViewModal: false,

            // Form data
            formData: {
                title: '',
                content: '',
            },

            // Items for actions
            itemToDelete: null,
            itemToEdit: null,
            viewingItem: null,

            // Loading states
            saving: false,
            deleting: false,

            // Toast notifications
            toast: {
                show: false,
                type: 'success',
                message: '',
                icon: '✅',
            },
        };
    },
    computed: {
        filteredItems() {
            if (!this.searchQuery) return this.sortedItems;

            const query = this.searchQuery.toLowerCase();
            return this.sortedItems.filter(
                (item) => item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query),
            );
        },
        sortedItems() {
            const items = [...this.items];
            return items.sort((a, b) => {
                let aVal = a[this.sortField];
                let bVal = b[this.sortField];

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (this.sortDirection === 'asc') {
                    return aVal > bVal ? 1 : -1;
                } else {
                    return aVal < bVal ? 1 : -1;
                }
            });
        },
        totalPages() {
            return Math.ceil(this.filteredItems.length / this.itemsPerPage);
        },
        startIndex() {
            return (this.currentPage - 1) * this.itemsPerPage;
        },
        endIndex() {
            return this.startIndex + this.itemsPerPage;
        },
        paginatedItems() {
            return this.filteredItems.slice(this.startIndex, this.endIndex);
        },
        visiblePages() {
            const pages = [];
            const start = Math.max(1, this.currentPage - 2);
            const end = Math.min(this.totalPages, this.currentPage + 2);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },
    },
    async created() {
        await this.loadData();
    },
    methods: {
        async loadData() {
            try {
                this.loading = true;
                const userLogin = JSON.parse(localStorage.getItem('userLogin') || '{}');
                const userId = userLogin.id;

                if (!userId) {
                    this.showToast('error', 'Không tìm thấy thông tin người dùng', '❌');
                    return;
                }

                const result = await axios.get(`http://localhost:3000/post?userId=${userId}`);
                if (result.status === 200) {
                    this.items = result.data || [];
                    if (this.items.length === 0) {
                        this.showToast('info', 'Chưa có bài viết nào', 'ℹ️');
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
                this.showToast('error', 'Lỗi khi tải dữ liệu', '❌');
            } finally {
                this.loading = false;
            }
        },

        async refreshData() {
            this.showToast('info', 'Đang làm mới dữ liệu...', '🔄');
            await this.loadData();
        },

        // Toast notification
        showToast(type, message, icon) {
            this.toast = {
                show: true,
                type,
                message,
                icon,
            };
            setTimeout(() => {
                this.toast.show = false;
            }, 3000);
        },

        // Modal management
        closeModals() {
            this.showAddModal = false;
            this.showEditModal = false;
            this.showViewModal = false;
            this.resetForm();
        },

        resetForm() {
            this.formData = {
                title: '',
                content: '',
            };
            this.itemToEdit = null;
            this.viewingItem = null;
        },

        // CRUD Operations
        async addItem() {
            if (!this.formData.title.trim() || !this.formData.content.trim()) {
                this.showToast('error', 'Vui lòng điền đầy đủ thông tin', '❌');
                return;
            }

            try {
                this.saving = true;
                const userLogin = JSON.parse(localStorage.getItem('userLogin') || '{}');
                const userId = userLogin.id;

                const newPost = {
                    title: this.formData.title.trim(),
                    content: this.formData.content.trim(),
                    userId: userId,
                    createdAt: new Date().toISOString(),
                };

                const result = await axios.post('http://localhost:3000/post', newPost);

                if (result.status === 200 || result.status === 201) {
                    this.items.unshift(result.data);
                    this.closeModals();
                    this.showToast('success', 'Thêm bài viết thành công', '✅');
                }
            } catch (error) {
                console.error('Error adding item:', error);
                this.showToast('error', 'Lỗi khi thêm bài viết', '❌');
            } finally {
                this.saving = false;
            }
        },

        viewItem(item) {
            this.viewingItem = item;
            this.showViewModal = true;
        },

        editItem(item) {
            this.itemToEdit = item;
            this.formData = {
                title: item.title,
                content: item.content,
            };
            this.showViewModal = false;
            this.showEditModal = true;
        },

        async updateItem() {
            if (!this.formData.title.trim() || !this.formData.content.trim()) {
                this.showToast('error', 'Vui lòng điền đầy đủ thông tin', '❌');
                return;
            }

            try {
                this.saving = true;

                const updatedPost = {
                    ...this.itemToEdit,
                    title: this.formData.title.trim(),
                    content: this.formData.content.trim(),
                    updatedAt: new Date().toISOString(),
                };

                const result = await axios.put(`http://localhost:3000/post/${this.itemToEdit.id}`, updatedPost);

                if (result.status === 200) {
                    const index = this.items.findIndex((item) => item.id === this.itemToEdit.id);
                    if (index !== -1) {
                        this.items.splice(index, 1, result.data);
                    }
                    this.closeModals();
                    this.showToast('success', 'Cập nhật bài viết thành công', '✅');
                }
            } catch (error) {
                console.error('Error updating item:', error);
                this.showToast('error', 'Lỗi khi cập nhật bài viết', '❌');
            } finally {
                this.saving = false;
            }
        },
        formatContent(content) {
            if (!content) return '';
            const truncated = content.length > 100 ? content.substring(0, 100) + '...' : content;
            return truncated.replace(/\n/g, '<br>');
        },
        formatDate(dateString) {
            if (!dateString) return '';
            return new Date(dateString).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
        sortBy(field) {
            if (this.sortField === field) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortField = field;
                this.sortDirection = 'asc';
            }
        },
        getSortClass(field) {
            if (this.sortField !== field) return '';
            return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
        },
        confirmDelete(item) {
            this.itemToDelete = item;
            this.showDeleteModal = true;
        },
        closeDeleteModal() {
            this.showDeleteModal = false;
            this.itemToDelete = null;
        },
        async deleteItem() {
            if (!this.itemToDelete) return;

            try {
                this.deleting = true;
                const result = await axios.delete(`http://localhost:3000/post/${this.itemToDelete.id}`);

                if (result.status === 200 || result.status === 204) {
                    this.items = this.items.filter((item) => item.id !== this.itemToDelete.id);
                    this.closeDeleteModal();
                    this.showToast('success', 'Xóa bài viết thành công', '✅');

                    // Adjust current page if needed
                    if (this.paginatedItems.length === 0 && this.currentPage > 1) {
                        this.currentPage--;
                    }
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                this.showToast('error', 'Lỗi khi xóa bài viết', '❌');
            } finally {
                this.deleting = false;
            }
        },
    },
};
</script>

<style scoped>
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Controls Section */
.controls-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 20px;
    flex-wrap: wrap;
}

.search-box {
    position: relative;
    flex: 1;
    min-width: 300px;
    margin-top: 10px;
}

.search-input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    border: 2px solid #e1e5e9;
    border-radius: 12px;
    font-size: 14px;
    transition: all 0.3s ease;
    background: #fff;
}

.search-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
}

.actions {
    display: flex;
    gap: 12px;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
}

.btn-primary {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover {
    background: #e5e7eb;
}

.btn-danger {
    background: #ef4444;
    color: white;
}

.btn-danger:hover {
    background: #dc2626;
}

/* Loading State */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: #6b7280;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-top: 3px solid #4f46e5;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
}

.empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

/* Table Styles */
.table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.table-wrapper {
    overflow-x: auto;
}

.modern-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
}

.modern-table thead {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.modern-table th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    white-space: nowrap;
}

.modern-table th.sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s ease;
}

.modern-table th.sortable:hover {
    background-color: rgba(79, 70, 229, 0.05);
}

.sort-icon {
    margin-left: 8px;
    opacity: 0.5;
    transition: opacity 0.2s ease;
}

.sort-asc {
    opacity: 1;
    transform: rotate(180deg);
}

.sort-desc {
    opacity: 1;
}

.modern-table td {
    padding: 16px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: top;
}

.table-row {
    transition: background-color 0.2s ease;
}

.table-row:hover {
    background-color: #f9fafb;
}

.id-cell {
    width: 80px;
}

.id-badge {
    display: inline-block;
    padding: 4px 8px;
    background: #e0e7ff;
    color: #4338ca;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
}

.title-cell {
    min-width: 200px;
}

.title-content h4 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    line-height: 1.4;
}

.created-date {
    font-size: 12px;
    color: #6b7280;
}

.content-cell {
    max-width: 300px;
}

.content-preview {
    color: #4b5563;
    line-height: 1.5;
    word-break: break-word;
}

.action-cell {
    width: 140px;
}

.action-buttons {
    display: flex;
    gap: 6px;
}

.btn-action {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 14px;
}

.btn-view {
    background: #dbeafe;
    color: #1d4ed8;
}

.btn-view:hover {
    background: #bfdbfe;
    transform: scale(1.05);
}

.btn-edit {
    background: #fef3c7;
    color: #d97706;
}

.btn-edit:hover {
    background: #fde68a;
    transform: scale(1.05);
}

.btn-delete {
    background: #fee2e2;
    color: #dc2626;
}

.btn-delete:hover {
    background: #fecaca;
    transform: scale(1.05);
}

/* Pagination */
.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
}

.pagination-info {
    color: #6b7280;
    font-size: 14px;
}

.pagination {
    display: flex;
    gap: 4px;
}

.pagination-btn {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    background: white;
    color: #374151;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}

.pagination-btn:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #9ca3af;
}

.pagination-btn.active {
    background: #4f46e5;
    color: white;
    border-color: #4f46e5;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Modal Form Styles */
.modal-form {
    max-width: 500px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: #374151;
}

.form-input,
.form-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s ease;
    font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-textarea {
    resize: vertical;
    min-height: 120px;
}

/* Modal View Styles */
.modal-view {
    max-width: 600px;
}

.view-content {
    margin: 20px 0;
}

.view-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e5e7eb;
}

.view-id {
    background: #e0e7ff;
    color: #4338ca;
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
}

.view-date {
    color: #6b7280;
    font-size: 14px;
}

.view-body {
    line-height: 1.6;
    color: #374151;
}

/* Toast Notifications */
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    padding: 12px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease;
    max-width: 350px;
}

.toast.success {
    background: #10b981;
    color: white;
}

.toast.error {
    background: #ef4444;
    color: white;
}

.toast.info {
    background: #3b82f6;
    color: white;
}

.toast-content {
    display: flex;
    align-items: center;
    gap: 8px;
}

.toast-icon {
    font-size: 16px;
}

.toast-message {
    font-size: 14px;
    font-weight: 500;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
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
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 24px;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
    margin: 0 0 16px 0;
    color: #111827;
}

.modal-content p {
    margin: 0 0 24px 0;
    color: #6b7280;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.text-center {
    text-align: center;
}

.icon {
    font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
    .controls-section {
        flex-direction: column;
        align-items: stretch;
    }

    .search-box {
        min-width: unset;
    }

    .actions {
        justify-content: center;
    }

    .pagination-container {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }

    .modern-table th,
    .modern-table td {
        padding: 12px 8px;
    }

    .title-cell {
        min-width: 150px;
    }

    .content-cell {
        max-width: 200px;
    }
}
</style>
