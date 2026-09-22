<template>
    <v-container class="py-8" max-width="1200">
        <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
            <div>
                <div class="text-overline text-primary">Client status</div>
                <h1 class="text-h4 font-weight-bold">Status library</h1>
                <p class="text-body-2 text-medium-emphasis mt-1">
                    Manage the categories each client status belongs to.
                </p>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Add item
            </v-btn>
        </div>

        <v-alert v-if="errorMessage" class="mb-4" closable type="error" @click:close="errorMessage = ''">
            {{ errorMessage }}
        </v-alert>

        <v-card border flat>
            <v-progress-linear v-if="loading" color="primary" indeterminate />
            <v-table v-else-if="categories.length && items.length" class="status-table">
                <thead>
                    <tr>
                        <th class="text-left item-column">Item</th>
                        <th v-for="category in categories" :key="category.id" class="text-center category-column">
                            <div class="font-weight-medium">{{ category.name }}</div>
                            <div class="text-caption text-medium-emphasis">{{ category.header }}</div>
                        </th>
                        <th class="text-right actions-column">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in items" :key="item.id">
                        <td class="font-weight-medium">{{ item.name }}</td>
                        <td v-for="category in categories" :key="category.id" class="text-center">
                            <v-checkbox-btn :model-value="hasCategory(item, category.id)" color="primary" disabled
                                density="compact" />
                        </td>
                        <td class="text-right">
                            <v-menu location="bottom end">
                                <template #activator="{ props }">
                                    <v-btn v-bind="props" aria-label="Item actions" icon="mdi-dots-vertical"
                                        size="small" variant="text" />
                                </template>
                                <v-list density="compact" min-width="150">
                                    <v-list-item prepend-icon="mdi-pencil" title="Edit" @click="openEditDialog(item)" />
                                    <v-list-item disabled prepend-icon="mdi-delete" title="Delete" />
                                </v-list>
                            </v-menu>
                        </td>
                    </tr>
                </tbody>
            </v-table>
            <div v-else class="pa-10 text-center text-medium-emphasis">
                No client status items found.
            </div>
            <div v-if="!loading && items.length" class="d-flex flex-wrap align-center justify-space-between pa-4 ga-4">
                <span class="text-body-2 text-medium-emphasis">
                    Showing {{ items.length }} of {{ totalItems }} items
                </span>
                <v-pagination v-model="currentPage" :length="lastPage" density="compact" total-visible="7"
                    @update:model-value="loadItems" />
            </div>
        </v-card>

        <v-dialog v-model="dialogOpen" max-width="560">
            <v-card>
                <v-card-title>{{ editingItem ? 'Edit item' : 'Add item' }}</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="saveItem">
                        <v-text-field v-model="form.name" :error-messages="formErrors.name" label="Item name" required
                            variant="outlined" />
                        <v-select v-model="form.categoryIds" :error-messages="formErrors.categoryIds"
                            :items="categories" item-title="name" item-value="id" label="Categories" multiple required
                            variant="outlined" />
                        <div class="d-flex justify-end ga-2 mt-2">
                            <v-btn variant="text" @click="dialogOpen = false">Cancel</v-btn>
                            <v-btn color="primary" :loading="saving" type="submit">
                                {{ editingItem ? 'Save changes' : 'Add item' }}
                            </v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import {
    createClientStatusItem,
    fetchCategories,
    fetchClientStatusItems,
    type Category,
    type Item,
    updateClientStatusItem,
} from '@/services/clientStatusApi'

const categories = ref<Category[]>([])
const items = ref<Item[]>([])
const currentPage = ref(1)
const lastPage = ref(1)
const totalItems = ref(0)
const perPage = 15
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const dialogOpen = ref(false)
const editingItem = ref<Item | null>(null)
const form = reactive({ name: '', categoryIds: [] as number[] })
const formErrors = reactive({ name: '', categoryIds: '' })

function hasCategory(item: Item, categoryId: number) {
    return item.categories?.some((category) => category.id === categoryId) ?? false
}

async function loadItems(page = currentPage.value) {
    loading.value = true
    errorMessage.value = ''

    try {
        const [loadedCategories, paginatedItems] = await Promise.all([
            fetchCategories(),
            fetchClientStatusItems(page, perPage),
        ])
        categories.value = loadedCategories
        items.value = paginatedItems.data
        currentPage.value = paginatedItems.current_page
        lastPage.value = paginatedItems.last_page
        totalItems.value = paginatedItems.total
    } catch {
        errorMessage.value = 'Unable to load client status items. Check that the Laravel API is running.'
    } finally {
        loading.value = false
    }
}

function resetForm() {
    form.name = ''
    form.categoryIds = []
    formErrors.name = ''
    formErrors.categoryIds = ''
}

function openCreateDialog() {
    editingItem.value = null
    resetForm()
    dialogOpen.value = true
}

function openEditDialog(item: Item) {
    editingItem.value = item
    form.name = item.name
    form.categoryIds = item.categories?.map((category) => category.id) ?? []
    formErrors.name = ''
    formErrors.categoryIds = ''
    dialogOpen.value = true
}

async function saveItem() {
    formErrors.name = form.name.trim() ? '' : 'Item name is required.'
    formErrors.categoryIds = form.categoryIds.length ? '' : 'Select at least one category.'
    if (formErrors.name || formErrors.categoryIds) return

    saving.value = true
    errorMessage.value = ''

    try {
        const payload = { name: form.name.trim(), category_ids: form.categoryIds }
        if (editingItem.value) {
            await updateClientStatusItem(editingItem.value.id, payload)
        } else {
            await createClientStatusItem(payload)
        }
        dialogOpen.value = false
        await loadItems()
    } catch {
        errorMessage.value = `Unable to ${editingItem.value ? 'update' : 'create'} the client status item.`
    } finally {
        saving.value = false
    }
}

onMounted(loadItems)
</script>

<style scoped>
.status-table th,
.status-table td {
    white-space: nowrap;
}

.item-column {
    min-width: 220px;
}

.category-column {
    min-width: 145px;
}

.actions-column {
    min-width: 90px;
}
</style>