<template>
    <v-container maxWidth="700">
        <v-list mt-6>

        </v-list>
        <v-list mt-6>
            <v-list-item v-for="msg in messages" :key="msg.id">
                <template #prepend>
                    <v-avatar size="x-small" color="primary">
                        <span class="text-white">U</span>
                    </v-avatar>
                </template>
                <div class="d-flex">
                    <v-list-item-title>
                        {{ msg.createdBy }}
                    </v-list-item-title>
                    <v-spacer></v-spacer>
                    <v-icon-btn :icon="activeId === msg.id ? 'mdi-dots-horizontal' : 'mdi-dots-vertical'" size="small"
                        variant="none" @click="show($event, msg)"></v-icon-btn>
                </div>

                <div class="d-flex align-center ga-2 mb-10">
                    <v-list-item-subtitle class="mt-1 text-wrap">
                        {{ msg.comment }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="text-caption mt-1">
                        {{ msg.createdAt }}
                    </v-list-item-subtitle>
                </div>
                <v-divider />
            </v-list-item>
        </v-list>
        <v-menu v-model="showMenu" :offset="[-8, -12]" :target="menuTarget" location="bottom end"
            scroll-strategy="close" @update:model-value="onMenuChange">
            <v-list :items="menuItems" class="py-0" density="compact" item-value="code" slim @click="onMenuItemClick" />
        </v-menu>

    </v-container>
</template>

<script setup>

import { watch, ref } from "vue"


const showMenu = ref(false)
const menuTarget = ref(null)

const activeId = ref(null);


const menuItems = [
    { title: 'Pin to top', code: 'pin' },
    { type: 'divider' },
    { title: 'Edit comment', code: 'edit' },
    { type: 'divider' },
    { title: 'Copy comment link', code: 'edit' },
    { type: 'divider' },
    { title: 'Delete comment', code: 'delete' },
]


function pinMesssagToTop(event) {
    const id = event.value.id;
    messages.filter(m => m.id === id).isPinned = true;
}


const messages = [
    {
        id: 1,
        comment: "This looks great! Nice work.",
        createdAt: "2026-09-19 09:15",
        avatar: "https://i.pravatar.cc/150?img=1",
        isPinned: false,
        createdBy: "John",
    },
    {
        id: 2,
        comment: "I think we should update the layout a little.",
        createdAt: "2026-09-19 10:30",
        avatar: "https://i.pravatar.cc/150?img=2",
        isPinned: false,
        createdBy: "Alice"
    },
    {
        id: 3,
        comment: "Everything is working perfectly now.",
        createdAt: "2026-09-19 11:05",
        avatar: "https://i.pravatar.cc/150?img=3",
        isPinned: false,
        createdBy: "Joe"
    },
    {
        id: 4,
        comment: "Can we add a loading indicator here?",
        createdAt: "2026-09-19 11:45",
        avatar: "https://i.pravatar.cc/150?img=4",
        isPinned: false,
        createdBy: "Jack"
    },
]

const comments = ref(messages)

watch(comments, {})


async function show(evt, msg) {
    activeId.value = msg.id;

    if (showMenu.value) {
        showMenu.value = false
        await new Promise(resolve => setTimeout(resolve, 100))
    }
    menuTarget.value = evt.target.closest('.v-icon-btn')
    showMenu.value = true
}


function onMenuChange(value) {
    showMenu.value = value

    if (!value) {
        activeId.value = null
        menuTarget.value = null
    }
}

function onMenuItemClick() {
    showMenu.value = false
    activeId.value = null
    menuTarget.value = null
}



</script>