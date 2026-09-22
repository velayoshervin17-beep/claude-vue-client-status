<template>
    <v-container class="comments-page py-8" max-width="1000">
        <div class="page-header mb-6">
            <div class="d-flex align-start justify-space-between ga-6">
                <div class="d-flex align-start ga-4">
                    <v-avatar class="header-icon" color="primary" rounded="lg" size="52">
                        <v-icon icon="mdi-pin-check-outline" size="28" />
                    </v-avatar>
                    <div>
                        <div class="text-overline header-kicker">Property workspace</div>
                        <h1 class="text-h4 font-weight-bold header-title">Pinned comments</h1>
                        <p class="header-copy text-body-2 mt-2">
                            Keep the decisions and details your team needs close by.
                        </p>
                    </div>
                </div>
                <v-chip class="pinned-summary" color="primary" prepend-icon="mdi-pin" size="small" variant="flat">
                    {{ pinnedCount }} pinned
                </v-chip>
            </div>
            <div class="property-strip d-flex flex-wrap align-center ga-3 mt-6">
                <v-icon color="primary" icon="mdi-home-city-outline" size="20" />
                <span class="text-body-2 font-weight-medium">Property #1205</span>
                <v-divider vertical />
                <span class="text-caption text-medium-emphasis">{{ comments.length }} total comments</span>
                <v-spacer />
                <span class="text-caption text-medium-emphasis">Updated Aug 27, 2026</span>
            </div>
        </div>

        <section class="comments-section">
            <div class="d-flex align-center justify-space-between px-1 mb-3">
                <div>
                    <h2 class="text-h6 font-weight-bold">Team discussion</h2>
                    <p class="text-caption text-medium-emphasis mt-1">Select the pin icon to surface a comment.</p>
                </div>
                <v-chip color="secondary" size="small" variant="tonal">Recent first</v-chip>
            </div>
            <div v-if="comments.length" class="comment-list">
                <template v-for="(comment, index) in comments" :key="comment.id">
                    <article :class="['comment-row', { 'comment-row--pinned': comment.is_pinned }]">
                        <div class="d-flex align-start ga-4">
                            <v-avatar class="author-avatar" color="secondary" size="44">
                                <v-img v-if="comment.author.profile_picture" :src="comment.author.profile_picture" />
                                <span v-else>{{ initials(comment.author.full_name) }}</span>
                            </v-avatar>
                            <div class="flex-grow-1 min-width-0">
                                <div class="d-flex flex-wrap align-center ga-2">
                                    <span class="author-name">{{ comment.author.full_name }}</span>
                                    <v-chip v-if="comment.is_mine" color="primary" size="x-small"
                                        variant="tonal">You</v-chip>
                                    <v-chip v-if="comment.is_pinned" class="pin-label" color="warning"
                                        prepend-icon="mdi-pin" size="x-small" variant="tonal">Pinned</v-chip>
                                    <span class="text-caption text-medium-emphasis ml-1">{{
                                        formatDate(comment.created_at) }}</span>
                                </div>
                                <p class="comment-copy text-body-1 mt-2">{{ comment.comment }}</p>
                                <div
                                    class="comment-meta d-flex flex-wrap align-center ga-3 mt-3 text-caption text-medium-emphasis">
                                    <span>#{{ comment.id }}</span>
                                    <span v-if="comment.edit_count"><v-icon icon="mdi-pencil-outline" size="13" />
                                        Edited {{ comment.edit_count }} times</span>
                                    <span v-if="comment.mentions.length"><v-icon icon="mdi-at" size="13" /> {{
                                        comment.mentions.length }} mentions</span>
                                </div>
                            </div>
                            <v-tooltip :text="comment.is_pinned ? 'Unpin comment' : 'Pin comment'" location="top">
                                <template #activator="{ props }">
                                    <v-btn v-bind="props"
                                        :aria-label="comment.is_pinned ? 'Unpin comment' : 'Pin comment'"
                                        :class="{ 'pin-button--active': comment.is_pinned }"
                                        :color="comment.is_pinned ? 'warning' : undefined"
                                        :icon="comment.is_pinned ? 'mdi-pin' : 'mdi-pin-outline'" size="small"
                                        variant="text" @click="togglePin(comment.id)" />
                                </template>
                            </v-tooltip>
                        </div>
                    </article>
                    <div v-if="index < comments.length - 1" class="comment-divider" />
                </template>
            </div>
            <div v-else class="empty-state">
                <v-icon class="mb-3" color="medium-emphasis" icon="mdi-pin-off-outline" size="40" />
                <div class="text-body-1 font-weight-medium">No pinned comments</div>
                <div class="text-body-2 text-medium-emphasis mt-1">Pin a comment to keep it at hand.</div>
            </div>
        </section>
    </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface CommentAuthor {
    id: number
    full_name: string
    profile_picture: string | null
}

interface PropertyComment {
    id: number
    commentable_type: string
    commentable_id: number
    comment: string
    created_at: string
    updated_at: string
    edit_count: number
    is_pinned: boolean
    author: CommentAuthor
    mentions: unknown[]
    is_mine: boolean
}

const comments = ref<PropertyComment[]>([
    {
        id: 56,
        commentable_type: 'property',
        commentable_id: 1205,
        comment: 'own comment entry',
        created_at: '2026-08-27T02:33:18.000000Z',
        updated_at: '2026-08-27T02:33:18.000000Z',
        edit_count: 0,
        is_pinned: false,
        author: { id: 31, full_name: 'Sales Sales', profile_picture: null },
        mentions: [],
        is_mine: false,
    },
    {
        id: 55,
        commentable_type: 'property',
        commentable_id: 1205,
        comment: 'own comment testa asdasda\n\n\nasdadasd',
        created_at: '2026-08-27T02:15:52.000000Z',
        updated_at: '2026-08-27T02:32:52.000000Z',
        edit_count: 2,
        is_pinned: false,
        author: { id: 31, full_name: 'Sales Sales', profile_picture: null },
        mentions: [],
        is_mine: false,
    },
])

const pinnedCount = computed(() => comments.value.filter((comment) => comment.is_pinned).length)

function togglePin(commentId: number) {
    const comment = comments.value.find((item) => item.id === commentId)
    if (comment) comment.is_pinned = !comment.is_pinned
}

function initials(name: string) {
    return name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date))
}
</script>

<style scoped>
.comments-page {
    color: #1c2733;
}

.page-header {
    border: 1px solid #dfe5e8;
    border-radius: 14px;
    background: #f4f8f7;
    padding: 28px 30px 0;
}

.header-icon {
    color: white;
    box-shadow: 0 8px 18px rgba(35, 104, 91, 0.2);
}

.header-kicker {
    color: #287766;
    font-weight: 700;
    letter-spacing: 0.12em;
}

.header-title {
    letter-spacing: -0.02em;
}

.header-copy {
    color: #617078;
}

.pinned-summary {
    color: white;
}

.property-strip {
    border-top: 1px solid #dfe5e8;
    min-height: 54px;
}

.comments-section {
    margin-top: 34px;
}

.comment-list {
    overflow: hidden;
    border: 1px solid #dfe5e8;
    border-radius: 14px;
    background: white;
}

.comment-row {
    padding: 22px 24px;
    border-left: 3px solid transparent;
    transition: background-color 160ms ease, border-color 160ms ease;
}

.comment-row:hover {
    background: #f8faf9;
}

.comment-row--pinned {
    border-left-color: #e6a23c;
    background: #fffaf1;
}

.comment-row--pinned:hover {
    background: #fff7e8;
}

.author-avatar {
    color: #1e695b;
    font-size: 0.8rem;
    font-weight: 700;
}

.author-name {
    color: #1c2733;
    font-weight: 700;
}

.pin-label {
    font-weight: 600;
}

.pin-button--active {
    background: rgba(230, 162, 60, 0.13);
}

.comment-copy {
    white-space: pre-wrap;
    color: #34444d;
    line-height: 1.65;
}

.comment-meta span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.comment-divider {
    height: 1px;
    margin: 0 24px;
    background: #e8edef;
}

.empty-state {
    border: 1px solid #dfe5e8;
    border-radius: 14px;
    padding: 56px 24px;
    text-align: center;
    background: white;
}

.min-width-0 {
    min-width: 0;
}

@media (max-width: 600px) {
    .page-header {
        padding: 22px 18px 0;
    }

    .comment-row {
        padding: 18px 16px;
    }

    .comment-divider {
        margin: 0 16px;
    }
}
</style>