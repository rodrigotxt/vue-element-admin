<template>
  <el-form ref="form" label-width="180px">
    <el-form-item label="Nome da Raça">
      <el-col :span="12">
        <el-input v-model="form.nome" required="true" />
      </el-col>
    </el-form-item>
    <el-form-item v-if="config.especies" label="Espécie">
      <el-select v-model="form.especie_id" placeholder="selecione uma espécie">
        <el-option v-for="(especie, index) in config.especies" :key="index" :label="especie.nome" :value="especie.id" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>

import axios from 'axios'

export default{
  props: ['form'],
  data() {
    return {
      config: {}
    }
  },
  mounted() {
    this.getEspecies()
  },
  methods: {
    getEspecies: function() {
      const self = this
      const parent = self.$parent.$parent
      // const parent = this.$refs.detailsChild
      parent.loading = true
      axios.get(parent.appURL + 'especies')
        .then(
          function(response) {
            var especies = response.data
            self.config.especies = especies
          })
        .catch(function(error) {
          console.log(error)
        })
        .finally(() => (parent.loading = false))
    }
  }
}
</script>
