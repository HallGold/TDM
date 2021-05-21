<template>
    <div class="ice-container">
        <comments-and-suggestions suggestionsComments="0" title="新增征求建议" content="建议内容"></comments-and-suggestions>
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