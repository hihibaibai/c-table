<template>
  <div>
    <div id="tablePlace"></div>
  </div>
</template>

<script>
import table from '@/components/table/index'
export default {
  name: "index",
  mounted() {
    this.xs = table.create('#tablePlace',()=>1200,()=>400).render();
  },
  data(){
    return {
      xs:{}
    }
  },
}
</script>



<style scoped>

</style>