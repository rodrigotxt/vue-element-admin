<template>
  <el-form ref="form" label-width="180px">
    <el-form-item label="Nome do Exame">
      <el-col :span="12">
        <el-input v-model="form.nome" required="true"/>
      </el-col>
    </el-form-item>
    <el-form-item label="Descrição">
      <el-col :span="12">
        <el-input v-model="form.descricao" />
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
export default{
  props: ['form'],
  data() {
    return {
      config: {}
    }
  },
  mounted() {

  },
  methods: {}
}
</script>
