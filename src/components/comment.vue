<template>

</template>

<script up>

const props = defineProps({
    id: {
        type: number,
        required,
    },
    comment: {
        type: String,
        required,
    },
    createdAt: {
        type: String,
        required,
    },
    avatar: {
        type: String,
        required
    },
    isPinned: {
        type: Boolean,
        default: false
    }
})


</script>

<!-- <comment id:message?.id comment:message.comment createdAt:message.createdAt avatar:message.avatar
            isPinned:message.isPinned></comment> -->