<script setup lang="ts">
const { t } = useI18n()

const text = t('app.global.title.site')
</script>

<template>
  <div>{{ text }}</div>
</template>
