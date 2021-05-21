<template>
    <div class="ice-container">
        <comments-and-suggestions suggestionsComments="1" title="新增评审意见" content="意见内容"></comments-and-suggestions>
    </div>
</template>

<script>
    import CommentsAndSuggestions from '../components/CommentsAndSuggestions'
    export default {
        name: "commentAndSug",
        components: {
            CommentsAndSuggestions
        },
        data() {
            return {}
        },
    }
</script>

<style scoped>

</style>