<script setup lang="ts">
const { t } = useI18n()

const text = t('app.global.site.title')
</script>

<template>
  <div>{{ text }}</div>
</template>
