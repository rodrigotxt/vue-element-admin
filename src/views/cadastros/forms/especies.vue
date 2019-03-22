<template>
  <el-form ref="form" label-width="180px">
    <el-form-item label="Nome da Espécie">
      <el-col :span="12">
        <el-input v-model="form.name" required="true"/>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
export default{
  props: ['form']
}
</script>
